import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Generate Login Link',
				value: 'loginLink',
				description: 'Generate a direct login link for a user',
				action: 'Generate login link',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Reset Password',
				value: 'resetPassword',
				description: 'Reset a user password',
				action: 'Reset user password',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update a user',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user: create
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
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'Email address of the user',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the user',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Company Role',
				name: 'company_role',
				type: 'string',
				default: '',
				description: 'Role in the company',
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
				description: 'User role in the system',
			},
			{
				displayName: 'Auto Join Team',
				name: 'auto_join',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically join the user to the team',
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
	//         user: get, update
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         user: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the user',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Company Role',
				name: 'company_role',
				type: 'string',
				default: '',
				description: 'Role in the company',
			},
		],
	},

	// ----------------------------------
	//         user: resetPassword
	// ----------------------------------
	{
		displayName: 'User Email',
		name: 'userEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['resetPassword'],
			},
		},
		description: 'Email of the user to reset password for',
	},

	// ----------------------------------
	//         user: loginLink
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['loginLink'],
			},
		},
		description: 'The ID of the user to generate login link for',
	},

	// ----------------------------------
	//         user: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
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
				resource: ['user'],
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
	//         user: Common - Team
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'team',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
	},
];
