const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/demo.html'); 
}); 

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
        telephone TEXT NOT NULL UNIQUE,
        TenantNumber INTEGER
    )`);
});

app.post('/add-tenant', (req, res) => {
    const { secondName, firstName, thirdName, email, telephone, tenantNumber } = req.body;
    const stmt = db.prepare(`INSERT INTO tenants (SecondName, FirstName, ThirdName, email, telephone, TenantNumber) VALUES (?, ?, ?, ?, ?, ?)`);
    
    stmt.run(secondName, firstName, thirdName, email, telephone, tenantNumber, function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('Tenant added successfully!');
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