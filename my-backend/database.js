const sqlite3 = require('sqlite3').verbose();

// SQLite database connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error in the connection with the database:', err.message);
    } else {
        console.log('Successful connection to the SQLite database.');
        db.run('PRAGMA foreign_keys = ON'); // Habilitar claves foráneas
        createTables();
    }
});

// Function to create the tables if they do not exist in the database
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        realName TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        balance REAL DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error('Error creando la tabla User:', err.message);
        } else {
            console.log('Tabla User creada correctamente.');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS UserTransaction (
        id INTEGER PRIMARY KEY,
        userId INTEGER NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id)
    )`, (err) => {
        if (err) {
            console.error('Error creando la tabla UserTransaction:', err.message);
        } else {
            console.log('Tabla UserTransaction creada correctamente.');
        }
    });
}

module.exports = db;