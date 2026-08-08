const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'rahasia_desa_wisata_123'; // Dalam produksi sebaiknya gunakan env

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === MIDDLEWARE AUTENTIKASI ===
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Tidak ada akses' });
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Sesi tidak valid' });
        req.adminId = decoded.id;
        next();
    });
};

// === API PUBLIC ===
// Get semua produk
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get semua kegiatan
app.get('/api/activities', (req, res) => {
    db.all('SELECT * FROM activities ORDER BY date DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// === API AUTHENTICATION ===
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!row) return res.status(401).json({ error: 'Username atau password salah' });
        
        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: row.id, username: row.username }, SECRET_KEY, { expiresIn: '1d' });
                res.cookie('admin_token', token, { httpOnly: true, secure: false }); // secure: true di produksi (HTTPS)
                res.json({ message: 'Login sukses' });
            } else {
                res.status(401).json({ error: 'Username atau password salah' });
            }
        });
    });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ message: 'Logout sukses' });
});

// === API ADMIN (CRUD Produk) ===
app.post('/api/admin/products', verifyAdmin, (req, res) => {
    const { name, category, price, seller, sellerImg, stock, desc, material, size, weight, image, whatsapp } = req.body;
    const rating = '5.0'; // Default
    const reviews = '0'; // Default
    const sql = `INSERT INTO products (name, category, price, seller, sellerImg, rating, reviews, stock, desc, material, size, weight, image, whatsapp) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, category, price, seller, sellerImg, rating, reviews, stock, desc, material, size, weight, image, whatsapp];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produk berhasil ditambahkan', id: this.lastID });
    });
});

app.delete('/api/admin/products/:id', verifyAdmin, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produk berhasil dihapus' });
    });
});

// === API ADMIN (CRUD Kegiatan) ===
app.post('/api/admin/activities', verifyAdmin, (req, res) => {
    const { category, title, description, date, image } = req.body;
    const sql = `INSERT INTO activities (category, title, description, date, image) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [category, title, description, date, image], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Kegiatan berhasil ditambahkan', id: this.lastID });
    });
});

app.delete('/api/admin/activities/:id', verifyAdmin, (req, res) => {
    db.run('DELETE FROM activities WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Kegiatan berhasil dihapus' });
    });
});

// Melayani file statis frontend di public
app.use(express.static(path.join(__dirname, 'public')));

// Fallback 404
app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
