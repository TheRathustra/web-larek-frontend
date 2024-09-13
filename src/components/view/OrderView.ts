import { Form } from '../common/Form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

export class OrderView extends Form<IOrder> {
	protected _payment: HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
 
		this._address = container.querySelector('input[name="address"]');
		this._payment = ensureAllElements(`.button_alt`, this.container);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				this.onInputChange(`payment`, button.name);
			});
		});
	}

	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	
	clearFieldPayment() {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
	
	set address(value: string) {
		this._address.value = value;
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

}

export class ContactView extends Form<IOrder> {

	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phone = container.querySelector('input[name="email"]');
		this._email = container.querySelector('input[name="phone"]');
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
}