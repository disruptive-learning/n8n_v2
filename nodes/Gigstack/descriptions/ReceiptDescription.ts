import type { INodeProperties } from 'n8n-workflow';

export const receiptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['receipt'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a receipt',
				action: 'Cancel a receipt',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new receipt',
				action: 'Create a receipt',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a receipt by ID',
				action: 'Get a receipt',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many receipts',
				action: 'Get many receipts',
			},
			{
				name: 'Stamp',
				value: 'stamp',
				description: 'Stamp a receipt as CFDI invoice',
				action: 'Stamp a receipt',
			},
		],
		default: 'getAll',
	},
];

export const receiptFields: INodeProperties[] = [
	// ----------------------------------
	//         receipt: create
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['create'],
			},
		},
		description: 'The ID of the client for this receipt',
	},
	{
		displayName: 'Items',
		name: 'items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			minValue: 1,
		},
		required: true,
		default: { itemValues: [{}] },
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['create'],
			},
		},
		placeholder: 'Add Item',
		options: [
			{
				name: 'itemValues',
				displayName: 'Item',
				values: [
					{
						displayName: 'Service ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'ID of the service/product',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Quantity of items',
					},
					{
						displayName: 'Unit Price (Override)',
						name: 'unit_price',
						type: 'number',
						default: 0,
						typeOptions: {
							numberPrecision: 2,
						},
						description: 'Override price (leave 0 to use service price)',
					},
				],
			},
		],
		description: 'Receipt line items',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{ name: 'MXN - Mexican Peso', value: 'MXN' },
					{ name: 'USD - US Dollar', value: 'USD' },
				],
				default: 'MXN',
				description: 'Receipt currency',
			},
			{
				displayName: 'Periodicity',
				name: 'periodicity',
				type: 'options',
				options: [
					{ name: 'Day', value: 'day' },
					{ name: 'Week', value: 'week' },
					{ name: 'Two Weeks', value: 'fortnight' },
					{ name: 'Month', value: 'month' },
					{ name: 'Two Months', value: 'bimonth' },
				],
				default: 'month',
				description: 'Validity period for stamping the receipt',
			},
			{
				displayName: 'Payment Form',
				name: 'payment_form',
				type: 'options',
				options: [
					{ name: '01 - Efectivo', value: '01' },
					{ name: '03 - Transferencia Electronica', value: '03' },
					{ name: '04 - Tarjeta de Credito', value: '04' },
					{ name: '28 - Tarjeta de Debito', value: '28' },
					{ name: '99 - Por Definir', value: '99' },
				],
				default: '03',
				description: 'SAT payment form code',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional custom metadata as JSON',
			},
		],
	},

	// ----------------------------------
	//         receipt: get, cancel, stamp
	// ----------------------------------
	{
		displayName: 'Receipt ID',
		name: 'receiptId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['get', 'cancel', 'stamp'],
			},
		},
		description: 'The ID of the receipt',
	},

	// ----------------------------------
	//         receipt: stamp
	// ----------------------------------
	{
		displayName: 'Stamp To',
		name: 'stamp_to',
		type: 'options',
		required: true,
		options: [
			{ name: 'Client - Stamp to Associated Client', value: 'client' },
			{ name: 'General Public National', value: 'general_public_national' },
			{ name: 'General Public Foreign', value: 'general_public_foreign' },
		],
		default: 'client',
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['stamp'],
			},
		},
		description: 'Who to stamp the receipt to',
	},
	{
		displayName: 'Stamp Options',
		name: 'stampOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: ['stamp'],
			},
		},
		options: [
			{
				displayName: 'Invoice Date',
				name: 'date',
				type: 'dateTime',
				default: '',
				description: 'Custom invoice date (defaults to now)',
			},
			{
				displayName: 'Override Legal Name',
				name: 'legal_name',
				type: 'string',
				default: '',
				description: 'Override client legal name',
			},
			{
				displayName: 'Override Tax ID',
				name: 'tax_id',
				type: 'string',
				default: '',
				description: 'Override client RFC',
			},
			{
				displayName: 'Override Tax System',
				name: 'tax_system',
				type: 'string',
				default: '',
				description: 'Override client tax system code',
			},
			{
				displayName: 'Override Zip Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Override client zip code',
			},
		],
	},

	// ----------------------------------
	//         receipt: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['receipt'],
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
				resource: ['receipt'],
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
				resource: ['receipt'],
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
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter receipts created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter receipts created before this date',
			},
		],
	},

	// ----------------------------------
	//         receipt: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['receipt'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
