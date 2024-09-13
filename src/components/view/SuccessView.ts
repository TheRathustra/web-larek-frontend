import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IActions {
	onClick: () => void;
}

interface ISuccess {
	description: string;
}

export class SuccessView extends Component<ISuccess> {
  protected _title: HTMLElement;
  protected _description: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected actions?: IActions) {
		super(container);

    this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
		this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

		if (actions?.onClick) {
			this._closeButton.addEventListener('click', actions.onClick);
    }

	}

	set description(value: string) {
		this._description.textContent = `Списано ${value} синапсов`;
	}
  
}