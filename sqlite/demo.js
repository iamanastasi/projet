// Подключаем модуль sqlite3
const sqlite3 = require('sqlite3').verbose();

// Создаем или открываем базу данных
const db = new sqlite3.Database('PMSdemo.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the PMSdemo.db SQlite database.');
});

// Создаем таблицу
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
        SecondName TEXT NOT NULL,
        FirstName TEXT NOT NULL,
        ThirdName TEXT,
        email TEXT NOT NULL UNIQUE,
        telephone TEXT NOT NULL UNIQUE,
        TenantNumber INTEGER

    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // Вставляем данные
    const stmt = db.prepare(`INSERT INTO tenants ( SecondName, FirstName, ThirdName, email, telephone, TenantNumber VALUES (?, ?)`);
    stmt.run('Scufsky', 'Milf', 'Hunter', 'lol@example.com', '7952812', 1);
    stmt.run('Ikari', 'Shinji', 'AAAAAA', 'kek@example.com', '7952812', 52);
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