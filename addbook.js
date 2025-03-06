const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//bookings

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

app.post('/add-book', (req, res) => {
    const { UserID, PropertyID, StartDate, EndDate, Amount, NumberPers } = req.body;
    
    const stmt = db.prepare(`INSERT INTO bookings (UserID, PropertyID, StartDate, EndDate, Amount, NumberPers) VALUES (?, ?, ?, ?, ?, ?)`);
    
    stmt.run(UserID, PropertyID, StartDate, EndDate, Amount, NumberPers, function(err) {
        if (err) {
            return res.status(400).json({error: err.message});
        }
    });
    
    stmt.finalize();
});

//tenants

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

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
