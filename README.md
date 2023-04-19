### ENG: Backend for tracking New Mail shipments and receiving branches

#### Routes (values for example):
1. https://nova-poshta-backend.onrender.com/api/tracking/59000254320737
2. https://nova-poshta-backend.onrender.com/api/departments/?city=Cherkasy&page=2

### Project based on NestJS with integrated MongoDB.
- All requests are first processed on the local server, after which the application interacts with the server of Nova Poshta to receive branch data and TTN invoices.
- The first request to receive the data of New Post offices stores the data in the MongoDB database and returns it as a server response.
- Data from the database is used for subsequent requests.
- The saving of TTN invoice data in the MongoDB database and their return to the client from the database has also been implemented.
- The React frontend application is connected to the Node backend via REST API to receive data link [frontend](https://github.com/GnatykOleg/nova-poshta-frontend)

### Technologies

- JavaScript
- TypeScript
- NestJS

\*\* Usually in my projects all content and interaction are in English, but this project is made in Ukrainian. simply because I love my country.


### UKR: Бекенд для відстеження відправок Нової пошти та отримання вiддiлень

#### Маршрути (значення для прикладу):
1. https://nova-poshta-backend.onrender.com/api/tracking/59000254320737
2. https://nova-poshta-backend.onrender.com/api/departments/?city=Черкаси&page=2

### Проект на базі NestJS з інтегрованими MongoDB. 
- Усі запити спочатку обробляються на локальному сервері, після чого додаток взаємодіє з сервером Нової Пошти для отримання даних відділень та ТТН-накладних. 
- Перший запит на отримання даних відділень Нової пошти зберігає дані в базу даних MongoDB та повертає їх як відповідь сервера. 
- Для наступних запитів використовуються дані з бази даних.
- Також реалізовано збереження даних ТТН-накладних в базі даних MongoDB та їх повернення клієнту з бази даних. 
- Фронтенд додаток React підключений до Node backend через REST API для отримання даних лiнк [фронтенда](https://github.com/GnatykOleg/nova-poshta-frontend)

### Технології

- JavaScript
- TypeScript
- NestJS

\*\* Зазвичай у моїх проектах весь контент і взаємодія англійською мовою, але цей проект зроблено українською мовою. просто тому, що я люблю свою країну.
