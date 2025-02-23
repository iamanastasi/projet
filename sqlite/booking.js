const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/demo2.html'); 
}); 

const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        PropertyID INTEGER NOT NULL,
        StartDate TEXT,
        EndDate TEXT,
        Amount INTEGER,
        NumberPers INTEGER
    )`);
});

app.post('/add-booking', (req, res) => {
    const { UserID, PropertyID, StartDate, EndDate, Amount, NumberPers } = req.body;
    const stmt = db.prepare(`INSERT INTO bookings (UserID, PropertyID, StartDate, EndDate, Amount, NumberPers ) VALUES (?, ?, ?, ?, ?, ?)`);
    
    stmt.run(UserID, PropertyID, StartDate, EndDate, Amount, NumberPers , function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('Booking added successfully!');
    });
    
    stmt.finalize();
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});