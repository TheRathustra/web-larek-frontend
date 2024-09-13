import { IBasket, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { eventType } from '../../types/eventsType';

export class Basket extends Model<IBasket> {
	protected _items: IProduct[];
	protected _total: number;
	protected events: IEvents;

	constructor(data: Partial<IBasket>, events: IEvents) {
		super(data, events);
		this._items = []
	}

//#region items

	containsItem(product: IProduct): boolean {
		return this._items.includes(product);
	}

	get items(): IProduct[] {
		return this._items;
	}

  set items(items: IProduct[]) {
    this._items = items;
		this.updateTotal();
    this.emitChanges(eventType.basketChanged.toString());
  }

	add(product: IProduct, payload?: Function | null): void {
		if (!this.containsItem(product)) {
			this._items.push(product);
		}

		if (payload) {
			payload();
		}

		this.updateTotal();
		this.emitChanges(eventType.basketChanged.toString());
	}

	delete(product: IProduct, payload?: Function | null): void {
    this._items = this._items.filter((item) => item.id != product.id);
		if (payload) {
			payload();
		}

		this.updateTotal();

		this.emitChanges(eventType.basketChanged.toString());
  }

	clear(payload?: Function | null): void {
    this._items = [];
    if (payload) {
			payload();
		}
		this._total = 0;
		this.emitChanges(eventType.basketChanged.toString());
  }

	getItemsCount(): number {
		return this._items.length;
	}

	//#endregion

	updateTotal() {
		this._total = this._items.reduce((total, item) => total + item.price, 0);
	}

	get total() {
		return this._total;
	}

}
