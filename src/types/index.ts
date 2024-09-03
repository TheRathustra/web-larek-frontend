
type Id = string;

export interface IProduct {
  _id: Id;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export interface Contacts {
  email: string;
  phone: string;
}

export enum PaymentMethod {
  online = 'онлайн',
  upon_receipt = 'при получении'
}

export interface IOrder extends Contacts {
  _id: Id;
  total: number;
  address: string;
  payment: PaymentMethod;
}

export interface IOrderStatus {
	status: string;
	totalPrice: number;
}

export interface IBasket {
  items: IProduct[];
  total: number;

  add(product: IProduct, payload?: Function | null): void;
  delete(id: Id, payload?: Function | null): void;
  clear(payload?: Function | null): void;
}
 
export type TBasketProduct = Pick<IProduct, 'title' | 'price'>;

export type TShortProduct = Pick<IProduct, 'title' | 'price' | 'image'>; 

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IAppState {
  items: IProduct[];
  total: number;
  basket: IBasket;
  preview: Id | null;
  order: IOrder | null;
  setItems(items: IProduct[]): void;
  addItem(item: IProduct, payload: Function | null): void;
  deleteItem(id: Id, payload: Function | null): void;
  updateItem(item: IProduct, payload: Function | null): void;
  getItem(id: Id): IProduct;
  setOrder(order: IOrder): void;
  clearOrder(): void;
  checkValidation(data: Record<keyof IProduct, string>): boolean;
}

export interface IAPI {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>;
}