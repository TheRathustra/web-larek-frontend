import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductCard extends IProduct {
	count?: number;
	buttonText?: string;
}

export class CardView extends Component<IProductCard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title     = ensureElement<HTMLElement>(`.card__title`, container);
		this._description = ensureElement<HTMLElement>(`.card__description`);
		this._image     = ensureElement<HTMLImageElement>(`.card__image`);
		this._index     = ensureElement<HTMLButtonElement>(`.basket__item-index`);
		this._button    = ensureElement<HTMLButtonElement>(`.card__button`);
		this._category  = ensureElement<HTMLElement>(`.card__category`);
		this._price     = ensureElement<HTMLElement>(`.card__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

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

	set buttonText(buttonText: string) {
		this.setText(this._button, buttonText);
	}
}
