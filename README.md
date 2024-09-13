# Проектная работа "Веб-ларек"

[Макет](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?node-id=0-1)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Тип для идентификатора

```
type Id = string;
```

Продукт

```
export interface IProduct {
  id: Id;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}
```

Контакты пользователя

```
export interface Contacts {
  email: string;
  phone: string;
}

Поля доставки заказа
export interface Delivery {
  address: string;
  payment: PaymentMethod | string;
}
```

Способы оплаты

```
enum PaymentMethod {
  online = 'онлайн',
  upon_receipt = 'при получении'
}
```

Заказ

```
export interface IOrder extends Contacts, Delivery {
  id: Id;
  total: number;
}
```

Интерфейс для модели данных продуктов

```
export interface IProductList {
  items: IProduct[];
  total: number;
  basket: IBasket;
  preview: Id | null;
  order: IOrder | null;
  errors: string[];
  setItems(items: IProduct[]): void;
  addItem(item: IProduct, payload: Function | null): void;
  deleteItem(item: IProduct, payload: Function | null): void;
  getItem(id: Id): IProduct;
  setOrder(order: IOrder): void;
  clearOrder(): void;
  resetOrder(): void;
  resetContact(): void;
  addError(error: string): void;
  //Так как два разные template, то и валидировать будем их отдельно
  validateOrder(): boolean;
  validateContact(): boolean;
}
```

Интерфейс для модели данных корзины

```
export interface IBasket {
  items: IProduct[];
  total: number;

  add(product: IProduct, payload?: Function | null): void;
  delete(product: IProduct, payload?: Function | null): void;
  clear(payload?: Function | null): void;
  getItemsCount(): number;
  containsItem(item: IProduct): boolean;
}
```

Поля, заполняемые пользователем в заказе
```
export type TOrderFields = Pick<IOrder, 'address' | 'payment' | 'email' | 'phone'>;
```

Тип данных для отправки заказа на обработку
```
export type TOderDTO = Pick<IOrder, 'address' | 'payment' | 'email' | 'phone' | 'total'> & {items: string[]};
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.
  
### Базовый код

#### Модификатор Partial
Конструкция `Partial<T>` используется для того, чтобы не все свойства переданного типа были обязательными.

#### Класс Model
Базовый класс модели. Содержит стандартный конструктор и метод `emitChanges` для сообщения брокеру `events` о произошедших событиях. Является родителем для любого класса модели.

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - отписка от события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   
- `onAll` - подписка на все события
- `ofAll` - отписка от всех событий
  
#### Класс Component
Абстрактный класс представления. Наследуется всеми классами View. Предназначен для создания компонентов пользовательского интерфейса.

Поля:
- `container: HTMLElement` — корневой DOM-элемент

Методы:
- `toggleClass(element: HTMLElement, class: string)` - переключение класса;
- `setText(element: HTMLElement, value: string)` — установление текстового содержимого;
- `setDisabled(element: HTMLElement, state: boolean)` — изменение статуса блокировки;
- `setHidden(element: HTMLElement)` — видимость элемента ложь;
- `setVisible(element: HTMLElement)` — видимость элемента истина;
- `setImage(element: HTMLElement, src: string, alt?: string)` — установить изображение с альтернативным текстом;
- `render(data?: any)` — рендер переданных элементов

#### Класс Form
Класс для создания форм. Наследуется от `Component<T>`.
Конструктор принимает начальное состояние и брокер событий `IEvents`.

Поля:
- `submit: HTMLButtonElement` - кнопка отправки
- `errors: HTMLElement` - ошибки формы

Методы:
- `onInputChange(field: keyof T, value: string)` - обработчик событий ввода
- `set valid(value: boolean)` - установка проверки на валидность
- `set errors(value: string)` - установка ошибок
- `render(state: Partial<T> & IFormState)` — рендер переданных элементов

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- `constructor(selector: string, events: IEvents)` Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `modal: HTMLElement` - элемент модального окна
- `events: IEvents` - брокер событий

### Слой данных

Для всех классов приняты общие наименования:
- `events: IEvents` - брокер событий.
- `payload: Function | null` - коллбэк функция, которая будет вызвана после выполнения основной функции.

#### Класс AppState
Хранит все данные приложения и реагирует на изменения.
Конструктор класса принимает начальное состояние приложения и брокер событий `IEvents`.

Поля:
- `items: IProduct[]` - хранит все продукты на странице.
- `preview: string | null` - указатель на текущий выбранный продукт
- `basket: IBasket | null` - хранит экземпляр корзины.
- `order: IOrder | null` - хранит экземпляр заказа.
- `errors: string[]` - список ошибок.
- `events: IEvents` - брокер событий.

Методы для стандартных операций над списком продуктов:
- `set items(items: IProduct[])`
- `get items(): IProduct[]`
- `getItem(id: string): IProduct`
- `addItem(item: IProduct, payload?: Function | null): void`
- `deleteItem(item: IProduct, payload: Function | null): void`

Методы для установки текущего продукта: 
- `set preview(id: string)`
- `get preview(): string`

Методы для работы с корзиной:
- `set basket(basket: IBasket)`
- `get basket(): IBasket`

Класс должен получать внутреннее состояние корзины из самого класса корзины.
Поэтому в этих функциях вызываем методы корзины:
- `isInBasket(product: IProduct): boolean`
- `addToBasket(product: IProduct)`
- `get total(): number `
- `deleteFromBasket(product: IProduct)`
- `clearBasket()`

Методы для работы с заказом:
- `set order(order: IOrder)`
- `get order(): IOrder`

Метод для установки полей заказа по введенным пользователем данным:
- `setOrderField<K extends keyof TOrderFields>(key: K, value: string)`

Т.к. формирование заказа состоит из нескольких заполняемых окон (адрес, способ доставки и контакты пользователя), то разделяем работу с ними:
- `clearOrder()`
- `resetOrder()`
- `resetContact()`
- `validateOrder()`
- `validateContact()`

Функции для работы с ошибками:
- `addError(error: string)`
- `clearErrors()`
- `set errors(errors: string[])`
- `get errors(): string[]`

#### Класс Basket
Класс служит для работы с корзиной товаров.
Конструктор класса принимает начальное состояние корзины и брокер событий `IEvents`.

Поля:
- `items: IProduct[]` - продукты, добавленные в корзину
- `total: number` - сумма продуктов в корзине
- `events: IEvents` - брокер событий.

Методы для работы со списком продуктов:
- `containsItem(product: IProduct): boolean`
- `get items(): IProduct[] `
- `set items(items: IProduct[])`
- `add(product: IProduct, payload?: Function | null): void`
- `delete(product: IProduct, payload?: Function | null): void`
- `clear(payload?: Function | null): void`
- `getItemsCount(): number`

Методы для работы с общей суммой товаров в корзине:
- `updateTotal()`
- `get total(): number`

#### Класс Order
Класс служит для работы с формируемым заказом.
Конструктор класса принимает начальное состояние заказа и брокер событий `IEvents`.

Поля:
- `id: string` - идентификатор заказа
- `total: number` - общая сумма заказа
- `address: string` - адресс доставки
- `payment: PaymentMethod | string` - способ оплаты
- `email: string` - электронная почта пользователя
- `phone: string` - телефон пользователя

Методы:
- Сеттеры и геттеры
- `createOrderDTO(order: IOrder, basket: IBasket): TOderDTO` - метод преобразует экземпляр класса Order в экземпляр класса TOrderDTO, необходимый для отправки заказа по API. Класс TOderDTO содержит поля пользователя и оплаты, а также идентификаторы продуктов в заказе.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page
Расширяет базовый класс `Component<T>` и представляет собой страницу в веб-приложении.
В конструкторе класс принимает 2 аргумента:
- `container` - элемент HTML, в котором будет отображаться страница
- `events` - объект, содержащий обработчики событий для страницы

Поля:
- `catalog: HTMLElement` - каталог товаров
- `wrapper: HTMLElement` - сама страница
- `basket: HTMLElement` - иконка корзины в шапке
- `counter: HTMLElement` - счетчик товаров в корзине

#### Класс CardView
Расширяет базовый класс `Component<T>` и представляет карточку товара в пользовательском интерфейсе.

В конструкторе принимает элемент HTML шаблона карточки и действие при нажатии на кнопку или саму карточку.

Поля:
- `index?: HTMLButtonElement` - идентификатор карточки
- `image?: HTMLImageElement` - изображение товара
- `category: HTMLElement` - категория
- `title: HTMLElement` - заголовок
- `description?: HTMLElement` - описание
- `button?: HTMLButtonElement` - кнопка
- `buttonText: string` - текст кнопки
- `price: HTMLElement` - цена товара

Методами являются сеттеры и геттеры для полей

#### Класс BasketView
Расширяет базовый класс `Component<T>` и представляет корзину в пользовательском интерфейсе.

В конструкторе принимает элемент HTML шаблона корзины и объект, содержащий обработчики событий для корзины

Поля:
- `items: IProduct[]` - товары в корзине
- `total: number` - итоговая цена товаров
- `events: IEvents` - брокер событий

#### Класс OrderView
Расширяет базовый класс `Component<T>` и представляет заказ в пользовательском интерфейсе. Отвечает за отображение адреса доставки и способа оплаты.

В конструкторе принимает элемент HTML шаблона заказа и объект, содержащий обработчики событий для заказа.

Поля:
- `payment: HTMLButtonElement[]` - кнопки переключения способа оплаты 
- `address: HTMLInputElement` - поле адреса доставки

#### Класс ContactView
Расширяет базовый класс `Component<T>` и представляет заказ в пользовательском интерфейсе. Отвечает за отображение данных пользователя.

В конструкторе принимает элемент HTML шаблона заказа и объект, содержащий обработчики событий для заказа.

Поля:
- `phone: HTMLInputElement` - телефон пользователя
- `email: HTMLInputElement` - электронная почта пользователя

#### Класс SuccessView
Расширяет базовый класс `Component<T>` и представляет результат оформления заказа в пользовательском интерфейсе.

- `title: HTMLElement` - заголовок
- `description: HTMLElement` - описание результата оформления заказа
- `closeButton: HTMLButtonElement` - кнопка закрытия

#### Перечисление eventsType
Содержит все возможные события приложения для брокера

#### ViewSettings
Служит для удобства поиска настроек отображения.
Хранит соответствие цветов отображения для разных категорий товаров.