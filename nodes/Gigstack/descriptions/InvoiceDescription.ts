import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an invoice with SAT',
				action: 'Cancel an invoice',
			},
			{
				name: 'Create Income',
				value: 'createIncome',
				description: 'Create an income invoice (CFDI type I)',
				action: 'Create an income invoice',
			},
			{
				name: 'Create Egress',
				value: 'createEgress',
				description: 'Create an egress/credit note invoice (CFDI type E)',
				action: 'Create an egress invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invoice by ID',
				action: 'Get an invoice',
			},
			{
				name: 'Get Files',
				value: 'getFiles',
				description: 'Get invoice PDF and XML files',
				action: 'Get invoice files',
			},
			{
				name: 'Get Many Income',
				value: 'getAllIncome',
				description: 'Get many income invoices',
				action: 'Get many income invoices',
			},
			{
				name: 'Get Many Egress',
				value: 'getAllEgress',
				description: 'Get many egress invoices',
				action: 'Get many egress invoices',
			},
			{
				name: 'Get Many Payment',
				value: 'getAllPayment',
				description: 'Get many payment complement invoices (CFDI type P)',
				action: 'Get many payment invoices',
			},
		],
		default: 'getAllIncome',
	},
];

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice: createIncome / createEgress
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['createIncome', 'createEgress'],
			},
		},
		description: 'The ID of the client for this invoice',
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
				resource: ['invoice'],
				operation: ['createIncome', 'createEgress'],
			},
		},
		placeholder: 'Add Item',
		options: [
			{
				name: 'itemValues',
				displayName: 'Item',
				values: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the item',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Quantity of items',
					},
					{
						displayName: 'Unit Price',
						name: 'unit_price',
						type: 'number',
						default: 0,
						typeOptions: {
							numberPrecision: 2,
						},
						description: 'Price per unit',
					},
					{
						displayName: 'Product Key (SAT)',
						name: 'product_key',
						type: 'string',
						default: '80141503',
						description: 'SAT product key code',
					},
					{
						displayName: 'Unit Key (SAT)',
						name: 'unit_key',
						type: 'string',
						default: 'E48',
						description: 'SAT unit key code',
					},
					{
						displayName: 'Service ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'Service ID to use (will inherit properties from service)',
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
						description: 'Tax object code',
					},
					{
						displayName: 'Include IVA 16%',
						name: 'includeIva',
						type: 'boolean',
						default: true,
						description: 'Whether to include 16% IVA tax',
					},
				],
			},
		],
		description: 'Invoice line items',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['createIncome', 'createEgress'],
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
					{ name: 'EUR - Euro', value: 'EUR' },
				],
				default: 'MXN',
				description: 'Invoice currency',
			},
			{
				displayName: 'Exchange Rate',
				name: 'exchange_rate',
				type: 'number',
				default: 1,
				typeOptions: {
					numberPrecision: 4,
				},
				description: 'Exchange rate to MXN (required for non-MXN currencies)',
			},
			{
				displayName: 'Payment Method',
				name: 'payment_method',
				type: 'options',
				options: [
					{ name: 'PUE - Pago en Una Exhibicion', value: 'PUE' },
					{ name: 'PPD - Pago en Parcialidades o Diferido', value: 'PPD' },
				],
				default: 'PUE',
				description: 'CFDI payment method',
			},
			{
				displayName: 'Payment Form',
				name: 'payment_form',
				type: 'options',
				options: [
					{ name: '01 - Efectivo', value: '01' },
					{ name: '02 - Cheque Nominativo', value: '02' },
					{ name: '03 - Transferencia Electronica', value: '03' },
					{ name: '04 - Tarjeta de Credito', value: '04' },
					{ name: '05 - Monedero Electronico', value: '05' },
					{ name: '06 - Dinero Electronico', value: '06' },
					{ name: '08 - Vales de Despensa', value: '08' },
					{ name: '12 - Dacion en Pago', value: '12' },
					{ name: '13 - Pago por Subrogacion', value: '13' },
					{ name: '14 - Pago por Consignacion', value: '14' },
					{ name: '15 - Condonacion', value: '15' },
					{ name: '17 - Compensacion', value: '17' },
					{ name: '23 - Novacion', value: '23' },
					{ name: '24 - Confusion', value: '24' },
					{ name: '25 - Remision de Deuda', value: '25' },
					{ name: '26 - Prescripcion o Caducidad', value: '26' },
					{ name: '27 - A Satisfaccion del Acreedor', value: '27' },
					{ name: '28 - Tarjeta de Debito', value: '28' },
					{ name: '29 - Tarjeta de Servicios', value: '29' },
					{ name: '30 - Aplicacion de Anticipos', value: '30' },
					{ name: '31 - Intermediario Pagos', value: '31' },
					{ name: '99 - Por Definir', value: '99' },
				],
				default: '03',
				description: 'SAT payment form code',
			},
			{
				displayName: 'CFDI Use',
				name: 'use',
				type: 'options',
				options: [
					{ name: 'G01 - Adquisicion de Mercancias', value: 'G01' },
					{ name: 'G02 - Devoluciones, Descuentos o Bonificaciones', value: 'G02' },
					{ name: 'G03 - Gastos en General', value: 'G03' },
					{ name: 'P01 - Por Definir', value: 'P01' },
					{ name: 'S01 - Sin Efectos Fiscales', value: 'S01' },
				],
				default: 'G03',
				description: 'CFDI use code',
			},
			{
				displayName: 'Series',
				name: 'series',
				type: 'string',
				default: '',
				description: 'Invoice series (e.g., A, B, NC)',
			},
			{
				displayName: 'Send Email',
				name: 'send_email',
				type: 'boolean',
				default: true,
				description: 'Whether to send invoice to client via email',
			},
			{
				displayName: 'Additional Emails',
				name: 'emails',
				type: 'string',
				default: '',
				description: 'Comma-separated list of additional email addresses to send invoice to',
			},
			{
				displayName: 'Automation Type',
				name: 'automation_type',
				type: 'options',
				options: [
					{ name: 'Payment - Link to Payment', value: 'payment' },
					{ name: 'None - Standalone Invoice', value: 'none' },
				],
				default: 'none',
				description: 'Invoice automation behavior',
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
	//         invoice: get, cancel, getFiles
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get', 'cancel', 'getFiles'],
			},
		},
		description: 'The ID of the invoice',
	},
	{
		displayName: 'Invoice Type',
		name: 'invoiceType',
		type: 'options',
		options: [
			{ name: 'Income', value: 'income' },
			{ name: 'Egress', value: 'egress' },
			{ name: 'Payment', value: 'payment' },
		],
		default: 'income',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get'],
			},
		},
		description: 'Type of invoice to retrieve',
	},

	// ----------------------------------
	//         invoice: cancel
	// ----------------------------------
	{
		displayName: 'Cancellation Motive',
		name: 'motive',
		type: 'options',
		required: true,
		options: [
			{ name: '01 - Comprobante Emitido con Errores con Relacion', value: '01' },
			{ name: '02 - Comprobante Emitido con Errores sin Relacion', value: '02' },
			{ name: '03 - No se Llevo a Cabo la Operacion', value: '03' },
			{ name: '04 - Operacion Nominativa Relacionada en Factura Global', value: '04' },
		],
		default: '02',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['cancel'],
			},
		},
		description: 'SAT cancellation motive code',
	},
	{
		displayName: 'Substitution UUID',
		name: 'substitution_uuid',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['cancel'],
				motive: ['01'],
			},
		},
		description: 'UUID of the invoice that substitutes this one (required for motive 01)',
	},

	// ----------------------------------
	//         invoice: getFiles
	// ----------------------------------
	{
		displayName: 'File Type',
		name: 'fileType',
		type: 'options',
		options: [
			{ name: 'Both PDF and XML', value: 'both' },
			{ name: 'PDF Only', value: 'pdf' },
			{ name: 'XML Only', value: 'xml' },
		],
		default: 'both',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getFiles'],
			},
		},
		description: 'Type of files to retrieve',
	},

	// ----------------------------------
	//         invoice: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['getAllIncome', 'getAllEgress', 'getAllPayment'],
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
				resource: ['invoice'],
				operation: ['getAllIncome', 'getAllEgress', 'getAllPayment'],
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
				resource: ['invoice'],
				operation: ['getAllIncome', 'getAllEgress', 'getAllPayment'],
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
				description: 'Filter invoices created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter invoices created before this date',
			},
		],
	},

	// ----------------------------------
	//         invoice: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
