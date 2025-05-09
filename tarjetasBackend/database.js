const sqlite3 = require('sqlite3').verbose();

// SQLite database connection
const db = new sqlite3.Database('./credit-card.db', (err) => {
    if (err) {
        console.error('Error in the connection with the database:', err.message);
    } else {
        createTables();
        console.log('Successful connection to the SQLite database.');
        
    }
});

// Function to create the tables if they do not exist in the database
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS CreditCard (
        id INTEGER PRIMARY KEY,
        cardType TEXT NOT NULL,
        cardNumber TEXT NOT NULL,
        cvv TEXT NOT NULL,
        balance REAL DEFAULT 0,
        cardholderId TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES User(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        cardholderId TEXT,
        isDisabled INTEGER DEFAULT 0
      )`);
}

module.exports = db;