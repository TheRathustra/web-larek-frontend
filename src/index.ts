import { AppAPI } from './components/AppAPI';
import { AppState } from './components/model/AppState';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { CardView } from './components/view/CardView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';

const api = new AppAPI();
const events = new EventEmitter();

//Шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const BasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const appstate = new AppState({}, events);
const page = new Page(document.body, events);

api
	.getProductList()
	.then((result) => {
		appstate.items = result;
	})
	.catch(console.error);

events.on('products:changed', () => {
	page.catalog = appstate.items.map((item) => {
		const card = new CardView(cloneTemplate(cardTemplate), {
			onClick: () => events.emit('product:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('product:select', (item: IProduct) => {
  appstate.preview = item._id;
	page.locked = true;
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('basket:changed', item);
		},
	});
	modal.render({
		content: card.render({
			_id: item._id,
			title: item.title,
			description: item.description,
			image: item.image,
			category: item.category,
			price: item.price,
		}),
	});
});