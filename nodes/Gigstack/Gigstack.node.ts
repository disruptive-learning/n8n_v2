import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	gigstackApiRequest,
	gigstackApiRequestAllItems,
	simplifyResponse,
	buildFilterQuery,
} from './GenericFunctions';

import { clientOperations, clientFields } from './descriptions/ClientDescription';
import { serviceOperations, serviceFields } from './descriptions/ServiceDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { paymentOperations, paymentFields } from './descriptions/PaymentDescription';
import { receiptOperations, receiptFields } from './descriptions/ReceiptDescription';
import { teamOperations, teamFields } from './descriptions/TeamDescription';
import { userOperations, userFields } from './descriptions/UserDescription';
import { webhookOperations, webhookFields } from './descriptions/WebhookDescription';

export class Gigstack implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gigstack',
		name: 'gigstack',
		icon: 'file:gigstack.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Gigstack API for Mexican tax-compliant invoicing and payments',
		defaults: {
			name: 'Gigstack',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'gigstackApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Client',
						value: 'client',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Payment',
						value: 'payment',
					},
					{
						name: 'Receipt',
						value: 'receipt',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'client',
			},
			// Operations and fields for each resource
			...clientOperations,
			...clientFields,
			...serviceOperations,
			...serviceFields,
			...invoiceOperations,
			...invoiceFields,
			...paymentOperations,
			...paymentFields,
			...receiptOperations,
			...receiptFields,
			...teamOperations,
			...teamFields,
			...userOperations,
			...userFields,
			...webhookOperations,
			...webhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};
				const qs: IDataObject = {};

				// Add team parameter if provided
				const team = this.getNodeParameter('team', i, '') as string;
				if (team) {
					qs.team = team;
				}

				// =====================
				// CLIENT OPERATIONS
				// =====================
				if (resource === 'client') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const searchOptions = this.getNodeParameter('searchOptions', i) as IDataObject;

						const body: IDataObject = { email };

						// Add additional fields
						if (additionalFields.name) body.name = additionalFields.name;
						if (additionalFields.company) body.company = additionalFields.company;
						if (additionalFields.phone) body.phone = additionalFields.phone;
						if (additionalFields.legal_name) body.legal_name = additionalFields.legal_name;
						if (additionalFields.tax_id) body.tax_id = additionalFields.tax_id;
						if (additionalFields.tax_system) body.tax_system = additionalFields.tax_system;
						if (additionalFields.use) body.use = additionalFields.use;
						if (additionalFields.bcc) {
							body.bcc = (additionalFields.bcc as string).split(',').map((e) => e.trim());
						}

						// Build address
						const address: IDataObject = {};
						if (additionalFields.street) address.street = additionalFields.street;
						if (additionalFields.exterior) address.exterior = additionalFields.exterior;
						if (additionalFields.interior) address.interior = additionalFields.interior;
						if (additionalFields.neighborhood) address.neighborhood = additionalFields.neighborhood;
						if (additionalFields.city) address.city = additionalFields.city;
						if (additionalFields.state) address.state = additionalFields.state;
						if (additionalFields.zip) address.zip = additionalFields.zip;
						if (additionalFields.country) address.country = additionalFields.country;
						if (additionalFields.municipality) address.municipality = additionalFields.municipality;
						if (Object.keys(address).length > 0) body.address = address;

						if (additionalFields.metadata) {
							body.metadata = JSON.parse(additionalFields.metadata as string);
						}

						// Add search options for upsert
						if (searchOptions.on_key && searchOptions.on_value) {
							body.search = {
								on_key: searchOptions.on_key,
								on_value: searchOptions.on_value,
								update: searchOptions.update || false,
							};
						}

						responseData = await gigstackApiRequest.call(this, 'POST', '/clients', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/clients/${clientId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/clients', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/clients', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'update') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						Object.assign(body, updateFields);

						// Build address if any address fields provided
						const addressFields = ['street', 'zip', 'city', 'state', 'country'];
						const address: IDataObject = {};
						for (const field of addressFields) {
							if (updateFields[field]) {
								address[field] = updateFields[field];
								delete body[field];
							}
						}
						if (Object.keys(address).length > 0) body.address = address;

						responseData = await gigstackApiRequest.call(this, 'PUT', `/clients/${clientId}`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'delete') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'DELETE', `/clients/${clientId}`, {}, qs);
					} else if (operation === 'validate') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'POST', `/clients/validate/${clientId}`, {}, qs);
					} else if (operation === 'getCustomerPortal') {
						const clientIdentifier = this.getNodeParameter('clientIdentifier', i) as string;
						const identifierType = this.getNodeParameter('identifierType', i) as string;

						const body: IDataObject = {};
						if (identifierType === 'id') {
							body.id = clientIdentifier;
						} else {
							body.email = clientIdentifier;
						}

						responseData = await gigstackApiRequest.call(this, 'POST', '/clients/customerportal', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'stampPendingReceipts') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'POST', `/clients/${clientId}/stamp-pending-receipts`, {}, qs);
					}
				}

				// =====================
				// SERVICE OPERATIONS
				// =====================
				else if (resource === 'service') {
					if (operation === 'create') {
						const description = this.getNodeParameter('description', i) as string;
						const unit_price = this.getNodeParameter('unit_price', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { description, unit_price };

						if (additionalFields.sku) body.sku = additionalFields.sku;
						if (additionalFields.product_key) body.product_key = additionalFields.product_key;
						if (additionalFields.unit_key) body.unit_key = additionalFields.unit_key;
						if (additionalFields.unit_name) body.unit_name = additionalFields.unit_name;
						if (additionalFields.quantity) body.quantity = additionalFields.quantity;
						if (additionalFields.taxability) body.taxability = additionalFields.taxability;

						// Build taxes array
						const taxes: IDataObject[] = [];
						if (additionalFields.includeIva) {
							taxes.push({
								type: 'IVA',
								rate: 0.16,
								factor: 'Tasa',
								withholding: false,
								inclusive: additionalFields.ivaInclusive || false,
							});
						}
						if (additionalFields.includeIsrWithholding) {
							taxes.push({
								type: 'ISR',
								rate: 0.10,
								factor: 'Tasa',
								withholding: true,
							});
						}
						if (additionalFields.includeIvaWithholding) {
							taxes.push({
								type: 'IVA',
								rate: 0.106667,
								factor: 'Tasa',
								withholding: true,
							});
						}
						if (taxes.length > 0) body.taxes = taxes;

						responseData = await gigstackApiRequest.call(this, 'POST', '/services', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/services/${serviceId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/services', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/services', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'update') {
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await gigstackApiRequest.call(this, 'PUT', `/services/${serviceId}`, updateFields, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'delete') {
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'DELETE', `/services/${serviceId}`, {}, qs);
					}
				}

				// =====================
				// INVOICE OPERATIONS
				// =====================
				else if (resource === 'invoice') {
					if (operation === 'createIncome' || operation === 'createEgress') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						const itemsData = this.getNodeParameter('items', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const items = (itemsData.itemValues as IDataObject[]) || [];
						const processedItems = items.map((item) => {
							const processedItem: IDataObject = {};
							if (item.id) processedItem.id = item.id;
							if (item.description) processedItem.description = item.description;
							if (item.quantity) processedItem.quantity = item.quantity;
							if (item.unit_price) processedItem.unit_price = item.unit_price;
							if (item.product_key) processedItem.product_key = item.product_key;
							if (item.unit_key) processedItem.unit_key = item.unit_key;
							if (item.taxability) processedItem.taxability = item.taxability;

							if (item.includeIva) {
								processedItem.taxes = [
									{
										type: 'IVA',
										rate: 0.16,
										factor: 'Tasa',
										withholding: false,
									},
								];
							}
							return processedItem;
						});

						const body: IDataObject = {
							client: { id: clientId },
							items: processedItems,
						};

						if (additionalFields.currency) body.currency = additionalFields.currency;
						if (additionalFields.exchange_rate) body.exchange_rate = additionalFields.exchange_rate;
						if (additionalFields.payment_method) body.payment_method = additionalFields.payment_method;
						if (additionalFields.payment_form) body.payment_form = additionalFields.payment_form;
						if (additionalFields.use) body.use = additionalFields.use;
						if (additionalFields.series) body.series = additionalFields.series;
						if (additionalFields.send_email !== undefined) body.send_email = additionalFields.send_email;
						if (additionalFields.automation_type) body.automation_type = additionalFields.automation_type;
						if (additionalFields.emails) {
							body.emails = (additionalFields.emails as string).split(',').map((e) => e.trim());
						}
						if (additionalFields.metadata) {
							body.metadata = JSON.parse(additionalFields.metadata as string);
						}

						const endpoint = operation === 'createIncome' ? '/invoices/income' : '/invoices/egress';
						responseData = await gigstackApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const invoiceType = this.getNodeParameter('invoiceType', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/invoices/${invoiceType}/${invoiceId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAllIncome') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/invoices/income', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/invoices/income', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'getAllEgress') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/invoices/egress', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/invoices/egress', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'getAllPayment') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/invoices/payment', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/invoices/payment', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'cancel') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const motive = this.getNodeParameter('motive', i) as string;

						const body: IDataObject = { motive };
						if (motive === '01') {
							const substitution_uuid = this.getNodeParameter('substitution_uuid', i) as string;
							body.substitution_uuid = substitution_uuid;
						}

						responseData = await gigstackApiRequest.call(this, 'DELETE', `/invoices/${invoiceId}`, body, qs);
					} else if (operation === 'getFiles') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const fileType = this.getNodeParameter('fileType', i) as string;

						if (fileType !== 'both') {
							qs.file_type = fileType;
						}

						responseData = await gigstackApiRequest.call(this, 'GET', `/invoices/${invoiceId}/files`, {}, qs);
						responseData = simplifyResponse(responseData);
					}
				}

				// =====================
				// PAYMENT OPERATIONS
				// =====================
				else if (resource === 'payment') {
					if (operation === 'request') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						const itemsData = this.getNodeParameter('items', i) as IDataObject;
						const automation_type = this.getNodeParameter('automation_type', i) as string;
						const allowed_payment_methods = this.getNodeParameter('allowed_payment_methods', i) as string[];
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const items = (itemsData.itemValues as IDataObject[]) || [];

						const body: IDataObject = {
							client: { id: clientId },
							items: items.map((item) => ({
								id: item.id,
								quantity: item.quantity || 1,
								...(item.unit_price && item.unit_price !== 0 ? { unit_price: item.unit_price } : {}),
							})),
							automation_type,
							allowed_payment_methods,
						};

						if (additionalFields.currency) body.currency = additionalFields.currency;
						if (additionalFields.exchange_rate) body.exchange_rate = additionalFields.exchange_rate;
						if (additionalFields.send_email !== undefined) body.send_email = additionalFields.send_email;
						if (additionalFields.emails) {
							body.emails = (additionalFields.emails as string).split(',').map((e) => e.trim());
						}
						if (additionalFields.metadata) {
							body.metadata = JSON.parse(additionalFields.metadata as string);
						}

						responseData = await gigstackApiRequest.call(this, 'POST', '/payments/request', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'register') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						const itemsData = this.getNodeParameter('items', i) as IDataObject;
						const automation_type = this.getNodeParameter('automation_type', i) as string;
						const payment_form = this.getNodeParameter('payment_form', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const items = (itemsData.itemValues as IDataObject[]) || [];

						const body: IDataObject = {
							client: { id: clientId },
							items: items.map((item) => ({
								id: item.id,
								quantity: item.quantity || 1,
								...(item.unit_price && item.unit_price !== 0 ? { unit_price: item.unit_price } : {}),
							})),
							automation_type,
							payment_form,
						};

						if (additionalFields.currency) body.currency = additionalFields.currency;
						if (additionalFields.exchange_rate) body.exchange_rate = additionalFields.exchange_rate;
						if (additionalFields.metadata) {
							body.metadata = JSON.parse(additionalFields.metadata as string);
						}

						// Handle invoice_config
						const invoiceConfig = this.getNodeParameter('invoiceConfig', i, {}) as IDataObject;
						if (invoiceConfig && Object.keys(invoiceConfig).length > 0) {
							const config: IDataObject = {};
							if (invoiceConfig.serie) config.serie = invoiceConfig.serie;
							if (invoiceConfig.folio && invoiceConfig.folio !== 0) config.folio = invoiceConfig.folio;
							if (Object.keys(config).length > 0) {
								body.invoice_config = config;
							}
						}

						responseData = await gigstackApiRequest.call(this, 'POST', '/payments/register', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/payments/${paymentId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/payments', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/payments', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'cancel') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'DELETE', `/payments/${paymentId}`, {}, qs);
					} else if (operation === 'markAsPaid') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;
						const payment_form = this.getNodeParameter('payment_form', i) as string;
						const date = this.getNodeParameter('date', i, '') as string;

						const body: IDataObject = { payment_form };
						if (date) {
							body.date = Math.floor(new Date(date).getTime() / 1000);
						}

						responseData = await gigstackApiRequest.call(this, 'POST', `/payments/${paymentId}/paid`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'refund') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const reason = this.getNodeParameter('reason', i, '') as string;
						const external_processor_refund = this.getNodeParameter('external_processor_refund', i) as boolean;

						const body: IDataObject = {
							amount,
							external_processor_refund,
						};
						if (reason) body.reason = reason;

						responseData = await gigstackApiRequest.call(this, 'POST', `/payments/${paymentId}/refund`, body, qs);
						responseData = simplifyResponse(responseData);
					}
				}

				// =====================
				// RECEIPT OPERATIONS
				// =====================
				else if (resource === 'receipt') {
					if (operation === 'create') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						const itemsData = this.getNodeParameter('items', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const items = (itemsData.itemValues as IDataObject[]) || [];

						const body: IDataObject = {
							client: { id: clientId },
							items: items.map((item) => ({
								id: item.id,
								quantity: item.quantity || 1,
								...(item.unit_price && item.unit_price !== 0 ? { unit_price: item.unit_price } : {}),
							})),
						};

						if (additionalFields.currency) body.currency = additionalFields.currency;
						if (additionalFields.exchange_rate) body.exchange_rate = additionalFields.exchange_rate;
						if (additionalFields.periodicity) body.periodicity = additionalFields.periodicity;
						if (additionalFields.payment_form) body.payment_form = additionalFields.payment_form;
						if (additionalFields.idempotency_key) body.idempotency_key = additionalFields.idempotency_key;
						if (additionalFields.metadata) {
							body.metadata = JSON.parse(additionalFields.metadata as string);
						}

						// Handle invoice_config
						const invoiceConfig = this.getNodeParameter('invoiceConfig', i, {}) as IDataObject;
						if (invoiceConfig && Object.keys(invoiceConfig).length > 0) {
							const config: IDataObject = {};
							if (invoiceConfig.serie) config.serie = invoiceConfig.serie;
							if (invoiceConfig.folio && invoiceConfig.folio !== 0) config.folio = invoiceConfig.folio;
							if (Object.keys(config).length > 0) {
								body.invoice_config = config;
							}
						}

						responseData = await gigstackApiRequest.call(this, 'POST', '/receipts', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const receiptId = this.getNodeParameter('receiptId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/receipts/${receiptId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/receipts', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/receipts', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'cancel') {
						const receiptId = this.getNodeParameter('receiptId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'DELETE', `/receipts/${receiptId}`, {}, qs);
					} else if (operation === 'stamp') {
						const receiptId = this.getNodeParameter('receiptId', i) as string;
						const stamp_to = this.getNodeParameter('stamp_to', i) as string;
						const stampOptions = this.getNodeParameter('stampOptions', i) as IDataObject;

						const body: IDataObject = { stamp_to };

						// Build fiscal_information if any override fields provided
						const fiscalInfo: IDataObject = {};
						if (stampOptions.legal_name) fiscalInfo.legal_name = stampOptions.legal_name;
						if (stampOptions.tax_id) fiscalInfo.tax_id = stampOptions.tax_id;
						if (stampOptions.tax_system) fiscalInfo.tax_system = stampOptions.tax_system;
						if (stampOptions.zip) fiscalInfo.zip = stampOptions.zip;
						if (Object.keys(fiscalInfo).length > 0) body.fiscal_information = fiscalInfo;

						if (stampOptions.date) {
							body.date = new Date(stampOptions.date as string).getTime();
						}

						responseData = await gigstackApiRequest.call(this, 'POST', `/receipts/${receiptId}/stamp`, body, qs);
						responseData = simplifyResponse(responseData);
					}
				}

				// =====================
				// TEAM OPERATIONS
				// =====================
				else if (resource === 'team') {
					if (operation === 'create') {
						const tax_id = this.getNodeParameter('tax_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { tax_id };

						if (additionalFields.tax_system) body.tax_system = additionalFields.tax_system;
						if (additionalFields.support_email) body.support_email = additionalFields.support_email;
						if (additionalFields.support_phone) body.support_phone = additionalFields.support_phone;
						if (additionalFields.generate_onboarding_url) {
							body.generate_onboarding_url = additionalFields.generate_onboarding_url;
						}

						// Build brand
						const brand: IDataObject = {};
						if (additionalFields.brandAlias) brand.alias = additionalFields.brandAlias;
						if (additionalFields.primaryColor) brand.primary_color = additionalFields.primaryColor;
						if (additionalFields.logo) brand.logo = additionalFields.logo;
						if (Object.keys(brand).length > 0) body.brand = brand;

						// Build address
						const address: IDataObject = {};
						if (additionalFields.street) address.street = additionalFields.street;
						if (additionalFields.zip) address.zip = additionalFields.zip;
						if (additionalFields.city) address.city = additionalFields.city;
						if (additionalFields.state) address.state = additionalFields.state;
						if (additionalFields.country) address.country = additionalFields.country;
						if (Object.keys(address).length > 0) body.address = address;

						responseData = await gigstackApiRequest.call(this, 'POST', '/teams', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/teams/${teamId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/teams', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/teams', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'update') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.tax_id) body.tax_id = updateFields.tax_id;
						if (updateFields.tax_system) body.tax_system = updateFields.tax_system;
						if (updateFields.support_email) body.support_email = updateFields.support_email;
						if (updateFields.support_phone) body.support_phone = updateFields.support_phone;

						const brand: IDataObject = {};
						if (updateFields.brandAlias) brand.alias = updateFields.brandAlias;
						if (updateFields.primaryColor) brand.primary_color = updateFields.primaryColor;
						if (updateFields.logo) brand.logo = updateFields.logo;
						if (Object.keys(brand).length > 0) body.brand = brand;

						responseData = await gigstackApiRequest.call(this, 'PUT', `/teams/${teamId}`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getIntegrations') {
						responseData = await gigstackApiRequest.call(this, 'GET', '/teams/integrations', {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'addMember') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						responseData = await gigstackApiRequest.call(this, 'POST', `/teams/${teamId}/add-member`, { id: userId, role }, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'removeMember') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;

						responseData = await gigstackApiRequest.call(this, 'POST', `/teams/${teamId}/remove-member`, { id: userId }, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getSeries') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/teams/${teamId}/series`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'createSeries') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const series = this.getNodeParameter('series', i) as string;
						const live = this.getNodeParameter('live', i) as number;
						const test = this.getNodeParameter('test', i) as number;

						const body: IDataObject = { series };
						if (live) body.live = live;
						if (test) body.test = test;

						responseData = await gigstackApiRequest.call(this, 'POST', `/teams/${teamId}/series`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'updateSeries') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const seriesId = this.getNodeParameter('seriesId', i) as string;
						const live = this.getNodeParameter('live', i) as number;
						const test = this.getNodeParameter('test', i) as number;

						const body: IDataObject = {};
						if (live) body.live = live;
						if (test) body.test = test;

						responseData = await gigstackApiRequest.call(this, 'PUT', `/teams/${teamId}/series/${seriesId}`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'updateSettings') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						const settings = this.getNodeParameter('settings', i) as IDataObject;

						const body: IDataObject = {};
						if (settings.default_description) body.default_description = settings.default_description;
						if (settings.invoice_pdf_notes) body.invoice_pdf_notes = settings.invoice_pdf_notes;
						if (settings.product_key) body.product_key = settings.product_key;
						if (settings.unit_key) body.unit_key = settings.unit_key;
						if (settings.use) body.use = settings.use;
						if (settings.keep_full_legal_name !== undefined) body.keep_full_legal_name = settings.keep_full_legal_name;

						// Email settings
						const emails: IDataObject = {};
						if (settings.avoid_invoice_emails !== undefined) emails.avoid_invoice_emails = settings.avoid_invoice_emails;
						if (settings.invoices_bcc) {
							emails.invoices_bcc = (settings.invoices_bcc as string).split(',').map((e) => e.trim());
						}
						if (Object.keys(emails).length > 0) body.emails = emails;

						responseData = await gigstackApiRequest.call(this, 'PUT', `/teams/${teamId}/settings`, body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getOnboardingUrl') {
						const teamId = this.getNodeParameter('teamId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/teams/${teamId}/onboarding-url`, {}, qs);
						responseData = simplifyResponse(responseData);
					}
				}

				// =====================
				// USER OPERATIONS
				// =====================
				else if (resource === 'user') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { email };

						if (additionalFields.first_name) body.first_name = additionalFields.first_name;
						if (additionalFields.last_name) body.last_name = additionalFields.last_name;
						if (additionalFields.phone) body.phone = additionalFields.phone;
						if (additionalFields.company_role) body.company_role = additionalFields.company_role;
						if (additionalFields.role) body.role = additionalFields.role;
						if (additionalFields.auto_join !== undefined) body.auto_join = additionalFields.auto_join;

						// Build address
						const address: IDataObject = {};
						if (additionalFields.street) address.street = additionalFields.street;
						if (additionalFields.zip) address.zip = additionalFields.zip;
						if (additionalFields.city) address.city = additionalFields.city;
						if (additionalFields.state) address.state = additionalFields.state;
						if (additionalFields.country) address.country = additionalFields.country;
						if (Object.keys(address).length > 0) body.address = address;

						responseData = await gigstackApiRequest.call(this, 'POST', '/users', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/users/${userId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						Object.assign(qs, buildFilterQuery(filters));

						if (returnAll) {
							responseData = await gigstackApiRequestAllItems.call(this, 'GET', '/users', {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/users', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'update') {
						const userId = this.getNodeParameter('userId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await gigstackApiRequest.call(this, 'PUT', `/users/${userId}`, updateFields, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'resetPassword') {
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						responseData = await gigstackApiRequest.call(this, 'POST', '/users/reset-password', { email: userEmail }, qs);
					} else if (operation === 'loginLink') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'POST', '/users/login-link', { user_id: userId }, qs);
						responseData = simplifyResponse(responseData);
					}
				}

				// =====================
				// WEBHOOK OPERATIONS
				// =====================
				else if (resource === 'webhook') {
					if (operation === 'create') {
						const url = this.getNodeParameter('url', i) as string;
						const events = this.getNodeParameter('events', i) as string[];
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = { url, events };
						if (additionalFields.description) body.description = additionalFields.description;
						if (additionalFields.status) body.status = additionalFields.status;

						responseData = await gigstackApiRequest.call(this, 'POST', '/webhooks', body, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'get') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'GET', `/webhooks/${webhookId}`, {}, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (filters.status) qs.status = filters.status;

						if (returnAll) {
							qs.limit = 100;
							const response = await gigstackApiRequest.call(this, 'GET', '/webhooks', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await gigstackApiRequest.call(this, 'GET', '/webhooks', {}, qs);
							responseData = (response.data as IDataObject[]) || [];
						}
					} else if (operation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await gigstackApiRequest.call(this, 'PUT', `/webhooks/${webhookId}`, updateFields, qs);
						responseData = simplifyResponse(responseData);
					} else if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await gigstackApiRequest.call(this, 'DELETE', `/webhooks/${webhookId}`, {}, qs);
					}
				}

				// Return data
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item })));
				} else if (responseData !== undefined) {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
