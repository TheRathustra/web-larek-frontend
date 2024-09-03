import { IOrder, IOrderStatus, IProduct } from '../types';
import {
	API_URL,
	CDN_URL,
	PRODUCT_ENDPOINT,
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

	async getProduct(id: number): Promise<IProduct> {
		const response = await this.get(PRODUCT_ENDPOINT(id.toString()));
		return response as IProduct;
	}

	async placeOrder(order: IOrder): Promise<IOrderStatus> {
		const response = await this.post(ORDER_ENDPOINT, order);
		return response as IOrderStatus;
	}
}
