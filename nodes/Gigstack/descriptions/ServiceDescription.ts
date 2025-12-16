import type { INodeProperties } from 'n8n-workflow';

export const serviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['service'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new service',
				action: 'Create a service',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a service',
				action: 'Delete a service',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a service by ID',
				action: 'Get a service',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many services',
				action: 'Get many services',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a service',
				action: 'Update a service',
			},
		],
		default: 'getAll',
	},
];

export const serviceFields: INodeProperties[] = [
	// ----------------------------------
	//         service: create
	// ----------------------------------
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		description: 'Description of the service',
	},
	{
		displayName: 'Unit Price',
		name: 'unit_price',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		description: 'Unit price of the service',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Product SKU identifier',
			},
			{
				displayName: 'Product Key (SAT)',
				name: 'product_key',
				type: 'string',
				default: '80141503',
				description: 'SAT product key code (ClaveProdServ). Default: 80141503 (Professional Services)',
			},
			{
				displayName: 'Unit Key (SAT)',
				name: 'unit_key',
				type: 'options',
				default: 'E48',
				options: [
					{ name: 'E48 - Unidad de Servicio', value: 'E48' },
					{ name: 'ACT - Actividad', value: 'ACT' },
					{ name: 'H87 - Pieza', value: 'H87' },
					{ name: 'KGM - Kilogramo', value: 'KGM' },
					{ name: 'LTR - Litro', value: 'LTR' },
					{ name: 'MTR - Metro', value: 'MTR' },
					{ name: 'MTK - Metro Cuadrado', value: 'MTK' },
					{ name: 'DAY - Dia', value: 'DAY' },
					{ name: 'HUR - Hora', value: 'HUR' },
					{ name: 'MON - Mes', value: 'MON' },
					{ name: 'XBX - Caja', value: 'XBX' },
					{ name: 'XPK - Paquete', value: 'XPK' },
				],
				description: 'SAT unit key code (ClaveUnidad)',
			},
			{
				displayName: 'Unit Name',
				name: 'unit_name',
				type: 'string',
				default: 'Servicio',
				description: 'Human-readable unit name',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Default quantity',
			},
			{
				displayName: 'Taxability',
				name: 'taxability',
				type: 'options',
				default: '02',
				options: [
					{ name: '01 - No Objeto de Impuesto', value: '01' },
					{ name: '02 - Si Objeto de Impuesto', value: '02' },
					{ name: '03 - Si Objeto de Impuesto (No Obligado)', value: '03' },
					{ name: '04 - Si Objeto de Impuesto (Exento)', value: '04' },
				],
				description: 'Tax object code (ObjetoImp)',
			},
			{
				displayName: 'Include IVA 16%',
				name: 'includeIva',
				type: 'boolean',
				default: true,
				description: 'Whether to include 16% IVA tax',
			},
			{
				displayName: 'IVA Inclusive',
				name: 'ivaInclusive',
				type: 'boolean',
				default: false,
				description: 'Whether the price includes IVA',
			},
			{
				displayName: 'Include ISR Withholding',
				name: 'includeIsrWithholding',
				type: 'boolean',
				default: false,
				description: 'Whether to include ISR withholding (10%)',
			},
			{
				displayName: 'Include IVA Withholding',
				name: 'includeIvaWithholding',
				type: 'boolean',
				default: false,
				description: 'Whether to include IVA withholding (10.67%)',
			},
		],
	},

	// ----------------------------------
	//         service: get, update, delete
	// ----------------------------------
	{
		displayName: 'Service ID',
		name: 'serviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the service',
	},

	// ----------------------------------
	//         service: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['service'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the service',
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				default: 0,
				typeOptions: {
					numberPrecision: 2,
				},
				description: 'Unit price of the service',
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Product SKU identifier',
			},
			{
				displayName: 'Product Key (SAT)',
				name: 'product_key',
				type: 'string',
				default: '',
				description: 'SAT product key code (ClaveProdServ)',
			},
			{
				displayName: 'Unit Key (SAT)',
				name: 'unit_key',
				type: 'options',
				default: 'E48',
				options: [
					{ name: 'E48 - Unidad de Servicio', value: 'E48' },
					{ name: 'ACT - Actividad', value: 'ACT' },
					{ name: 'H87 - Pieza', value: 'H87' },
					{ name: 'KGM - Kilogramo', value: 'KGM' },
					{ name: 'LTR - Litro', value: 'LTR' },
					{ name: 'MTR - Metro', value: 'MTR' },
					{ name: 'DAY - Dia', value: 'DAY' },
					{ name: 'HUR - Hora', value: 'HUR' },
					{ name: 'MON - Mes', value: 'MON' },
				],
				description: 'SAT unit key code (ClaveUnidad)',
			},
			{
				displayName: 'Unit Name',
				name: 'unit_name',
				type: 'string',
				default: '',
				description: 'Human-readable unit name',
			},
		],
	},

	// ----------------------------------
	//         service: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['service'],
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
				resource: ['service'],
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
				resource: ['service'],
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
				description: 'Filter services created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter services created before this date',
			},
		],
	},

	// ----------------------------------
	//         service: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['service'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
