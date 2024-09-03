import { IProduct, IAppState, IBasket, IOrder } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
  protected _items: IProduct[];
  protected _total: number;
  protected _preview: string | null;
  protected _basket: IBasket | null;
  protected _order: IOrder | null;
  protected events: IEvents;
 
  set items(items: IProduct[]) {
    console.log(items);
    this._items = items;
    this._total = items.length;
    this.emitChanges('products:changed')
  }

  get items(): IProduct[] {
    return this._items;
  }
  
  getItem(id: string): IProduct {
    return this._items.find(item => item._id === id);
  }

  addItem(item: IProduct, payload?: Function | null): void {
    this._items.push(item);
    if (payload) {
      payload();
    }

    this.emitChanges('products:changed');
  }

  deleteItem(id: string, payload: Function | null): void {
    this._items = this._items.filter(item => item._id !== id);
    if (payload) {
      payload();
    }

    this.emitChanges('products:changed');
  }

  updateItem(newItem: IProduct, payload: Function | null): void {
    const item = this._items.find(item => item._id === newItem._id);
 
  }

  set preview(id: string) {
    this._preview = id;
    this.emitChanges('preview:changed');
  }

  get preview(): string {
    return this._preview;
  }

  set basket(basket: IBasket) {
    this._basket = basket;
    this.emitChanges('basket:changed');
  }

  get basket(): IBasket {
    return this._basket;
  }

  addToBasket(product: IProduct) {
    this._basket.add(product);
  }

  deleteFromBasket(id: string) {
    this._basket.delete(id);
  }

  clearBasket() {
    this._basket.clear();
  }

  set order(order: IOrder) {
    this._order = order;
    this.emitChanges('order:changed');
  }

  get order(): IOrder {
    return this._order;
  }

  clearOrder(): void {
    this._order = null;
    this.emitChanges('order:changed');
  }

  // updateItem(item: IProduct, payload: Function | null): void;
  // checkValidation(data: Record<keyof IProduct, string>): boolean;

}