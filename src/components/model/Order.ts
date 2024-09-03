import { IOrder, PaymentMethod } from "../../types";
import { Model } from "../base/Model";

export class Order extends Model<IOrder> {

  protected _id: string;
  protected _total: number;
  protected _address: string;
  protected _payment: PaymentMethod;
  protected _email: string;
  protected _phone: string;

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

}