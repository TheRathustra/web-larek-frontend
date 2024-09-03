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
  _id: Id;
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
export interface IOrder extends Contacts {
  _id: Id;
  total: number;
  address: string;
  paymentMethod: PaymentMethod;
  makeOrder(): void;
}
```

Интерфейс для модели данных продуктов

```
export interface IProductList {
  items: IProduct[];
  total: number;
  preview: Id | null;
  setProduct(items: IProduct[]): void;
  addProduct(item: IProduct, payload: Function | null): void;
  deleteProduct(id: Id, payload: Function | null): void;
  updateProduct(item: IProduct, payload: Function | null): void;
  getProduct(id: Id): IProduct;
  checkValidation(): boolean;
}
```

Интерфейс для модели данных корзины

```
export interface IBasketModel {
  items: IProduct[];
  total: number;

  add(product: IProduct, payload: Function | null): void;
  remove(id: Id, payload: Function | null): void;
  clear(payload: Function | null): void;
  getItems(): IProduct[];
}
```

Данные продукта, используемые в форме корзины

```
export type TBasketProduct = Pick<IProduct, 'title' | 'price'>;
```

Данные продукта, используемые в форме списка

```
export type TShortProduct = Pick<IProduct, 'title' | 'price' | 'image'>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.
  
### Базовый код

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
-   
### Слой данных


  
### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий