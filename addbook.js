const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors()); // Разрешаем запросы с любого источника
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Добавляем поддержку JSON
app.use(express.static('public'));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Добавляем поддержку JSON
app.use(express.static('public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/clientbook.html');
});

// Подключение к базе данных
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});

// Создание таблицы bookings (если она еще не существует)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        PropertyID INTEGER NOT NULL,
        StartDate TEXT,
        EndDate TEXT,
        Amount INTEGER,
        NumberPers INTEGER
    )`);
});

// Маршрут для добавления бронирования
app.post('/add-booking', (req, res) => {
    const { UserID, PropertyID, StartDate, EndDate, Amount, NumberPers } = req.body;

    if (!UserID || !PropertyID || !StartDate || !EndDate || !Amount || !NumberPers) {
        return res.status(400).send('Все поля обязательны для заполнения.');
    }

    const stmt = db.prepare(`INSERT INTO bookings (UserID, PropertyID, StartDate, EndDate, Amount, NumberPers) VALUES (?, ?, ?, ?, ?, ?)`);
    
    stmt.run(UserID, PropertyID, StartDate, EndDate, Amount, NumberPers, function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('Бронирование успешно добавлено!');
    });
    
    stmt.finalize();
});

// Обработка завершения работы сервера
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Закрыто соединение с базой данных.');
        process.exit(0);
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});
