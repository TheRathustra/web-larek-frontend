import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { createElement, ensureElement } from '../../utils/utils';
import { eventType } from '../../types/eventsType';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class BasketView extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._button = this.container.querySelector('.basket__button');
		this._price  = this.container.querySelector('.basket__price');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(eventType.orderOpen.toString());
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._price, `${total} синапсов`);
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}
}
