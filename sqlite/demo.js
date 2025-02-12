// Подключаем модуль sqlite3
const sqlite3 = require('sqlite3').verbose();

// Создаем или открываем базу данных
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});

// Создаем таблицу
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // Вставляем данные
    const stmt = db.prepare(`INSERT INTO users (name, email) VALUES (?, ?)`);
    stmt.run('John Doe', 'john@example.com');
    stmt.run('Jane Doe', 'jane@example.com');
    stmt.finalize();

    // Читаем данные
    db.each(`SELECT id, name, email FROM users`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`${row.id}: ${row.name}, ${row.email}`);
    });
});

// Закрываем базу данных
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});