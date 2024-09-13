type Id = string;

export interface IProduct {
  id: Id;
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

export interface Delivery {
  address: string;
  payment: PaymentMethod | string;
}

export enum PaymentMethod {
  card = 'card',
  cash = 'cash'
}

export interface IOrder extends Contacts, Delivery {
  id: Id;
  total: number;
}

export interface IOrderStatus {
	id: string;
	total: number;
}

export interface IBasket {
  items: IProduct[];
  total: number;

  add(product: IProduct, payload?: Function | null): void;
  delete(product: IProduct, payload?: Function | null): void;
  clear(payload?: Function | null): void;
  getItemsCount(): number;
  containsItem(item: IProduct): boolean;
}
 
export type TBasketProduct = Pick<IProduct, 'title' | 'price'>;

export type TShortProduct = Pick<IProduct, 'title' | 'price' | 'image'>; 

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TOrderFields = Pick<IOrder, 'address' | 'payment' | 'email' | 'phone'>;

export type TOderDTO = Pick<IOrder, 'address' | 'payment' | 'email' | 'phone' | 'total'> & {items: string[]};

export interface IAppState {
  items: IProduct[];
  total: number;
  basket: IBasket;
  preview: Id | null;
  order: IOrder | null;
  errors: string[];
  setItems(items: IProduct[]): void;
  addItem(item: IProduct, payload: Function | null): void;
  deleteItem(item: IProduct, payload: Function | null): void;
  getItem(id: Id): IProduct;
  setOrder(order: IOrder): void;
  clearOrder(): void;
  resetOrder(): void;
  resetContact(): void;
  addError(error: string): void;
  //Так как два разные template, то и валидировать будем их отдельно
  validateOrder(): boolean;
  validateContact(): boolean;
}

export interface IAPI {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>;
}