const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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


app.get('/bookings-by-month', (req, res) => {
    const { month, PropertyID } = req.query; 

    if (!month || !PropertyID) {
        return res.status(400).send('Month and PropertyID are required.');
    }

    const query = `
        SELECT * FROM bookings
        WHERE PropertyID = ?
        AND (strftime('%m', StartDate) = ? OR strftime('%m', EndDate) = ?)
    `;

    db.all(query, [PropertyID, month.padStart(2, '0'), month.padStart(2, '0')], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});