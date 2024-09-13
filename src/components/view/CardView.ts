import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductCard extends IProduct {
	index?: number;
	buttonText?: string;
}

export class CardView extends Component<IProductCard> {
	protected _index?: HTMLButtonElement;
	protected _image?: HTMLImageElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonText: string;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._index 			= container.querySelector('.basket__item-index');
		this._image 			= container.querySelector('.card__image');
		this._category 		= container.querySelector('.card__category');
		this._title 			= ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__text');
		this._button 			= container.querySelector('.card__button');
		this._price 			= ensureElement<HTMLElement>('.card__price', container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	//#region Set_Get

	set id(id: string) {
		this.container.dataset.id = id;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(image: string) {
		this.setImage(this._image, image, this.title);
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set category(category: string) {
		this.setText(this._category, category);
	}

	set index(index: string) {
		this._index.textContent = index;
	}

	set price(price: string) {
		if (price) {
			this.setText(this._price, `${price} синапсов`);
      this.setDisabled(this._button, false);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	//#endregion

	set buttonText(buttonText: string) {
		this.setText(this._button, buttonText);
	}

	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

}
