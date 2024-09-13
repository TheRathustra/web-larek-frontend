import { IProduct, IAppState, IBasket, IOrder, PaymentMethod, TOrderFields } from "../../types";
import { eventType } from "../../types/eventsType";
import { IEvents } from "../base/events";
import { Model } from "../base/Model";

export class AppState extends Model<IAppState> {
  protected _items: IProduct[];
  protected _preview: string | null;
  protected _basket: IBasket | null;
  protected _order: IOrder | null;
  protected _errors: string[];
  protected events: IEvents;

  constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
		this._errors = []
	}
 
//#region items

  set items(items: IProduct[]) {
    this._items = items;
    this.emitChanges(eventType.productChanged.toString())
  }

  get items(): IProduct[] {
    return this._items;
  }
  
  getItem(id: string): IProduct {
    return this._items.find(item => item.id === id);
  }

  addItem(item: IProduct, payload?: Function | null): void {
    this._items.push(item);
    if (payload) {
      payload();
    }

    this.emitChanges(eventType.productChanged.toString());
  }

  deleteItem(item: IProduct, payload: Function | null): void {
    this._items = this._items.filter((product) => product.id !== item.id);
    if (payload) {
      payload();
    }

    this.emitChanges(eventType.productChanged.toString());
  }

//#endregion

//#region preview
  
  set preview(id: string) {
    this._preview = id;
    this.emitChanges(eventType.previewChanged.toString());
  }

  get preview(): string {
    return this._preview;
  }

//#endregion

//#region basket

  set basket(basket: IBasket) {
    this._basket = basket;
  }

  get basket(): IBasket {
    return this._basket;
  }

  isInBasket(product: IProduct): boolean {
    return this._basket.containsItem(product);
  }

  get total(): number {
		return this._basket.total;
	}

  addToBasket(product: IProduct) {
    this._basket.add(product);
  }

  deleteFromBasket(product: IProduct) {
    this._basket.delete(product);
  }

  clearBasket() {
    this._basket.clear();
  }

  //#endregion

 //#region order 

  set order(order: IOrder) {
    this._order = order;
    this.emitChanges(eventType.orderChanged.toString());
  }

  get order(): IOrder {
    return this._order;
  }

  setOrderField<K extends keyof TOrderFields>(key: K, value: string) {
    if (!this._order) {
			return;
		}		
 
    this._order[key] = value;
  }

  clearOrder(): void {
    this._order = null;
    this.emitChanges(eventType.orderChanged.toString());
  }

  resetOrder() {
		this.order.address = '';
		this.order.payment = null;
	}

	resetContact() {
		this.order.email = '';
		this.order.phone = '';
	}

  validateOrder() {
		this.clearErrors();
    
    if (!this.order.payment) {
			this.addError('Необходимо указать cпособ оплаты');
		}
		if (!this.order.address) {
			this.addError('Необходимо указать адрес доставки');
		}
    this.events.emit(eventType.orderErrors.toString(), this._errors);

		return this._errors.length === 0;
	}

	validateContact() {
    this.clearErrors();

		if (!this.order.email) {
			this.addError('Необходимо указать email');
		}
		if (!this.order.phone) {
			this.addError('Необходимо указать телефон');
		}
		this.events.emit(eventType.contactsErrors.toString(), this._errors);

		return this._errors.length === 0;
	}

//#endregion

//#region errors

  addError(error: string) {
    if (!this._errors.includes(error)) {
      this._errors.push(error);
    }
  }

  clearErrors() {
    this._errors = [];
  }

  set errors(errors: string[]) {
    this.errors = errors;
  }

  get errors(): string[] {
    return this._errors;
  }

//#endregion

}