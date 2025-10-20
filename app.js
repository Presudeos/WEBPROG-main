const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- PERBAIKAN CORS ---
// 'origin: true' akan mengizinkan origin (asal) permintaan secara dinamis.
// Ini jauh lebih baik daripada 'null' untuk development dan testing.
app.use(cors({ origin: true, credentials: true }));
// --------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET, // Pastikan SESSION_SECRET ada di Railway
    resave: false,
    saveUninitialized: true,
    // secure: false aman untuk development (http), 
    // ganti ke true jika sudah di-deploy ke https
    cookie: { secure: false } 
}));

// ******************************************************
// === HEALTH CHECK ENDPOINT ===
// ******************************************************
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Aplikasi backend berjalan dengan baik.',
        timestamp: new Date().toISOString()
    });
});
// ******************************************************

// === Koneksi Database ===
const db = require('./config/db'); 

// === Import routes ===
const eventRoutes = require('./routes/event');
app.use('/api/event', eventRoutes);

const authRoutes = require('./routes/auth');
const jemaatRoutes = require('./routes/jemaat');
const galleryRoutes = require('./routes/gallery');
const kritikRoutes = require('./routes/kritik');

// === Gunakan routes ===
app.use('/api/auth', authRoutes);
app.use('/api/jemaat', jemaatRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/kritik', kritikRoutes);

// ==========================================================
// === PERBAIKAN UNTUK RAILWAY (BUKAN VERCEL) ===
// ==========================================================

// 1. PASTIKAN app.listen() AKTIF
// Railway akan menyediakan 'process.env.PORT' secara otomatis
// 30297 akan digunakan jika process.env.PORT tidak ada (misal, saat running lokal)
const PORT = process.env.PORT || 30297;
app.listen(PORT, () => console.log(`🚀 Server API berjalan di ${PORT}`));


// 2. HAPUS 'module.exports'
// Baris ini (module.exports = app;) telah dihapus karena ini hanya untuk Vercel.
// Railway membutuhkan app.listen() untuk berjalan.

// ==========================================================