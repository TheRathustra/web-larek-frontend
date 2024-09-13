import { IBasket, IOrder, IProduct, PaymentMethod, TOderDTO } from "../../types";
import { Model } from "../base/Model";

export class Order extends Model<IOrder> {

  protected _id: string;
  protected _total: number;
  protected _address: string;
  protected _payment: PaymentMethod | string;
  protected _email: string;
  protected _phone: string;

//#region Set_Get  

  set id(id: string) {
		this._id = id;
	}

	get id(): string {
		return this._id || '';
	}

  get total(): number {
    return this._total;
  }

  set total(total: number) {
    this._total = total;
  }

  get address(): string {
    return this._address;
  }

  set address(address: string) {
    this._address = address;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  get payment(): PaymentMethod | string {
    return this._payment;
  }

  set payment(payment: PaymentMethod | string) {
    if (typeof(payment) === 'string') {
      if (isPaymentMethod(payment)){
        this._payment = PaymentMethod[payment];
      }
    } else {
      this._payment = payment;
    }
  }
//#endregion  

}

export function createOrderDTO(order: IOrder, basket: IBasket): TOderDTO {
  const orderDTO = new OrderDTO(order);
  basket.items.forEach(item => orderDTO.items.push(item.id));
  return orderDTO;
}

class OrderDTO implements TOderDTO {
  total: number;
  address: string;
  payment: string;
  email: string;
  phone: string;
  items: string[];

  constructor(order: IOrder) {
    this.email    = order.email;
    this.address  = order.address;
    this.total    = order.total;
    this.payment  = order.payment.toString();
    this.phone    = order.phone;
    this.items    = [];
  }

}

function isPaymentMethod(key: string): key is PaymentMethod {
  return key in PaymentMethod;
}