import type { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['payment'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a payment',
				action: 'Cancel a payment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a payment by ID',
				action: 'Get a payment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many payments',
				action: 'Get many payments',
			},
			{
				name: 'Mark as Paid',
				value: 'markAsPaid',
				description: 'Mark a payment as paid',
				action: 'Mark payment as paid',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund a payment',
				action: 'Refund a payment',
			},
			{
				name: 'Register',
				value: 'register',
				description: 'Register a new payment (already paid)',
				action: 'Register a payment',
			},
			{
				name: 'Request',
				value: 'request',
				description: 'Request a payment (creates payment link)',
				action: 'Request a payment',
			},
		],
		default: 'getAll',
	},
];

export const paymentFields: INodeProperties[] = [
	// ----------------------------------
	//         payment: request / register
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['request', 'register'],
			},
		},
		description: 'The ID of the client for this payment',
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
				resource: ['payment'],
				operation: ['request', 'register'],
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
		description: 'Payment line items',
	},
	{
		displayName: 'Automation Type',
		name: 'automation_type',
		type: 'options',
		required: true,
		options: [
			{ name: 'PUE Invoice - Create Invoice on Payment', value: 'pue_invoice' },
			{ name: 'None - No Automatic Invoice', value: 'none' },
		],
		default: 'pue_invoice',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['request', 'register'],
			},
		},
		description: 'What happens when payment is completed',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['request', 'register'],
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
				description: 'Payment currency',
			},
			{
				displayName: 'Exchange Rate',
				name: 'exchange_rate',
				type: 'number',
				default: 1,
				typeOptions: {
					numberPrecision: 4,
				},
				description: 'Exchange rate to MXN',
			},
			{
				displayName: 'Send Email',
				name: 'send_email',
				type: 'boolean',
				default: true,
				description: 'Whether to send payment request to client via email',
			},
			{
				displayName: 'Additional Emails',
				name: 'emails',
				type: 'string',
				default: '',
				description: 'Comma-separated list of additional email addresses',
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
	//         payment: request specific
	// ----------------------------------
	{
		displayName: 'Allowed Payment Methods',
		name: 'allowed_payment_methods',
		type: 'multiOptions',
		options: [
			{ name: 'Card', value: 'card' },
			{ name: 'SPEI (Bank Transfer)', value: 'spei' },
			{ name: 'OXXO', value: 'oxxo' },
			{ name: 'Stripe SPEI', value: 'stripe-spei' },
		],
		default: ['card', 'spei'],
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['request'],
			},
		},
		description: 'Payment methods available to the customer',
	},

	// ----------------------------------
	//         payment: register specific
	// ----------------------------------
	{
		displayName: 'Payment Form',
		name: 'payment_form',
		type: 'options',
		required: true,
		options: [
			{ name: '01 - Efectivo', value: '01' },
			{ name: '02 - Cheque Nominativo', value: '02' },
			{ name: '03 - Transferencia Electronica', value: '03' },
			{ name: '04 - Tarjeta de Credito', value: '04' },
			{ name: '28 - Tarjeta de Debito', value: '28' },
			{ name: '99 - Por Definir', value: '99' },
		],
		default: '03',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['register'],
			},
		},
		description: 'SAT payment form code',
	},

	// ----------------------------------
	//         payment: get, cancel, markAsPaid, refund
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['get', 'cancel', 'markAsPaid', 'refund'],
			},
		},
		description: 'The ID of the payment',
	},

	// ----------------------------------
	//         payment: markAsPaid
	// ----------------------------------
	{
		displayName: 'Payment Form',
		name: 'payment_form',
		type: 'options',
		required: true,
		options: [
			{ name: '01 - Efectivo', value: '01' },
			{ name: '02 - Cheque Nominativo', value: '02' },
			{ name: '03 - Transferencia Electronica', value: '03' },
			{ name: '04 - Tarjeta de Credito', value: '04' },
			{ name: '28 - Tarjeta de Debito', value: '28' },
			{ name: '99 - Por Definir', value: '99' },
		],
		default: '03',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['markAsPaid'],
			},
		},
		description: 'SAT payment form code',
	},
	{
		displayName: 'Payment Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['markAsPaid'],
			},
		},
		description: 'Date when the payment was received (defaults to now)',
	},

	// ----------------------------------
	//         payment: refund
	// ----------------------------------
	{
		displayName: 'Refund Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: {
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['refund'],
			},
		},
		description: 'Amount to refund',
	},
	{
		displayName: 'Refund Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['refund'],
			},
		},
		description: 'Reason for the refund',
	},
	{
		displayName: 'External Processor Refund',
		name: 'external_processor_refund',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['refund'],
			},
		},
		description: 'Whether to also refund through the external payment processor (e.g., Stripe)',
	},

	// ----------------------------------
	//         payment: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['payment'],
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
				resource: ['payment'],
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
				resource: ['payment'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Requires Payment Method', value: 'requires_payment_method' },
					{ name: 'Succeeded', value: 'succeeded' },
					{ name: 'Canceled', value: 'canceled' },
				],
				default: '',
				description: 'Filter payments by status',
			},
			{
				displayName: 'Client ID',
				name: 'client_id',
				type: 'string',
				default: '',
				description: 'Filter payments by client ID',
			},
			{
				displayName: 'Client Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Filter payments by client email address',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{ name: 'MXN - Mexican Peso', value: 'MXN' },
					{ name: 'USD - US Dollar', value: 'USD' },
				],
				default: '',
				description: 'Filter payments by currency',
			},
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
				description: 'Filter payments created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter payments created before this date',
			},
		],
	},

	// ----------------------------------
	//         payment: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['payment'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
