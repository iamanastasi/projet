const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tenants (
        TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
        SecondName TEXT NOT NULL,
        FirstName TEXT NOT NULL,
        ThirdName TEXT,
        email TEXT NOT NULL UNIQUE,
        telephone TEXT NOT NULL UNIQUE,
        TenantNumber INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "tenants" is ready.');
        }
    });
});

app.post('/find-user', (req, res) => {
    const { secondName, firstName, thirdName } = req.body;

    if (!secondName || !firstName) {
        return res.status(400).json({ error: 'SecondName and FirstName are required.' });
    }

    const query = `
        SELECT TenantID FROM tenants
        WHERE SecondName = ? AND FirstName = ? AND ThirdName = ?
    `;

    db.get(query, [secondName, firstName, thirdName || null], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            res.json({ userId: row.TenantID });
        } else {
            res.json({ userId: null });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});