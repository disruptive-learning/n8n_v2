import type { INodeProperties } from 'n8n-workflow';

export const clientOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new client',
				action: 'Create a client',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a client',
				action: 'Delete a client',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a client by ID',
				action: 'Get a client',
			},
			{
				name: 'Get Customer Portal',
				value: 'getCustomerPortal',
				description: 'Get customer portal access URL',
				action: 'Get customer portal URL',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many clients',
				action: 'Get many clients',
			},
			{
				name: 'Stamp Pending Receipts',
				value: 'stampPendingReceipts',
				description: 'Stamp all pending receipts for a client',
				action: 'Stamp pending receipts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a client',
				action: 'Update a client',
			},
			{
				name: 'Validate',
				value: 'validate',
				description: 'Validate client fiscal information against SAT',
				action: 'Validate a client',
			},
		],
		default: 'getAll',
	},
];

export const clientFields: INodeProperties[] = [
	// ----------------------------------
	//         client: create
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		description: 'Email address of the client',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Full name of the client',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Legal Name',
				name: 'legal_name',
				type: 'string',
				default: '',
				description: 'Legal name for invoicing (Razon Social)',
			},
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
				type: 'options',
				default: '601',
				options: [
					{ name: '601 - General de Ley Personas Morales', value: '601' },
					{ name: '603 - Personas Morales con Fines no Lucrativos', value: '603' },
					{ name: '605 - Sueldos y Salarios', value: '605' },
					{ name: '606 - Arrendamiento', value: '606' },
					{ name: '607 - Regimen de Enajenacion o Adquisicion de Bienes', value: '607' },
					{ name: '608 - Demas Ingresos', value: '608' },
					{ name: '610 - Residentes en el Extranjero', value: '610' },
					{ name: '611 - Ingresos por Dividendos', value: '611' },
					{ name: '612 - Personas Fisicas con Actividades Empresariales', value: '612' },
					{ name: '614 - Ingresos por Intereses', value: '614' },
					{ name: '615 - Regimen de los Ingresos por Premios', value: '615' },
					{ name: '616 - Sin Obligaciones Fiscales', value: '616' },
					{ name: '620 - Sociedades Cooperativas', value: '620' },
					{ name: '621 - Incorporacion Fiscal', value: '621' },
					{ name: '622 - Actividades Agricolas, Ganaderas, Silvicolas y Pesqueras', value: '622' },
					{ name: '623 - Opcional para Grupos de Sociedades', value: '623' },
					{ name: '624 - Coordinados', value: '624' },
					{ name: '625 - Regimen Simplificado de Confianza (RESICO)', value: '625' },
					{ name: '626 - RESICO Personas Morales', value: '626' },
				],
				description: 'SAT tax regime code',
			},
			{
				displayName: 'CFDI Use',
				name: 'use',
				type: 'options',
				default: 'G03',
				options: [
					{ name: 'G01 - Adquisicion de Mercancias', value: 'G01' },
					{ name: 'G02 - Devoluciones, Descuentos o Bonificaciones', value: 'G02' },
					{ name: 'G03 - Gastos en General', value: 'G03' },
					{ name: 'I01 - Construcciones', value: 'I01' },
					{ name: 'I02 - Mobiliario y Equipo de Oficina', value: 'I02' },
					{ name: 'I03 - Equipo de Transporte', value: 'I03' },
					{ name: 'I04 - Equipo de Computo', value: 'I04' },
					{ name: 'I05 - Dados, Troqueles, Moldes', value: 'I05' },
					{ name: 'I06 - Comunicaciones Telefonicas', value: 'I06' },
					{ name: 'I07 - Comunicaciones Satelitales', value: 'I07' },
					{ name: 'I08 - Otra Maquinaria y Equipo', value: 'I08' },
					{ name: 'D01 - Honorarios Medicos', value: 'D01' },
					{ name: 'D02 - Gastos Medicos por Incapacidad', value: 'D02' },
					{ name: 'D03 - Gastos Funerales', value: 'D03' },
					{ name: 'D04 - Donativos', value: 'D04' },
					{ name: 'D05 - Intereses por Creditos Hipotecarios', value: 'D05' },
					{ name: 'D06 - Aportaciones Voluntarias SAR', value: 'D06' },
					{ name: 'D07 - Primas por Seguros de Gastos Medicos', value: 'D07' },
					{ name: 'D08 - Gastos de Transportacion Escolar', value: 'D08' },
					{ name: 'D09 - Depositos Cuentas Ahorro', value: 'D09' },
					{ name: 'D10 - Pagos por Servicios Educativos', value: 'D10' },
					{ name: 'P01 - Por Definir', value: 'P01' },
					{ name: 'S01 - Sin Efectos Fiscales', value: 'S01' },
					{ name: 'CP01 - Pagos', value: 'CP01' },
					{ name: 'CN01 - Nomina', value: 'CN01' },
				],
				description: 'CFDI use code',
			},
			{
				displayName: 'BCC Emails',
				name: 'bcc',
				type: 'string',
				default: '',
				description: 'Comma-separated list of BCC email addresses',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Exterior Number',
				name: 'exterior',
				type: 'string',
				default: '',
				description: 'Exterior number',
			},
			{
				displayName: 'Interior Number',
				name: 'interior',
				type: 'string',
				default: '',
				description: 'Interior number',
			},
			{
				displayName: 'Neighborhood',
				name: 'neighborhood',
				type: 'string',
				default: '',
				description: 'Neighborhood (Colonia)',
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
				displayName: 'Zip Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Postal code',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'Mexico',
				description: 'Country',
			},
			{
				displayName: 'Municipality',
				name: 'municipality',
				type: 'string',
				default: '',
				description: 'Municipality (Municipio)',
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
	{
		displayName: 'Search Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add Search Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		description: 'Options to find existing client (upsert behavior)',
		options: [
			{
				displayName: 'Search On Key',
				name: 'on_key',
				type: 'options',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'Tax ID (RFC)', value: 'tax_id' },
				],
				default: 'email',
				description: 'Field to search for existing client',
			},
			{
				displayName: 'Search On Value',
				name: 'on_value',
				type: 'string',
				default: '',
				description: 'Value to search for',
			},
			{
				displayName: 'Update If Found',
				name: 'update',
				type: 'boolean',
				default: false,
				description: 'Whether to update the client if found',
			},
		],
	},

	// ----------------------------------
	//         client: get
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['get', 'update', 'delete', 'validate', 'stampPendingReceipts'],
			},
		},
		description: 'The ID of the client',
	},

	// ----------------------------------
	//         client: getCustomerPortal
	// ----------------------------------
	{
		displayName: 'Client ID or Email',
		name: 'clientIdentifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getCustomerPortal'],
			},
		},
		description: 'The ID or email of the client',
	},
	{
		displayName: 'Identifier Type',
		name: 'identifierType',
		type: 'options',
		options: [
			{ name: 'Client ID', value: 'id' },
			{ name: 'Email', value: 'email' },
		],
		default: 'id',
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['getCustomerPortal'],
			},
		},
		description: 'Whether to identify client by ID or email',
	},

	// ----------------------------------
	//         client: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Full name of the client',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Legal Name',
				name: 'legal_name',
				type: 'string',
				default: '',
				description: 'Legal name for invoicing (Razon Social)',
			},
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
				type: 'options',
				default: '601',
				options: [
					{ name: '601 - General de Ley Personas Morales', value: '601' },
					{ name: '603 - Personas Morales con Fines no Lucrativos', value: '603' },
					{ name: '605 - Sueldos y Salarios', value: '605' },
					{ name: '606 - Arrendamiento', value: '606' },
					{ name: '612 - Personas Fisicas con Actividades Empresariales', value: '612' },
					{ name: '616 - Sin Obligaciones Fiscales', value: '616' },
					{ name: '621 - Incorporacion Fiscal', value: '621' },
					{ name: '625 - Regimen Simplificado de Confianza (RESICO)', value: '625' },
					{ name: '626 - RESICO Personas Morales', value: '626' },
				],
				description: 'SAT tax regime code',
			},
			{
				displayName: 'CFDI Use',
				name: 'use',
				type: 'options',
				default: 'G03',
				options: [
					{ name: 'G01 - Adquisicion de Mercancias', value: 'G01' },
					{ name: 'G02 - Devoluciones, Descuentos o Bonificaciones', value: 'G02' },
					{ name: 'G03 - Gastos en General', value: 'G03' },
					{ name: 'P01 - Por Definir', value: 'P01' },
					{ name: 'S01 - Sin Efectos Fiscales', value: 'S01' },
				],
				description: 'CFDI use code',
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
		],
	},

	// ----------------------------------
	//         client: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['client'],
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
				resource: ['client'],
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
				resource: ['client'],
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
				description: 'Filter clients created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter clients created before this date',
			},
			{
				displayName: 'Metadata Filters',
				name: 'metadataFilters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Filter by metadata fields using key-value pairs',
				options: [
					{
						name: 'filters',
						displayName: 'Metadata Filter',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								placeholder: 'e.g., external_id',
								description: 'The metadata field key to filter on',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'e.g., EXT-123',
								description: 'The value to match',
							},
						],
					},
				],
			},
		],
	},

	// ----------------------------------
	//         client: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
