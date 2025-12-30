import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function gigstackApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		body,
		qs,
		url: `https://api.gigstack.io/v2${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'gigstackApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function gigstackApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData: IDataObject;
	let nextCursor: string | undefined;

	qs.limit = qs.limit || 100;

	do {
		if (nextCursor) {
			qs.next = nextCursor;
		}

		responseData = await gigstackApiRequest.call(this, method, endpoint, body, qs);

		const data = responseData.data as IDataObject[];
		if (data) {
			returnData.push(...data);
		}

		nextCursor = responseData.next as string | undefined;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (responseData.has_more === true && nextCursor);

	return returnData;
}

export function simplifyResponse(response: IDataObject): IDataObject {
	if (response.data !== undefined) {
		return response.data as IDataObject;
	}
	return response;
}

export function buildFilterQuery(filters: IDataObject): IDataObject {
	const qs: IDataObject = {};

	if (filters.limit) {
		qs.limit = filters.limit;
	}

	if (filters.orderBy) {
		qs.order_by = filters.orderBy;
	}

	if (filters.sort) {
		qs.sort = filters.sort;
	}

	if (filters.team) {
		qs.team = filters.team;
	}

	// Status filter (payments, invoices, receipts)
	if (filters.status) {
		qs.status = filters.status;
	}

	// Client filter
	if (filters.client_id) {
		qs.client_id = filters.client_id;
	}

	// Email filter (payments)
	if (filters.email) {
		qs.email = filters.email;
	}

	// Currency filter (payments)
	if (filters.currency) {
		qs.currency = filters.currency;
	}

	// Date filters
	if (filters.createdAfter) {
		qs['created[gte]'] = Math.floor(new Date(filters.createdAfter as string).getTime() / 1000);
	}

	if (filters.createdBefore) {
		qs['created[lte]'] = Math.floor(new Date(filters.createdBefore as string).getTime() / 1000);
	}

	// Metadata filters - supports both dot notation (metadata.key) and underscore notation (metadata_key)
	if (filters.metadataFilters) {
		const metadataFilters = filters.metadataFilters as IDataObject;
		const metadataFilterItems = (metadataFilters.filters as IDataObject[]) || [];

		for (const filter of metadataFilterItems) {
			if (filter.key && filter.value) {
				// Use dot notation as per API spec: metadata.{key}={value}
				qs[`metadata.${filter.key}`] = filter.value;
			}
		}
	}

	return qs;
}
