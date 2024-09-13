import { IOrderStatus, IProduct, TOderDTO } from '../types';
import {
	API_URL,
	CDN_URL,
	PRODUCT_LIST_ENDPOINT,
	ORDER_ENDPOINT,
} from '../utils/constants';

import { Api, ApiListResponse } from './base/api';

export class AppAPI extends Api {
	private cdnUrl: string;

	constructor(options: RequestInit = {}) {
		super(API_URL, options);
		this.cdnUrl = CDN_URL;
	}

	async getProductList(): Promise<IProduct[]> {
		const response = await this.get(PRODUCT_LIST_ENDPOINT);
		const apiResponse = response as ApiListResponse<IProduct>;
		return apiResponse.items.map((item) => ({
			...item,
			image: this.cdnUrl + item.image,
		}));
	}

	async createOrder(order: TOderDTO): Promise<IOrderStatus> {
		console.log(order);
		const response = await this.post(ORDER_ENDPOINT, order);
		return response as IOrderStatus;
	}
 
}
