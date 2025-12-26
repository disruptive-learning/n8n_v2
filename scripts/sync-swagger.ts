#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

const SWAGGER_URL = 'https://storage.googleapis.com/gigstackpro.appspot.com/api-docs/swagger-2025-12-26-192731453Z.yaml';
const DESCRIPTIONS_DIR = path.join(__dirname, '..', 'nodes', 'Gigstack', 'descriptions');

interface SwaggerPath {
	[method: string]: {
		summary?: string;
		description?: string;
		operationId?: string;
		tags?: string[];
		parameters?: SwaggerParameter[];
		requestBody?: {
			content?: {
				'application/json'?: {
					schema?: SwaggerSchema;
				};
			};
		};
		responses?: {
			[code: string]: {
				description?: string;
				content?: {
					'application/json'?: {
						schema?: SwaggerSchema;
					};
				};
			};
		};
	};
}

interface SwaggerParameter {
	name: string;
	in: 'query' | 'path' | 'header';
	required?: boolean;
	description?: string;
	schema?: SwaggerSchema;
}

interface SwaggerSchema {
	type?: string;
	properties?: {
		[key: string]: SwaggerSchema & { description?: string };
	};
	required?: string[];
	items?: SwaggerSchema;
	enum?: string[];
	$ref?: string;
}

interface SwaggerSpec {
	openapi?: string;
	swagger?: string;
	info?: {
		title?: string;
		version?: string;
	};
	paths?: {
		[path: string]: SwaggerPath;
	};
	components?: {
		schemas?: {
			[name: string]: SwaggerSchema;
		};
	};
}

interface EndpointInfo {
	path: string;
	method: string;
	summary: string;
	description: string;
	operationId: string;
	tags: string[];
	parameters: SwaggerParameter[];
	requestBodySchema: SwaggerSchema | null;
	responseSchema: SwaggerSchema | null;
}

interface ResourceComparison {
	resource: string;
	swaggerEndpoints: EndpointInfo[];
	nodeOperations: string[];
	missing: string[];
	extra: string[];
	matched: string[];
}

// Map Swagger tags to n8n resource names
const TAG_TO_RESOURCE: { [key: string]: string } = {
	'Clients': 'client',
	'Services': 'service',
	'Invoices': 'invoice',
	'Payments': 'payment',
	'Receipts': 'receipt',
	'Teams': 'team',
	'Users': 'user',
	'Webhooks': 'webhook',
};

// Map HTTP methods + path patterns to n8n operations
function guessOperationName(method: string, path: string, operationId?: string): string {
	const lowerMethod = method.toLowerCase();

	// Use operationId if available
	if (operationId) {
		return operationId;
	}

	// Guess based on method and path
	if (lowerMethod === 'get') {
		if (path.includes('{') || path.includes(':')) {
			return 'get';
		}
		return 'getAll';
	}
	if (lowerMethod === 'post') {
		if (path.includes('/validate')) return 'validate';
		if (path.includes('/stamp')) return 'stamp';
		if (path.includes('/paid')) return 'markAsPaid';
		if (path.includes('/refund')) return 'refund';
		if (path.includes('/request')) return 'request';
		if (path.includes('/register')) return 'register';
		return 'create';
	}
	if (lowerMethod === 'put') return 'update';
	if (lowerMethod === 'delete') return 'delete';

	return `${lowerMethod}`;
}

async function fetchSwagger(): Promise<SwaggerSpec> {
	console.log(`\n📥 Fetching Swagger spec from:\n   ${SWAGGER_URL}\n`);

	const response = await fetch(SWAGGER_URL);
	if (!response.ok) {
		throw new Error(`Failed to fetch Swagger: ${response.status} ${response.statusText}`);
	}

	const text = await response.text();
	return yaml.parse(text) as SwaggerSpec;
}

function parseSwaggerEndpoints(spec: SwaggerSpec): EndpointInfo[] {
	const endpoints: EndpointInfo[] = [];

	if (!spec.paths) {
		console.warn('No paths found in Swagger spec');
		return endpoints;
	}

	for (const [pathStr, pathObj] of Object.entries(spec.paths)) {
		for (const [method, operation] of Object.entries(pathObj)) {
			if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
				const endpoint: EndpointInfo = {
					path: pathStr,
					method: method.toUpperCase(),
					summary: operation.summary || '',
					description: operation.description || '',
					operationId: operation.operationId || '',
					tags: operation.tags || [],
					parameters: operation.parameters || [],
					requestBodySchema: operation.requestBody?.content?.['application/json']?.schema || null,
					responseSchema: operation.responses?.['200']?.content?.['application/json']?.schema ||
					                operation.responses?.['201']?.content?.['application/json']?.schema || null,
				};
				endpoints.push(endpoint);
			}
		}
	}

	return endpoints;
}

function extractNodeOperations(descriptionFile: string): string[] {
	const operations: string[] = [];

	try {
		const content = fs.readFileSync(descriptionFile, 'utf-8');

		// Extract operation values from the TypeScript file
		const operationMatch = content.match(/options:\s*\[([\s\S]*?)\],\s*default:/);
		if (operationMatch) {
			const optionsBlock = operationMatch[1];
			const valueMatches = optionsBlock.matchAll(/value:\s*['"]([^'"]+)['"]/g);
			for (const match of valueMatches) {
				operations.push(match[1]);
			}
		}
	} catch (error) {
		console.warn(`Could not read ${descriptionFile}: ${error}`);
	}

	return operations;
}

function compareResources(endpoints: EndpointInfo[]): ResourceComparison[] {
	const comparisons: ResourceComparison[] = [];

	// Group endpoints by resource/tag
	const endpointsByResource: { [resource: string]: EndpointInfo[] } = {};

	for (const endpoint of endpoints) {
		for (const tag of endpoint.tags) {
			const resource = TAG_TO_RESOURCE[tag] || tag.toLowerCase();
			if (!endpointsByResource[resource]) {
				endpointsByResource[resource] = [];
			}
			endpointsByResource[resource].push(endpoint);
		}
	}

	// Compare with node descriptions
	for (const [resource, resourceEndpoints] of Object.entries(endpointsByResource)) {
		const descriptionFile = path.join(
			DESCRIPTIONS_DIR,
			`${resource.charAt(0).toUpperCase() + resource.slice(1)}Description.ts`
		);

		const nodeOperations = extractNodeOperations(descriptionFile);

		// Get swagger operation names
		const swaggerOperations = resourceEndpoints.map(e =>
			guessOperationName(e.method, e.path, e.operationId)
		);

		// Find missing and extra
		const missing = swaggerOperations.filter(op => !nodeOperations.includes(op));
		const extra = nodeOperations.filter(op => !swaggerOperations.includes(op));
		const matched = nodeOperations.filter(op => swaggerOperations.includes(op));

		comparisons.push({
			resource,
			swaggerEndpoints: resourceEndpoints,
			nodeOperations,
			missing,
			extra,
			matched,
		});
	}

	return comparisons;
}

function printReport(comparisons: ResourceComparison[], endpoints: EndpointInfo[]): void {
	console.log('═══════════════════════════════════════════════════════════════');
	console.log('                    GIGSTACK API SYNC REPORT                   ');
	console.log('═══════════════════════════════════════════════════════════════\n');

	// Summary
	console.log('📊 SUMMARY\n');
	console.log(`   Total API Endpoints: ${endpoints.length}`);
	console.log(`   Resources Found: ${comparisons.length}`);

	let totalMissing = 0;
	let totalExtra = 0;
	let totalMatched = 0;

	for (const comp of comparisons) {
		totalMissing += comp.missing.length;
		totalExtra += comp.extra.length;
		totalMatched += comp.matched.length;
	}

	console.log(`\n   ✅ Matched Operations: ${totalMatched}`);
	console.log(`   ⚠️  Missing in Node: ${totalMissing}`);
	console.log(`   ❓ Extra in Node (custom): ${totalExtra}`);

	console.log('\n───────────────────────────────────────────────────────────────\n');

	// Details by resource
	for (const comp of comparisons) {
		console.log(`📦 ${comp.resource.toUpperCase()}`);
		console.log(`   Swagger Endpoints: ${comp.swaggerEndpoints.length}`);
		console.log(`   Node Operations: ${comp.nodeOperations.length}`);

		if (comp.matched.length > 0) {
			console.log(`\n   ✅ Matched: ${comp.matched.join(', ')}`);
		}

		if (comp.missing.length > 0) {
			console.log(`\n   ⚠️  Missing in node (needs implementation):`);
			for (const op of comp.missing) {
				const endpoint = comp.swaggerEndpoints.find(
					e => guessOperationName(e.method, e.path, e.operationId) === op
				);
				if (endpoint) {
					console.log(`      - ${op}: ${endpoint.method} ${endpoint.path}`);
					if (endpoint.summary) {
						console.log(`        "${endpoint.summary}"`);
					}
				} else {
					console.log(`      - ${op}`);
				}
			}
		}

		if (comp.extra.length > 0) {
			console.log(`\n   ❓ Extra in node (custom operations):`);
			for (const op of comp.extra) {
				console.log(`      - ${op}`);
			}
		}

		console.log('\n───────────────────────────────────────────────────────────────\n');
	}

	// Full endpoint list
	console.log('📋 ALL API ENDPOINTS\n');

	const groupedByTag: { [tag: string]: EndpointInfo[] } = {};
	for (const endpoint of endpoints) {
		const tag = endpoint.tags[0] || 'Other';
		if (!groupedByTag[tag]) {
			groupedByTag[tag] = [];
		}
		groupedByTag[tag].push(endpoint);
	}

	for (const [tag, tagEndpoints] of Object.entries(groupedByTag)) {
		console.log(`   ${tag}:`);
		for (const endpoint of tagEndpoints) {
			console.log(`      ${endpoint.method.padEnd(6)} ${endpoint.path}`);
			if (endpoint.summary) {
				console.log(`             └─ ${endpoint.summary}`);
			}
		}
		console.log('');
	}
}

function generateMissingOperationCode(endpoint: EndpointInfo, resource: string): string {
	const operationName = guessOperationName(endpoint.method, endpoint.path, endpoint.operationId);

	let code = `\n// Auto-generated from Swagger: ${endpoint.method} ${endpoint.path}\n`;
	code += `// ${endpoint.summary || 'No description'}\n`;
	code += `{\n`;
	code += `  name: '${operationName.charAt(0).toUpperCase() + operationName.slice(1).replace(/([A-Z])/g, ' $1').trim()}',\n`;
	code += `  value: '${operationName}',\n`;
	code += `  description: '${endpoint.summary || endpoint.description || `${endpoint.method} ${endpoint.path}`}',\n`;
	code += `  action: '${operationName.charAt(0).toUpperCase() + operationName.slice(1).replace(/([A-Z])/g, ' $1').trim().toLowerCase()} a ${resource}',\n`;
	code += `},\n`;

	return code;
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const showHelp = args.includes('--help') || args.includes('-h');
	const verbose = args.includes('--verbose') || args.includes('-v');
	const generateCode = args.includes('--generate') || args.includes('-g');

	if (showHelp) {
		console.log(`
Gigstack n8n Node - Swagger Sync Tool

Usage: npm run sync-swagger [options]

Options:
  -h, --help      Show this help message
  -v, --verbose   Show detailed endpoint information
  -g, --generate  Generate code snippets for missing operations

This tool fetches the Gigstack API Swagger specification and compares it
with the current n8n node implementations to identify:
  - Missing operations that need to be implemented
  - Extra operations in the node (custom implementations)
  - Matched operations between Swagger and node

Swagger URL: ${SWAGGER_URL}
`);
		return;
	}

	try {
		const spec = await fetchSwagger();

		console.log(`✅ Swagger loaded: ${spec.info?.title || 'Unknown'} v${spec.info?.version || 'Unknown'}\n`);

		const endpoints = parseSwaggerEndpoints(spec);
		const comparisons = compareResources(endpoints);

		printReport(comparisons, endpoints);

		if (generateCode) {
			console.log('═══════════════════════════════════════════════════════════════');
			console.log('                    GENERATED CODE SNIPPETS                    ');
			console.log('═══════════════════════════════════════════════════════════════\n');

			for (const comp of comparisons) {
				if (comp.missing.length > 0) {
					console.log(`\n// === ${comp.resource.toUpperCase()} - Missing Operations ===\n`);

					for (const opName of comp.missing) {
						const endpoint = comp.swaggerEndpoints.find(
							e => guessOperationName(e.method, e.path, e.operationId) === opName
						);
						if (endpoint) {
							console.log(generateMissingOperationCode(endpoint, comp.resource));
						}
					}
				}
			}
		}

		// Exit code based on missing operations
		const totalMissing = comparisons.reduce((sum, c) => sum + c.missing.length, 0);
		if (totalMissing > 0) {
			console.log(`\n⚠️  Found ${totalMissing} missing operation(s). Run with --generate to see code snippets.\n`);
		} else {
			console.log('\n✅ All Swagger endpoints are implemented in the node!\n');
		}

	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

main();
