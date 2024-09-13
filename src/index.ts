import { eventType } from './types/eventsType';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppAPI } from './components/AppAPI';
import { AppState } from './components/model/AppState';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Modal } from './components/common/Modal';
import { IProduct, TOrderFields } from './types';
import { CardView } from './components/view/CardView';
import { Basket } from './components/model/Basket';
import { BasketView } from './components/view/BasketView'
import { Order, createOrderDTO } from './components/model/Order';
import { ContactView, OrderView } from './components/view/OrderView';
import { SuccessView } from './components/view/SuccessView';
import './scss/styles.scss';

//#region constants
const api = new AppAPI();
const events = new EventEmitter();

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const appState = new AppState({}, events);
const basket = new Basket({}, events);
const order = new Order({}, events);

appState.basket = basket;
appState.order = order;

const page = new Page(document.body, events);

const basketView 	 = new BasketView(cloneTemplate(basketTemplate), events);
const orderView 	 = new OrderView(cloneTemplate(orderTemplate), events);
const contactsView = new ContactView(cloneTemplate(contactsTemplate), events);
//#endregion

// Первоначальное заполнение продуктов
api
	.getProductList()
	.then((result) => {
		appState.items = result;
	})
	.catch(console.error);

//#region product	

//При изменениее продуктов (при первоначальном заполнении выводим все карточки)
events.on(eventType.productChanged.toString(), () => {
	page.catalog = appState.items.map((item) => {
		const clickAction = {onClick: () => events.emit(eventType.productSelect.toString(), item)};
		const card = new CardView(cloneTemplate(cardTemplate), clickAction);
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

//При клике на продукте
events.on(eventType.productSelect.toString(), (item: IProduct) => {
  appState.preview = item.id;
	const card = new CardView(cloneTemplate(cardPreviewTemplate), 
								{onClick: () => {
									events.emit(eventType.productToBasket.toString(), item)
									card.buttonText = appState.isInBasket(item) ? 'Удалить из корзины' : 'Добавить в корзину';}
								});								
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			description: item.description,
			image: item.image,
			category: item.category,
			price: item.price,
			buttonText: appState.isInBasket(item) ? 'Удалить из корзины' : 'Добавить в корзину',
		}),
	});
});
//#endregion

//#region basket
events.on(eventType.basketChanged.toString(), () => {
	page.counter = appState.basket.getItemsCount();

	basketView.items = appState.basket.items.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasket), {
			onClick: () => {
				events.emit(eventType.basketDelete.toString(), item);
			},
		});
		return card.render({
			index: (index + 1),
			title: item.title,
			price: item.price,
		});
	});

	basketView.total = appState.total;
});

events.on(eventType.productToBasket.toString(), (item: IProduct) => {
	if (!appState.isInBasket(item)) {
		events.emit(eventType.basketAdd.toString(), item);
	} else {
		events.emit(eventType.basketDelete.toString(), item);
	}
});

events.on(eventType.basketAdd.toString(), (item: IProduct) => {
	appState.addToBasket(item);
	modal.close();
});

events.on(eventType.basketDelete.toString(), (item: IProduct) => {
	appState.deleteFromBasket(item);
});

events.on(eventType.basketOpen.toString(), () => {
	basketView.selected = appState.basket.items.map((item) => item.id);
	modal.render({
				content: basketView.render({
				total: appState.total,
			}),
	});
});
//#endregion

//#region order
events.on(eventType.orderOpen.toString(), () => {
	modal.render({
		content: orderView.render({
							payment: null,
							address: '',
							valid: false,
							errors: [],
						}),
	});
});

// Открытие модального окна с контактами
events.on(eventType.orderSubmit.toString(), () => {
	modal.render({
		content: contactsView.render({
							phone: '',
							email: '',
							valid: false,
							errors: [],
						}),
	});
});

events.on(eventType.orderErrors.toString(), (errors: string[]) => {
	orderView.valid = errors.length == 0;
});

events.on(eventType.contactsErrors.toString(), (errors: string[]) => {
	contactsView.valid = errors.length == 0;
});

events.on(/^order\..*:change/,(data: { field: keyof TOrderFields; 
																		value: string 
																	}) => {																	
		if (!appState.order) {
			return;
		}																	
		appState.setOrderField(data.field, data.value);
		appState.validateOrder();
	}
);

events.on(/^contacts\..*:change/,(data: { field: keyof TOrderFields; 
																			 value: string 
																		 }) => {
		if (!appState.order) {
			return;
		}
		appState.setOrderField(data.field, data.value);
		appState.validateContact();
	}
);

events.on(eventType.contactsSubmit.toString(), () => {
	appState.order.total = appState.basket.total;
	const orderDTO = createOrderDTO(appState.order, appState.basket);
	api.createOrder(orderDTO)
		.then((result) => {
			appState.clearBasket();
			const clickAction = {onClick: () => {
															modal.close();
															appState.resetOrder();
															appState.resetContact();
														},
													};
			const success = new SuccessView(cloneTemplate(successTemplate), clickAction);
			modal.render({
							content: success.render({description: result.total.toString(),}),
						});
		})
		.catch((error) => {
			console.log(error);
		});
});
//#endregion

//#region modal
events.on(eventType.modalOpen.toString(), () => {
	page.locked = true;
});

events.on(eventType.modalClose.toString(), () => {
	page.locked = false;
});
//#endregion