const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Подключаем middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Для статических файлов (HTML, CSS)


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/demo.html'); // Убедитесь, что ваш HTML-файл называется index.html
}); 

// Создаем или открываем базу данных
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});

// Создаем таблицу, если она не существует
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tenants (
        TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
        SecondName TEXT NOT NULL,
        FirstName TEXT NOT NULL,
        ThirdName TEXT,
        email TEXT NOT NULL UNIQUE,
        telephone TEXT NOT NULL UNIQUE,
        TenantNumber INTEGER
    )`);
});

// Обработка POST-запроса для добавления арендатора
app.post('/add-tenant', (req, res) => {
    const { secondName, firstName, thirdName, email, telephone, tenantNumber } = req.body;
    const stmt = db.prepare(`INSERT INTO tenants (SecondName, FirstName, ThirdName, email, telephone, TenantNumber) VALUES (?, ?, ?, ?, ?, ?)`);
    
    stmt.run(secondName, firstName, thirdName, email, telephone, tenantNumber, function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('Tenant added successfully!');
    });
    
    stmt.finalize();
});

// Закрываем базу данных при завершении работы сервера
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});