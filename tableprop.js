const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/tableprop.html'); 
}); 

const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQlite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS prices (
        Property NUMBER NOT NULL,
        Class TEXT NOT NULL,
        StartPeriod TEXT,
        EndPeriod TEXT,
        Date TEXT,
        dayType TEXT,
        MonthInType TEXT,
        PricePerDay NUMBER
    )`);
});

app.post('/add-price', (req, res) => {
    const { Property, Class, StartPeriod, EndPeriod, Date, dayType, MonthInType, PricePerDay } = req.body;
    const stmt = db.prepare(`INSERT INTO prices (Property, Class, StartPeriod, EndPeriod, Date, dayType, MonthInType, PricePerDay) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(Property, Class, StartPeriod, EndPeriod, Date, dayType, MonthInType, PricePerDay, function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('Price added successfully!');
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