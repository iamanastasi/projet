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
    const { secondName, firstName, thirdName, email, telephone } = req.body;

    if (!secondName || !firstName) {
        return res.status(400).json({ error: 'SecondName and FirstName are required.' });
    }

    const query = `
        SELECT TenantID FROM tenants
        WHERE SecondName = ? AND FirstName = ? AND (ThirdName = ? OR (ThirdName IS NULL AND ? IS NULL))
    `;

    db.get(query, [secondName, firstName, thirdName, thirdName], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            return res.json({ userId: row.TenantID });
        } else {
            const insertStmt = db.prepare(`INSERT INTO tenants (SecondName, FirstName, ThirdName, email, telephone) VALUES (?, ?, ?, ?, ?)`);
            insertStmt.run(secondName, firstName, thirdName, email, telephone, function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.json({ userId: this.lastID });
            });
            insertStmt.finalize();
        }
    });
});


//prices

app.get('/api/calculate', async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;
        const prices = await getPrices(propertyId);
        const result = calculatePrice(startDate, endDate, prices);
        
        res.json({
            success: true,
            total: result.total,
            details: result.details,
            currency: 'RUB'
        });
        
    } catch (error) {
        console.error('Ошибка расчета:', error);
        res.status(500).json({ error: 'Ошибка сервера при расчете стоимости' });
    }
});

async function getPrices(propertyId) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM prices WHERE Property = ? ORDER BY 
            CASE Class 
                WHEN '2' THEN 1
                WHEN '1' THEN 2
                WHEN '3' THEN 3
            END`,
            [propertyId],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

function calculatePrice(startDate, endDate, prices) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let total = 0;
    const details = [];
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const dayPrice = getPriceForDate(date, prices);
        
        details.push({
            date: dateStr,
            price: dayPrice,
            dayType: getDayType(date)
        });
        
        total += dayPrice;
    }
    
    return { total, details };
}

function getPriceForDate(date, prices) {
    const dateStr = date.toISOString().split('T')[0];
    const month = date.getMonth() + 1;
    const dayType = getDayType(date);
    
   
    const singlePrice = prices.find(p => p.Class === '2' && p.single_date === dateStr);
    if (singlePrice) return singlePrice.PricePerDay;
    
  
    const periodPrice = prices.find(p => 
        p.period_type === '1' && 
        p.start_date <= dateStr && 
        p.end_date >= dateStr
    );
    if (periodPrice) return periodPrice.PricePerDay;
    
  
    const weekdayPrice = prices.find(p => 
        p.period_type === '3' && 
        p.day_type === dayType && 
        p.month === month
    );
    if (weekdayPrice) return weekdayPrice.PricePerDay;
    
   
    return 0;
}

function getDayType(date) {
    return date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : 'weekday';
}

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
