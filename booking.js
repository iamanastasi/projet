const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

app.get('/api/mydatabase', (req, res) => {
    const sql = `SELECT 
    BookingID,
    UserID, 
    PropertyID, 
    StartDate, 
    EndDate, 
    Amount, 
    NumberPers
    FROM bookings 
    LIMIT 1;`;
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});