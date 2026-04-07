import type { INodeProperties } from 'n8n-workflow';

export const descargarMasivaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
			},
		},
		options: [
			{
				name: 'Activate',
				value: 'activate',
				description: 'Activate Descarga Masiva (enables SAT bulk download billing)',
				action: 'Activate descarga masiva',
			},
			{
				name: 'Create Download Request',
				value: 'createRequest',
				description: 'Create a SAT bulk download request (max 1 month range per request)',
				action: 'Create a download request',
			},
			{
				name: 'Deactivate',
				value: 'deactivate',
				description: 'Deactivate Descarga Masiva',
				action: 'Deactivate descarga masiva',
			},
			{
				name: 'Enable Auto Sync',
				value: 'enableSync',
				description: 'Enable automatic SAT synchronization',
				action: 'Enable auto sync',
			},
			{
				name: 'Get Activation Status',
				value: 'getActivationStatus',
				description: 'Check activation status and billing info for Descarga Masiva',
				action: 'Get activation status',
			},
			{
				name: 'Get Invoice By UUID',
				value: 'getInvoiceByUuid',
				description: 'Fetch a single CFDI from SAT by UUID',
				action: 'Get invoice by UUID',
			},
			{
				name: 'Get Package',
				value: 'downloadPackage',
				description: 'Download a ZIP package of XML files by package ID',
				action: 'Get a download package',
			},
			{
				name: 'Get Request Status',
				value: 'getRequestStatus',
				description: 'Check the status of a download request',
				action: 'Get request status',
			},
			{
				name: 'Get Schedule',
				value: 'getSchedule',
				description: 'Get current download schedule config and FIEL/registration status',
				action: 'Get download schedule',
			},
			{
				name: 'Get Schedule History',
				value: 'getScheduleHistory',
				description: 'Get the last 20 scheduled download requests with live SAT status',
				action: 'Get schedule history',
			},
			{
				name: 'Update Schedule',
				value: 'updateSchedule',
				description: 'Save or update the daily download schedule',
				action: 'Update download schedule',
			},
			{
				name: 'Update Sync Period',
				value: 'updateSyncPeriod',
				description: 'Update the sync start date (defaults to 71 months ago)',
				action: 'Update sync period',
			},
		],
		default: 'getActivationStatus',
	},
];

export const descargarMasivaFields: INodeProperties[] = [
	// ----------------------------------
	//   descargarMasiva: createRequest
	// ----------------------------------
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['createRequest'],
			},
		},
		description: 'Start date for the download request (YYYY-MM-DD format). Max range is 1 month.',
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['createRequest'],
			},
		},
		description: 'End date for the download request (YYYY-MM-DD format). Max range is 1 month.',
	},
	{
		displayName: 'CFDI Type',
		name: 'type',
		type: 'options',
		required: true,
		options: [
			{ name: 'Received - CFDIs received by the business', value: 'received' },
			{ name: 'Issued - CFDIs issued by the business', value: 'issued' },
		],
		default: 'received',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['createRequest'],
			},
		},
		description: 'Whether to download CFDIs received or issued by the business',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['createRequest'],
			},
		},
		options: [
			{
				displayName: 'RFC Filter',
				name: 'rfc',
				type: 'string',
				default: '',
				description: 'Filter by a specific RFC (counterpart RFC for received, or your own for issued)',
			},
		],
	},

	// ----------------------------------
	//   descargarMasiva: getRequestStatus
	// ----------------------------------
	{
		displayName: 'Request ID',
		name: 'request_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['getRequestStatus'],
			},
		},
		description: 'The ID of the download request to check',
	},

	// ----------------------------------
	//   descargarMasiva: downloadPackage
	// ----------------------------------
	{
		displayName: 'Package ID',
		name: 'package_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['downloadPackage'],
			},
		},
		description: 'The package ID to download (obtained from a completed download request)',
	},

	// ----------------------------------
	//   descargarMasiva: getInvoiceByUuid
	// ----------------------------------
	{
		displayName: 'UUID',
		name: 'uuid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['getInvoiceByUuid'],
			},
		},
		description: 'The UUID of the CFDI to fetch from SAT',
	},

	// ----------------------------------
	//   descargarMasiva: updateSchedule
	// ----------------------------------
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['updateSchedule'],
			},
		},
		description: 'Whether to enable the daily download schedule',
	},
	{
		displayName: 'Download Hour (UTC)',
		name: 'hour',
		type: 'number',
		default: 3,
		typeOptions: {
			minValue: 0,
			maxValue: 23,
		},
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['updateSchedule'],
			},
		},
		description: 'Hour of day (UTC, 0-23) to run the scheduled download',
	},
	{
		displayName: 'CFDI Types to Download',
		name: 'types',
		type: 'multiOptions',
		options: [
			{ name: 'Received', value: 'received' },
			{ name: 'Issued', value: 'issued' },
		],
		default: ['received', 'issued'],
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['updateSchedule'],
			},
		},
		description: 'Which CFDI types to include in scheduled downloads',
	},

	// ----------------------------------
	//   descargarMasiva: updateSyncPeriod
	// ----------------------------------
	{
		displayName: 'Sync Start Date',
		name: 'sync_from',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
				operation: ['updateSyncPeriod'],
			},
		},
		description: 'The date from which to start syncing CFDIs (YYYY-MM-DD). SAT allows up to 71 months back.',
	},

	// ----------------------------------
	//   descargarMasiva: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['descargarMasiva'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
