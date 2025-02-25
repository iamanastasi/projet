const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

function getFirstBookingDates(callback) {
    const sql = `
        SELECT StartDate, EndDate
        FROM bookings
        LIMIT 1;`;

    db.get(sql, [], (err, row) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (row) {
            callback(null, row); 
        } else {
            callback(null, null); 
        }
    });
}

app.get('/', (req, res) => {
    getFirstBookingDates((err, row) => {
        if (err) {
            res.status(500).send('Error retrieving booking dates');
            return;
        }
        if (row) {
            const { StartDate, EndDate } = row;
            res.send(`
                <h1>Booking Dates</h1>
                <p>Start Date: ${StartDate}</p>
                <p>End Date: ${EndDate}</p>
            `);
        } else {
            res.send('<h1>No bookings found.</h1>');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});