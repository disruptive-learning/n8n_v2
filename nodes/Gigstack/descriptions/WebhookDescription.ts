import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook by ID',
				action: 'Get a webhook',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many webhooks',
				action: 'Get many webhooks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
			},
		],
		default: 'getAll',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook: create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://your-domain.com/webhooks/gigstack',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The URL to receive webhook notifications',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		options: [
			// Payment events
			{ name: 'Payment Created', value: 'payment.created' },
			{ name: 'Payment Succeeded', value: 'payment.succeeded' },
			{ name: 'Payment Failed', value: 'payment.failed' },
			{ name: 'Payment Cancelled', value: 'payment.cancelled' },
			{ name: 'Payment Refunded', value: 'payment.refunded' },
			// Invoice events
			{ name: 'Invoice Created', value: 'invoice.created' },
			{ name: 'Invoice Stamped', value: 'invoice.stamped' },
			{ name: 'Invoice Cancelled', value: 'invoice.cancelled' },
			{ name: 'Invoice Sent', value: 'invoice.sent' },
			// Customer events
			{ name: 'Customer Created', value: 'customer.created' },
			{ name: 'Customer Updated', value: 'customer.updated' },
			{ name: 'Customer Deleted', value: 'customer.deleted' },
			// Receipt events
			{ name: 'Receipt Created', value: 'receipt.created' },
			{ name: 'Receipt Stamped', value: 'receipt.stamped' },
			{ name: 'Receipt Cancelled', value: 'receipt.cancelled' },
		],
		default: ['payment.succeeded', 'invoice.created'],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Events that will trigger this webhook',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Webhook status',
			},
		],
	},

	// ----------------------------------
	//         webhook: get, update, delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the webhook',
	},

	// ----------------------------------
	//         webhook: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL to receive webhook notifications',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Payment Created', value: 'payment.created' },
					{ name: 'Payment Succeeded', value: 'payment.succeeded' },
					{ name: 'Payment Failed', value: 'payment.failed' },
					{ name: 'Payment Cancelled', value: 'payment.cancelled' },
					{ name: 'Payment Refunded', value: 'payment.refunded' },
					{ name: 'Invoice Created', value: 'invoice.created' },
					{ name: 'Invoice Stamped', value: 'invoice.stamped' },
					{ name: 'Invoice Cancelled', value: 'invoice.cancelled' },
					{ name: 'Customer Created', value: 'customer.created' },
					{ name: 'Customer Updated', value: 'customer.updated' },
					{ name: 'Receipt Created', value: 'receipt.created' },
					{ name: 'Receipt Stamped', value: 'receipt.stamped' },
				],
				default: [],
				description: 'Events that will trigger this webhook',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Webhook status',
			},
		],
	},

	// ----------------------------------
	//         webhook: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 10,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Filter by webhook status',
			},
		],
	},

	// ----------------------------------
	//         webhook: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
