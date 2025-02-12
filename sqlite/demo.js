// Подключаем модуль sqlite3
const sqlite3 = require('sqlite3').verbose();

// Создаем или открываем базу данных
const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tenants (
        TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
        SecondName TEXT NOT NULL,
        FirstName TEXT NOT NULL,
        ThirdName TEXT,
        email TEXT NOT NULL UNIQUE,
        telephone TEXT NOT NULL,
        TenantNumber INTEGER

    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // Вставляем данные
    const stmt = db.prepare(`INSERT INTO tenants (SecondName, FirstName, ThirdName, email, telephone, TenantNumber) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run('Scufsky', 'Milf', 'Hunter', 'lol@example.com', '7952812', 1);
    stmt.run('Ikari', 'Shinji', 'AAAAAA', 'kek@example.com', '79528126969', 52);
    stmt.finalize();

    // Читаем данные
    db.each(`SELECT TenantID, SecondName, FirstName, ThirdName, email, telephone, TenantNumber FROM tenants`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`${row.TenantID}: ${row.SecondName}, ${row.FirstName}, ${row.ThirdName}, ${row.email}, ${row.telephone}, ${row.TenantNumber}`);
    });
});

// Закрываем базу данных
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});