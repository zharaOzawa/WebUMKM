const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Buat tabel Admin
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (!err) {
                // Seeder default admin: admin / admin123
                bcrypt.hash('admin123', 10, (err, hash) => {
                    db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', ?)`, [hash]);
                });
            }
        });

        // Buat tabel Produk
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            price TEXT,
            seller TEXT,
            sellerImg TEXT,
            rating TEXT,
            reviews TEXT,
            stock TEXT,
            desc TEXT,
            material TEXT,
            size TEXT,
            weight TEXT,
            image TEXT,
            whatsapp TEXT
        )`);

        // Buat tabel Kegiatan (Timeline)
        db.run(`CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            title TEXT,
            description TEXT,
            date TEXT,
            image TEXT
        )`);
        
        // Kita juga bisa tambahkan fungsi seeder di sini jika perlu
    }
});

module.exports = db;
