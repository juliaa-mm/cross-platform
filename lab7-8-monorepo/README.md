# Bloomé - кросплатформний застосунок квіткового магазину

Монорепозиторій зі спільним ядром `@bloome/core`, веб-клієнтом і десктопним клієнтом на Electron.
Проєкт створено протягом семестру з дисципліни «Крос-платформне програмування» (лабораторні роботи №1-8).

## Запуск

```
npm install
npm test
npm run start:web
npm run start:desktop
```

Веб-клієнт відкривається за адресою http://localhost:3000.

## Технологічний стек і компетентності

### Стек технологій

| Рівень | Технології | Лабораторна | Де в репозиторії |
|---|---|---|---|
| 1. Платформи | Браузер / WebView, Android та iOS (Expo Go), Windows, macOS, Linux | №1.1, №1.2, №5, №6 | [lab1.2-web](../lab1.2-web), [lab5-react-native](../lab5-react-native), [lab6-electron](../lab6-electron) |
| 2. Клієнтські технології | HTML, CSS, JavaScript; React + Vite + Tailwind CSS; React Native + Expo; Electron | №1.2, №4, №5, №6 | [packages/web](packages/web), [lab4-react-spa](../lab4-react-spa), [lab5-react-native](../lab5-react-native), [packages/desktop](packages/desktop) |
| 3. Спільний код | `@bloome/core`, адаптери LocalStorage / File / Memory, npm workspaces, node --test | №7-8 | [packages/core](packages/core) |
| 4. Сервер і API | Node.js + Express (REST); Apollo Server + JWT + bcryptjs (GraphQL) | №2, №3 | [lab2-rest-api](../lab2-rest-api), [lab3-graphql-api](../lab3-graphql-api) |
| 5. База даних | MongoDB Atlas + Mongoose; localStorage; файл orders.json | №2, №4, №6, №7-8 | [lab2-rest-api/models](../lab2-rest-api/models), [packages/web](packages/web), [packages/desktop](packages/desktop) |

### Сильні моменти проєкту

- **Одне ядро для двох клієнтів.** Веб і десктоп імпортують `@bloome/core` і не мають власної логіки перевірки.
- **47 автотестів.** Команда `npm test` запускає тести ядра, веб-клієнта й десктопного клієнта.
- **Безпечний Electron.** `contextIsolation: true`, `nodeIntegration: false`, Content-Security-Policy, сторінці доступний лише `window.ordersAPI`.
- **Два варіанти API.** REST з CRUD для товарів і MongoDB Atlas, GraphQL з реєстрацією, входом і JWT.

### Що я знаю та вмію

- порівнювати підходи до кросплатформної розробки й обирати стек;
- верстати адаптивні сторінки та створювати SPA на React з Tailwind CSS;
- робити мобільний застосунок на React Native з Expo;
- створювати десктопний застосунок на Electron з безпечним IPC;
- будувати REST API на Express з MongoDB і GraphQL API з JWT;
- виділяти спільне ядро й платформні адаптери в монорепозиторії;
- писати автотести на `node --test`;
- вести проєкт у Git і GitHub.

## Історія проєкту

| | |
|---|---|
| **Назва проєкту** | Bloomé - кросплатформний застосунок квіткового магазину |
| **Проблема** | У невеликих квіткових магазинах замовлення часто приймають по телефону чи в месенджерах і записують вручну, тому плутаються дати, отримувачі й побажання. Bloomé дає покупцеві каталог і форму замовлення з датою доставки, отримувачем і листівкою, а працівникам один список замовлень з пошуком і позначкою «Доставлено». |
| **Моя роль і внесок** | Проєкт я робила сама: аналіз і макети, усі клієнти, REST і GraphQL API, спільне ядро, адаптери, тести й документація. |
| **Обраний стек** | JavaScript на всіх рівнях, тому одне ядро працює в браузері, Electron і тестах Node.js. HTML/CSS/JS дав простий старт за WebView-підходом. React з Tailwind зручний для компонентного інтерфейсу. React Native з Expo дав нативний мобільний інтерфейс без Android Studio. Electron переніс вебінтерфейс на десктоп із доступом до файлів. Express обрано для простого REST, GraphQL для гнучких запитів з авторизацією. MongoDB Atlas зберігає документи, схожі на об'єкти JS. Монорепозиторій з npm workspaces робить зміну ядра одразу доступною всім клієнтам. |
| **Найскладніший виклик і рішення** | Змусити одне ядро працювати в браузері, Electron і тестах. Платформи по-різному зберігають дані й завантажують модулі. Рішення: ядро на ES-модулях без звернень до платформи, адаптери з методами `load()` і `save()`, які передаються в `OrdersService` через конструктор, import map у браузері та `preload.cjs` в Electron. Зміна `MAX_CARD_LENGTH` у ядрі одразу змінила обидва клієнти. |
| **Здобуті знання та вміння** | Повний цикл кросплатформного застосунку: від вибору стеку й інтерфейсу на трьох типах платформ до серверного API, бази даних, спільного ядра, тестів і портфоліо на GitHub. |

## Посилання

GitHub: https://github.com/juliaa-mm/cross-platform