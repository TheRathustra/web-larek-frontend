import { IBasket, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class Basket extends Model<IBasket> {
	protected _items: IProduct[];
	protected _total: number;
	protected events: IEvents;

	get items(): IProduct[] {
		return this._items;
	}

  set items(items: IProduct[]) {
    this._items = items;
    this.emitChanges('basket:changed');
  }

	add(product: IProduct, payload?: Function | null): void {
		this._items.push(product);
		if (payload) {
			payload();
		}

		this.emitChanges('basket:changed');
	}

	delete(id: string, payload?: Function | null): void {
    this._items = this._items.filter(item => item._id !== id);
		if (payload) {
			payload();
		}

		this.emitChanges('basket:changed');
  }

	clear(payload?: Function | null): void {
    this._items = [];
    if (payload) {
			payload();
		}

		this.emitChanges('basket:changed');
  }
}
