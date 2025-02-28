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
   WHERE StartDate BETWEEN DATE('now') AND DATE('now', '+30 days')
OR EndDate BETWEEN DATE('now') AND DATE('now', '+30 days')
OR (StartDate < DATE('now') AND EndDate > DATE('now', '+30 days'));`;

    db.all(sql, [], (err, rows) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (rows.length === 0) { 
                res.status(200).json([]); 
                return;
            }
            res.json(rows);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});