const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

    const sql = `
        SELECT 
            BookingID,
            UserID,
            PropertyID,
            StartDate,
            EndDate,
            Amount,
            NumberPers
        FROM 
            bookings;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(`BookingID: ${row.BookingID}, Start: ${row.StartDate}, End: ${row.EndDate} `);
        });
    });

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});