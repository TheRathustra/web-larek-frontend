export enum eventType {
  productChanged = 'product:changed',
  basketChanged = 'basket:changed',
  previewChanged = 'preview:changed',
  orderChanged = 'order:changed',
  productSelect = 'product:select',
  basketAdd = 'basket:add',
  basketDelete = 'basket:remove',
  basketOpen = 'basket:open',
  productToBasket = 'product:toBasket',
  orderOpen = 'order:open',
  orderSubmit = 'order:submit',
  orderErrors = 'order:errors',
  contactsSubmit = 'contacts:submit',
  contactsErrors = 'contacts:errors',
  modalOpen = 'modal:open',
  modalClose = 'modal:close',
}