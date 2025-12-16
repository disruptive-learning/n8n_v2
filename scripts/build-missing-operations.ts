#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

const SWAGGER_URL = 'https://storage.googleapis.com/gigstackpro.appspot.com/api-docs/swagger.yaml';
const NODES_DIR = path.join(__dirname, '..', 'nodes', 'Gigstack');
const DESCRIPTIONS_DIR = path.join(NODES_DIR, 'descriptions');

// ============================================================================
// Types
// ============================================================================

interface SwaggerParameter {
	name: string;
	in: 'query' | 'path' | 'header' | 'body';
	required?: boolean;
	description?: string;
	schema?: SwaggerSchema;
	type?: string;
	enum?: string[];
}

interface SwaggerSchema {
	type?: string;
	format?: string;
	properties?: { [key: string]: SwaggerSchema & { description?: string; enum?: string[] } };
	required?: string[];
	items?: SwaggerSchema;
	enum?: string[];
	$ref?: string;
	description?: string;
}

interface SwaggerOperation {
	summary?: string;
	description?: string;
	operationId?: string;
	tags?: string[];
	parameters?: SwaggerParameter[];
	requestBody?: {
		required?: boolean;
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
}

interface SwaggerSpec {
	openapi?: string;
	info?: { title?: string; version?: string };
	paths?: { [path: string]: { [method: string]: SwaggerOperation } };
	components?: { schemas?: { [name: string]: SwaggerSchema } };
}

interface EndpointInfo {
	path: string;
	method: string;
	operation: SwaggerOperation;
	resource: string;
	operationName: string;
}

interface GeneratedOperation {
	operationDef: string;
	fieldsDef: string;
	executeDef: string;
}

// ============================================================================
// Mappings
// ============================================================================

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

// Known operations already implemented (to avoid duplicates)
// Note: 'cancel' is equivalent to 'delete' for invoice, payment, receipt
const EXISTING_OPERATIONS: { [resource: string]: string[] } = {
	client: ['create', 'delete', 'get', 'getAll', 'update', 'validate', 'getCustomerPortal', 'stampPendingReceipts', 'uploadCsf'],
	service: ['create', 'delete', 'get', 'getAll', 'update'],
	invoice: ['createIncome', 'createEgress', 'get', 'getIncome', 'getEgress', 'getPayment', 'getAllIncome', 'getAllEgress', 'getAllPayment', 'cancel', 'delete', 'getFiles'],
	payment: ['request', 'register', 'get', 'getAll', 'cancel', 'delete', 'markAsPaid', 'refund'],
	receipt: ['create', 'get', 'getAll', 'cancel', 'delete', 'stamp'],
	team: ['create', 'get', 'getAll', 'update', 'getIntegrations', 'addMember', 'removeMember', 'getSeries', 'createSeries', 'updateSeries', 'updateSettings', 'getOnboardingUrl', 'uploadSatCertificates'],
	user: ['create', 'get', 'getAll', 'update', 'resetPassword', 'loginLink'],
	webhook: ['create', 'get', 'getAll', 'update', 'delete'],
};

// ============================================================================
// Helpers
// ============================================================================

function resolveRef(ref: string, spec: SwaggerSpec): SwaggerSchema | null {
	if (!ref.startsWith('#/components/schemas/')) return null;
	const schemaName = ref.replace('#/components/schemas/', '');
	return spec.components?.schemas?.[schemaName] || null;
}

function getOperationName(method: string, path: string, operation: SwaggerOperation): string {
	// Use operationId if available and clean
	if (operation.operationId) {
		const opId = operation.operationId
			.replace(/^(get|post|put|delete|patch)/i, '')
			.replace(/Controller_/i, '')
			.replace(/_/g, '');
		if (opId) {
			return opId.charAt(0).toLowerCase() + opId.slice(1);
		}
	}

	const lowerMethod = method.toLowerCase();
	const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
	const lastPart = pathParts[pathParts.length - 1];

	// Special mappings based on path patterns
	if (path.includes('/csf')) return 'uploadCsf';
	if (path.includes('/sat-connection')) return 'uploadSatCertificates';
	if (path.includes('/stamp-pending')) return 'stampPendingReceipts';
	if (path.includes('/customerportal')) return 'getCustomerPortal';
	if (path.includes('/onboarding-url')) return 'getOnboardingUrl';
	if (path.includes('/login-link')) return 'loginLink';
	if (path.includes('/reset-password')) return 'resetPassword';
	if (path.includes('/add-member')) return 'addMember';
	if (path.includes('/remove-member')) return 'removeMember';
	if (path.includes('/integrations')) return 'getIntegrations';
	if (path.includes('/paid')) return 'markAsPaid';
	if (path.includes('/refund')) return 'refund';
	if (path.includes('/stamp') && !path.includes('/stamp-pending')) return 'stamp';

	// Invoice-specific operations with subtypes
	if (path.includes('/invoices/income')) {
		if (lowerMethod === 'get' && !path.includes('{')) return 'getAllIncome';
		if (lowerMethod === 'get') return 'getIncome';
		if (lowerMethod === 'post') return 'createIncome';
	}
	if (path.includes('/invoices/egress')) {
		if (lowerMethod === 'get' && !path.includes('{')) return 'getAllEgress';
		if (lowerMethod === 'get') return 'getEgress';
		if (lowerMethod === 'post') return 'createEgress';
	}
	if (path.includes('/invoices/payment')) {
		if (lowerMethod === 'get' && !path.includes('{')) return 'getAllPayment';
		if (lowerMethod === 'get') return 'getPayment';
		if (lowerMethod === 'post') return 'createPayment';
	}
	if (path.includes('/files')) return 'getFiles';
	if (path.includes('/series') && lowerMethod === 'get' && !path.includes('{seriesId}')) return 'getSeries';
	if (path.includes('/series') && lowerMethod === 'post') return 'createSeries';
	if (path.includes('/series') && lowerMethod === 'put') return 'updateSeries';
	if (path.includes('/settings')) return 'updateSettings';
	if (path.includes('/request')) return 'request';
	if (path.includes('/register')) return 'register';
	if (path.includes('/validate')) return 'validate';

	// Generic mappings
	if (lowerMethod === 'get' && path.includes('{')) return 'get';
	if (lowerMethod === 'get') return 'getAll';
	if (lowerMethod === 'post') return 'create';
	if (lowerMethod === 'put') return 'update';
	if (lowerMethod === 'delete') return 'delete';

	return `${lowerMethod}${lastPart ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1) : ''}`;
}

function formatDisplayName(name: string): string {
	return name
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, str => str.toUpperCase())
		.trim();
}

function schemaToN8nType(schema: SwaggerSchema): string {
	if (schema.enum) return 'options';
	switch (schema.type) {
		case 'integer':
		case 'number':
			return 'number';
		case 'boolean':
			return 'boolean';
		case 'array':
			return 'json';
		case 'object':
			return 'json';
		default:
			return 'string';
	}
}

// ============================================================================
// Code Generators
// ============================================================================

function generateOperationOption(endpoint: EndpointInfo): string {
	const { operationName, operation } = endpoint;
	const displayName = formatDisplayName(operationName);
	const description = operation.summary || operation.description || `${endpoint.method} ${endpoint.path}`;

	return `			{
				name: '${displayName}',
				value: '${operationName}',
				description: '${description.replace(/'/g, "\\'")}',
				action: '${displayName.toLowerCase()}',
			},`;
}

function generateFieldsForEndpoint(endpoint: EndpointInfo, spec: SwaggerSpec): string {
	const { path, method, operation, resource, operationName } = endpoint;
	const fields: string[] = [];

	// Path parameters
	const pathParams = (operation.parameters || []).filter(p => p.in === 'path');
	for (const param of pathParams) {
		const fieldName = param.name === 'id' ? `${resource}Id` : param.name;
		fields.push(`	{
		displayName: '${formatDisplayName(fieldName)}',
		name: '${fieldName}',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['${resource}'],
				operation: ['${operationName}'],
			},
		},
		description: '${(param.description || `The ${param.name}`).replace(/'/g, "\\'")}',
	},`);
	}

	// Request body fields
	let bodySchema = operation.requestBody?.content?.['application/json']?.schema;
	if (bodySchema?.$ref) {
		bodySchema = resolveRef(bodySchema.$ref, spec) || bodySchema;
	}

	if (bodySchema?.properties) {
		const required = bodySchema.required || [];
		const requiredProps = Object.entries(bodySchema.properties).filter(([key]) => required.includes(key));
		const optionalProps = Object.entries(bodySchema.properties).filter(([key]) => !required.includes(key));

		// Required fields first
		for (const [propName, propSchema] of requiredProps) {
			const n8nType = schemaToN8nType(propSchema);
			let fieldDef = `	{
		displayName: '${formatDisplayName(propName)}',
		name: '${propName}',
		type: '${n8nType}',
		required: true,
		default: ${n8nType === 'number' ? '0' : n8nType === 'boolean' ? 'false' : "''"},
		displayOptions: {
			show: {
				resource: ['${resource}'],
				operation: ['${operationName}'],
			},
		},`;

			if (propSchema.enum) {
				fieldDef += `
		options: [
${propSchema.enum.map(e => `			{ name: '${e}', value: '${e}' },`).join('\n')}
		],`;
			}

			fieldDef += `
		description: '${(propSchema.description || formatDisplayName(propName)).replace(/'/g, "\\'")}',
	},`;
			fields.push(fieldDef);
		}

		// Optional fields as collection
		if (optionalProps.length > 0) {
			const optionFields = optionalProps.map(([propName, propSchema]) => {
				const n8nType = schemaToN8nType(propSchema);
				let optField = `			{
				displayName: '${formatDisplayName(propName)}',
				name: '${propName}',
				type: '${n8nType}',
				default: ${n8nType === 'number' ? '0' : n8nType === 'boolean' ? 'false' : "''"},`;

				if (propSchema.enum) {
					optField += `
				options: [
${propSchema.enum.map(e => `					{ name: '${e}', value: '${e}' },`).join('\n')}
				],`;
				}

				optField += `
				description: '${(propSchema.description || '').replace(/'/g, "\\'")}',
			},`;
				return optField;
			});

			fields.push(`	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['${resource}'],
				operation: ['${operationName}'],
			},
		},
		options: [
${optionFields.join('\n')}
		],
	},`);
		}
	}

	// Query parameters
	const queryParams = (operation.parameters || []).filter(p => p.in === 'query');
	if (queryParams.length > 0) {
		const queryFields = queryParams.map(param => {
			const n8nType = param.schema ? schemaToN8nType(param.schema) : 'string';
			let qField = `			{
				displayName: '${formatDisplayName(param.name)}',
				name: '${param.name}',
				type: '${n8nType}',
				default: ${n8nType === 'number' ? '0' : n8nType === 'boolean' ? 'false' : "''"},`;

			if (param.enum || param.schema?.enum) {
				const enumValues = param.enum || param.schema?.enum || [];
				qField += `
				options: [
${enumValues.map(e => `					{ name: '${e}', value: '${e}' },`).join('\n')}
				],`;
			}

			qField += `
				description: '${(param.description || '').replace(/'/g, "\\'")}',
			},`;
			return qField;
		});

		fields.push(`	{
		displayName: 'Query Parameters',
		name: 'queryParams',
		type: 'collection',
		placeholder: 'Add Parameter',
		default: {},
		displayOptions: {
			show: {
				resource: ['${resource}'],
				operation: ['${operationName}'],
			},
		},
		options: [
${queryFields.join('\n')}
		],
	},`);
	}

	return fields.join('\n');
}

function generateExecuteCode(endpoint: EndpointInfo, spec: SwaggerSpec): string {
	const { path, method, operation, resource, operationName } = endpoint;

	// Build the API path with parameter substitution
	let apiPath = path
		.replace(/\{id\}/g, '${' + resource + 'Id}')
		.replace(/\{(\w+)\}/g, (_, p1) => '${' + p1 + '}');

	// Get path parameters
	const pathParams = (operation.parameters || []).filter(p => p.in === 'path');
	const pathParamCode = pathParams.map(p => {
		const varName = p.name === 'id' ? `${resource}Id` : p.name;
		return `						const ${varName} = this.getNodeParameter('${varName}', i) as string;`;
	}).join('\n');

	// Check if there's a request body
	let bodySchema = operation.requestBody?.content?.['application/json']?.schema;
	if (bodySchema?.$ref) {
		bodySchema = resolveRef(bodySchema.$ref, spec) || bodySchema;
	}

	let bodyCode = '';
	if (bodySchema?.properties && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
		const required = bodySchema.required || [];
		const requiredProps = Object.keys(bodySchema.properties).filter(k => required.includes(k));
		const optionalProps = Object.keys(bodySchema.properties).filter(k => !required.includes(k));

		if (requiredProps.length > 0 || optionalProps.length > 0) {
			bodyCode = `
						const body: IDataObject = {};`;

			for (const prop of requiredProps) {
				bodyCode += `
						body.${prop} = this.getNodeParameter('${prop}', i);`;
			}

			if (optionalProps.length > 0) {
				bodyCode += `
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);`;
			}
		}
	}

	// Query params
	let queryCode = '';
	const queryParams = (operation.parameters || []).filter(p => p.in === 'query');
	if (queryParams.length > 0) {
		queryCode = `
						const queryParams = this.getNodeParameter('queryParams', i, {}) as IDataObject;
						Object.assign(qs, queryParams);`;
	}

	const hasBody = bodyCode !== '';
	const bodyArg = hasBody ? 'body' : '{}';

	return `					} else if (operation === '${operationName}') {
${pathParamCode}${bodyCode}${queryCode}
						responseData = await gigstackApiRequest.call(this, '${method.toUpperCase()}', \`${apiPath}\`, ${bodyArg}, qs);
						responseData = simplifyResponse(responseData);`;
}

// ============================================================================
// Main Logic
// ============================================================================

async function fetchSwagger(): Promise<SwaggerSpec> {
	console.log('📥 Fetching Swagger spec...\n');
	const response = await fetch(SWAGGER_URL);
	if (!response.ok) {
		throw new Error(`Failed to fetch Swagger: ${response.status}`);
	}
	const text = await response.text();
	return yaml.parse(text) as SwaggerSpec;
}

function findMissingEndpoints(spec: SwaggerSpec): EndpointInfo[] {
	const missing: EndpointInfo[] = [];

	if (!spec.paths) return missing;

	for (const [pathStr, pathObj] of Object.entries(spec.paths)) {
		for (const [method, operation] of Object.entries(pathObj)) {
			if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) continue;

			const tags = operation.tags || [];
			for (const tag of tags) {
				const resource = TAG_TO_RESOURCE[tag];
				if (!resource) continue;

				const operationName = getOperationName(method, pathStr, operation);
				const existing = EXISTING_OPERATIONS[resource] || [];

				if (!existing.includes(operationName)) {
					missing.push({
						path: pathStr,
						method: method.toUpperCase(),
						operation,
						resource,
						operationName,
					});
				}
			}
		}
	}

	return missing;
}

function groupByResource(endpoints: EndpointInfo[]): { [resource: string]: EndpointInfo[] } {
	const grouped: { [resource: string]: EndpointInfo[] } = {};
	for (const ep of endpoints) {
		if (!grouped[ep.resource]) grouped[ep.resource] = [];
		grouped[ep.resource].push(ep);
	}
	return grouped;
}

async function updateDescriptionFile(resource: string, endpoints: EndpointInfo[], spec: SwaggerSpec): Promise<void> {
	const fileName = `${resource.charAt(0).toUpperCase() + resource.slice(1)}Description.ts`;
	const filePath = path.join(DESCRIPTIONS_DIR, fileName);

	if (!fs.existsSync(filePath)) {
		console.log(`   ⚠️  File not found: ${fileName}, skipping...`);
		return;
	}

	let content = fs.readFileSync(filePath, 'utf-8');

	// Generate new operation options
	const newOperations = endpoints.map(ep => generateOperationOption(ep)).join('\n');

	// Generate new fields
	const newFields = endpoints.map(ep => generateFieldsForEndpoint(ep, spec)).filter(f => f).join('\n');

	// Find insertion points and add new code
	// Insert operations before the closing of the options array
	const operationsMatch = content.match(/(options:\s*\[[\s\S]*?)((\s*\],\s*default:))/);
	if (operationsMatch) {
		const insertPoint = operationsMatch.index! + operationsMatch[1].length;
		content = content.slice(0, insertPoint) + '\n' + newOperations + content.slice(insertPoint);
	}

	// Insert fields before the closing of the fields array
	const fieldsMatch = content.match(/(export const \w+Fields: INodeProperties\[\] = \[[\s\S]*?)(\n\];?\s*$)/);
	if (fieldsMatch && newFields) {
		const insertPoint = fieldsMatch.index! + fieldsMatch[1].length;
		content = content.slice(0, insertPoint) + '\n\n' + `	// ----------------------------------\n	//         ${resource}: auto-generated\n	// ----------------------------------\n` + newFields + content.slice(insertPoint);
	}

	fs.writeFileSync(filePath, content);
	console.log(`   ✅ Updated ${fileName}`);
}

function generateExecuteCodeBlock(resource: string, endpoints: EndpointInfo[], spec: SwaggerSpec): string {
	const cases = endpoints.map(ep => generateExecuteCode(ep, spec)).join('\n');
	return `\n				// Auto-generated operations for ${resource}\n${cases}`;
}

async function main(): Promise<void> {
	console.log('═══════════════════════════════════════════════════════════════');
	console.log('           GIGSTACK N8N NODE - AUTO-BUILDER AGENT              ');
	console.log('═══════════════════════════════════════════════════════════════\n');

	try {
		const spec = await fetchSwagger();
		console.log(`✅ Loaded: ${spec.info?.title} v${spec.info?.version}\n`);

		const missing = findMissingEndpoints(spec);

		if (missing.length === 0) {
			console.log('🎉 No missing operations found! All endpoints are implemented.\n');
			return;
		}

		console.log(`Found ${missing.length} missing operation(s):\n`);

		const grouped = groupByResource(missing);

		for (const [resource, endpoints] of Object.entries(grouped)) {
			console.log(`\n📦 ${resource.toUpperCase()} (${endpoints.length} operations)`);
			for (const ep of endpoints) {
				console.log(`   - ${ep.operationName}: ${ep.method} ${ep.path}`);
			}
		}

		console.log('\n───────────────────────────────────────────────────────────────');
		console.log('                    GENERATING CODE                            ');
		console.log('───────────────────────────────────────────────────────────────\n');

		// Update description files
		for (const [resource, endpoints] of Object.entries(grouped)) {
			console.log(`\n📝 Updating ${resource} descriptions...`);
			await updateDescriptionFile(resource, endpoints, spec);
		}

		// Generate execute code for manual insertion
		console.log('\n───────────────────────────────────────────────────────────────');
		console.log('      EXECUTE CODE (add to Gigstack.node.ts manually)          ');
		console.log('───────────────────────────────────────────────────────────────\n');

		for (const [resource, endpoints] of Object.entries(grouped)) {
			const code = generateExecuteCodeBlock(resource, endpoints, spec);
			console.log(`\n// === ${resource.toUpperCase()} ===`);
			console.log(code);
		}

		console.log('\n═══════════════════════════════════════════════════════════════');
		console.log('                         DONE!                                 ');
		console.log('═══════════════════════════════════════════════════════════════\n');
		console.log('Next steps:');
		console.log('1. Review the updated description files');
		console.log('2. Add the execute code blocks to Gigstack.node.ts');
		console.log('3. Run: npm run build');
		console.log('4. Test the new operations\n');

	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

main();
