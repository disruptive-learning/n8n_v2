import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { gigstackApiRequest } from './GenericFunctions';

export class GigstackTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gigstack Trigger',
		name: 'gigstackTrigger',
		icon: 'file:gigstack.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Gigstack webhook events',
		defaults: {
			name: 'Gigstack Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'gigstackApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'Client Created',
						value: 'client.created',
						description: 'Triggered when a new client is created',
					},
					{
						name: 'Client Deleted',
						value: 'client.deleted',
						description: 'Triggered when a client is deleted',
					},
					{
						name: 'Client Updated',
						value: 'client.updated',
						description: 'Triggered when a client is updated',
					},
					{
						name: 'Invoice Cancelled',
						value: 'invoice.cancelled',
						description: 'Triggered when an invoice is cancelled',
					},
					{
						name: 'Invoice Created',
						value: 'invoice.created',
						description: 'Triggered when a new invoice is created',
					},
					{
						name: 'Invoice Sent',
						value: 'invoice.sent',
						description: 'Triggered when an invoice is sent via email',
					},
					{
						name: 'Invoice Stamped',
						value: 'invoice.stamped',
						description: 'Triggered when an invoice is stamped with SAT',
					},
					{
						name: 'Payment Cancelled',
						value: 'payment.cancelled',
						description: 'Triggered when a payment is cancelled',
					},
					{
						name: 'Payment Created',
						value: 'payment.created',
						description: 'Triggered when a new payment is created',
					},
					{
						name: 'Payment Failed',
						value: 'payment.failed',
						description: 'Triggered when a payment fails',
					},
					{
						name: 'Payment Refunded',
						value: 'payment.refunded',
						description: 'Triggered when a payment is refunded',
					},
					{
						name: 'Payment Succeeded',
						value: 'payment.succeeded',
						description: 'Triggered when a payment succeeds',
					},
					{
						name: 'Receipt Cancelled',
						value: 'receipt.cancelled',
						description: 'Triggered when a receipt is cancelled',
					},
					{
						name: 'Receipt Created',
						value: 'receipt.created',
						description: 'Triggered when a new receipt is created',
					},
					{
						name: 'Receipt Stamped',
						value: 'receipt.stamped',
						description: 'Triggered when a receipt is stamped as invoice',
					},
				],
				description: 'The events to listen for',
			},
			{
				displayName: 'Team ID',
				name: 'team',
				type: 'string',
				default: '',
				description: 'Team ID for Gigstack Connect (multi-team access). Leave empty to use default team.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const team = this.getNodeParameter('team', '') as string;

				const qs: IDataObject = {};
				if (team) qs.team = team;

				// Get all webhooks
				const response = await gigstackApiRequest.call(this, 'GET', '/webhooks', {}, qs);
				const webhooks = (response.data as IDataObject[]) || [];

				// Check if webhook with our URL exists
				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const team = this.getNodeParameter('team', '') as string;

				const qs: IDataObject = {};
				if (team) qs.team = team;

				const body: IDataObject = {
					url: webhookUrl,
					events,
					status: 'active',
					description: `n8n webhook - ${events.join(', ')}`,
				};

				const response = await gigstackApiRequest.call(this, 'POST', '/webhooks', body, qs);
				const webhookData = this.getWorkflowStaticData('node');

				if (response.data && (response.data as IDataObject).id) {
					webhookData.webhookId = (response.data as IDataObject).id;
					return true;
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const team = this.getNodeParameter('team', '') as string;

				const qs: IDataObject = {};
				if (team) qs.team = team;

				if (webhookData.webhookId) {
					try {
						await gigstackApiRequest.call(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId}`,
							{},
							qs,
						);
					} catch (error) {
						return false;
					}
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events') as string[];

		// Check if the event is one we're listening for
		const eventType = bodyData.event as string;
		if (eventType && !events.includes(eventType)) {
			// Event type doesn't match, ignore
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
