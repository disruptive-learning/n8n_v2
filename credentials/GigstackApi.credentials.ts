import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GigstackApi implements ICredentialType {
	name = 'gigstackApi';
	displayName = 'Gigstack API';
	documentationUrl = 'https://docs.gigstack.io';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Gigstack API token. Get it from <a href="https://app.gigstack.pro/settings?tab=api" target="_blank">app.gigstack.pro/settings</a>',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Test',
					value: 'test',
				},
			],
			default: 'production',
			description: 'The environment to use. Test mode uses test data and does not create real invoices.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gigstack.io/v2',
			url: '/teams',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
