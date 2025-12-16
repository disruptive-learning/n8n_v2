import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Add Member',
				value: 'addMember',
				description: 'Add a member to a team',
				action: 'Add member to team',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new team',
				action: 'Create a team',
			},
			{
				name: 'Create Series',
				value: 'createSeries',
				description: 'Create a new invoice series for a team',
				action: 'Create team series',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a team by ID',
				action: 'Get a team',
			},
			{
				name: 'Get Integrations',
				value: 'getIntegrations',
				description: 'Get team integrations',
				action: 'Get team integrations',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teams',
				action: 'Get many teams',
			},
			{
				name: 'Get Onboarding URL',
				value: 'getOnboardingUrl',
				description: 'Get team onboarding URL (Gigstack Connect)',
				action: 'Get onboarding URL',
			},
			{
				name: 'Get Series',
				value: 'getSeries',
				description: 'Get invoice series for a team',
				action: 'Get team series',
			},
			{
				name: 'Remove Member',
				value: 'removeMember',
				description: 'Remove a member from a team',
				action: 'Remove member from team',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a team',
				action: 'Update a team',
			},
			{
				name: 'Update Series',
				value: 'updateSeries',
				description: 'Update an invoice series',
				action: 'Update team series',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: 'Update team settings',
				action: 'Update team settings',
			},
		],
		default: 'getAll',
	},
];

export const teamFields: INodeProperties[] = [
	// ----------------------------------
	//         team: create
	// ----------------------------------
	{
		displayName: 'Tax ID (RFC)',
		name: 'tax_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: 'Mexican RFC tax identification number',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Tax System',
				name: 'tax_system',
				type: 'options',
				default: '601',
				options: [
					{ name: '601 - General de Ley Personas Morales', value: '601' },
					{ name: '603 - Personas Morales con Fines no Lucrativos', value: '603' },
					{ name: '612 - Personas Fisicas con Actividades Empresariales', value: '612' },
					{ name: '621 - Incorporacion Fiscal', value: '621' },
					{ name: '625 - RESICO', value: '625' },
					{ name: '626 - RESICO Personas Morales', value: '626' },
				],
				description: 'SAT tax regime code',
			},
			{
				displayName: 'Brand Alias',
				name: 'brandAlias',
				type: 'string',
				default: '',
				description: 'Brand alias name',
			},
			{
				displayName: 'Primary Color',
				name: 'primaryColor',
				type: 'string',
				default: '#2563eb',
				description: 'Primary brand color (hex)',
			},
			{
				displayName: 'Logo URL',
				name: 'logo',
				type: 'string',
				default: '',
				description: 'URL to company logo',
			},
			{
				displayName: 'Support Email',
				name: 'support_email',
				type: 'string',
				default: '',
				description: 'Support email address',
			},
			{
				displayName: 'Support Phone',
				name: 'support_phone',
				type: 'string',
				default: '',
				description: 'Support phone number',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Zip Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Postal code',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'Mexico',
				description: 'Country',
			},
			{
				displayName: 'Generate Onboarding URL',
				name: 'generate_onboarding_url',
				type: 'boolean',
				default: false,
				description: 'Whether to generate an onboarding URL for the team',
			},
		],
	},

	// ----------------------------------
	//         team: get, update, addMember, removeMember, getSeries, createSeries, updateSettings, getOnboardingUrl
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['get', 'update', 'addMember', 'removeMember', 'getSeries', 'createSeries', 'updateSeries', 'updateSettings', 'getOnboardingUrl'],
			},
		},
		description: 'The ID of the team',
	},

	// ----------------------------------
	//         team: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Tax ID (RFC)',
				name: 'tax_id',
				type: 'string',
				default: '',
				description: 'Mexican RFC tax identification number',
			},
			{
				displayName: 'Tax System',
				name: 'tax_system',
				type: 'string',
				default: '',
				description: 'SAT tax regime code',
			},
			{
				displayName: 'Brand Alias',
				name: 'brandAlias',
				type: 'string',
				default: '',
				description: 'Brand alias name',
			},
			{
				displayName: 'Primary Color',
				name: 'primaryColor',
				type: 'string',
				default: '',
				description: 'Primary brand color (hex)',
			},
			{
				displayName: 'Logo URL',
				name: 'logo',
				type: 'string',
				default: '',
				description: 'URL to company logo',
			},
			{
				displayName: 'Support Email',
				name: 'support_email',
				type: 'string',
				default: '',
				description: 'Support email address',
			},
			{
				displayName: 'Support Phone',
				name: 'support_phone',
				type: 'string',
				default: '',
				description: 'Support phone number',
			},
		],
	},

	// ----------------------------------
	//         team: addMember
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['addMember'],
			},
		},
		description: 'The ID of the user to add',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Editor', value: 'editor' },
			{ name: 'Viewer', value: 'viewer' },
		],
		default: 'viewer',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['addMember'],
			},
		},
		description: 'Role for the team member',
	},

	// ----------------------------------
	//         team: removeMember
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['removeMember'],
			},
		},
		description: 'The ID of the user to remove',
	},

	// ----------------------------------
	//         team: createSeries
	// ----------------------------------
	{
		displayName: 'Series Name',
		name: 'series',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createSeries'],
			},
		},
		description: 'Series identifier (e.g., A, B, NC)',
	},
	{
		displayName: 'Live Folio Start',
		name: 'live',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createSeries'],
			},
		},
		description: 'Initial folio number for live mode',
	},
	{
		displayName: 'Test Folio Start',
		name: 'test',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createSeries'],
			},
		},
		description: 'Initial folio number for test mode',
	},

	// ----------------------------------
	//         team: updateSeries
	// ----------------------------------
	{
		displayName: 'Series ID',
		name: 'seriesId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateSeries'],
			},
		},
		description: 'The ID of the series to update',
	},
	{
		displayName: 'Live Folio Number',
		name: 'live',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateSeries'],
			},
		},
		description: 'Update folio number for live mode',
	},
	{
		displayName: 'Test Folio Number',
		name: 'test',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateSeries'],
			},
		},
		description: 'Update folio number for test mode',
	},

	// ----------------------------------
	//         team: updateSettings
	// ----------------------------------
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Default Description',
				name: 'default_description',
				type: 'string',
				default: '',
				description: 'Default description for invoices',
			},
			{
				displayName: 'Invoice PDF Notes',
				name: 'invoice_pdf_notes',
				type: 'string',
				default: '',
				description: 'Notes to include on invoice PDFs',
			},
			{
				displayName: 'Default Product Key',
				name: 'product_key',
				type: 'string',
				default: '',
				description: 'Default SAT product key',
			},
			{
				displayName: 'Default Unit Key',
				name: 'unit_key',
				type: 'string',
				default: '',
				description: 'Default SAT unit key',
			},
			{
				displayName: 'Default CFDI Use',
				name: 'use',
				type: 'string',
				default: '',
				description: 'Default CFDI use code',
			},
			{
				displayName: 'Keep Full Legal Name',
				name: 'keep_full_legal_name',
				type: 'boolean',
				default: false,
				description: 'Whether to keep full legal name on invoices',
			},
			{
				displayName: 'Avoid Invoice Emails',
				name: 'avoid_invoice_emails',
				type: 'boolean',
				default: false,
				description: 'Whether to disable automatic invoice emails',
			},
			{
				displayName: 'Invoices BCC',
				name: 'invoices_bcc',
				type: 'string',
				default: '',
				description: 'Comma-separated BCC emails for invoices',
			},
		],
	},

	// ----------------------------------
	//         team: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{ name: 'Name', value: 'name' },
					{ name: 'Created At', value: 'timestamp' },
				],
				default: 'timestamp',
				description: 'Field to order results by',
			},
			{
				displayName: 'Sort Direction',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort direction',
			},
		],
	},

	// ----------------------------------
	//         team: Common - Team (for Gigstack Connect)
	// ----------------------------------
	{
		displayName: 'Connect Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
