# Software Requirements Specification untuk <Desa Wisata Panggungharjo>

**Versi 2.0**

## 1. Pendahuluan

### 1.1. Tujuan Penulisan Dokumen
Tujuan dari pengembangan website Desa Wisata Panggungharjo ini adalah untuk membangun sebuah platform informasi digital yang interaktif dan responsif guna memperkenalkan potensi desa, mulai dari kekayaan budaya, destinasi wisata, hingga produk-produk UMKM lokal. Selain itu, sistem kini dilengkapi dengan panel manajemen (Dashboard Admin) yang memungkinkan pengelola desa memperbarui katalog produk dan jadwal kegiatan secara mandiri tanpa harus mengubah kode.

### 1.2. Audien yang Dituju dan Pembaca yang Disarankan
Dokumen SRS ini ditujukan untuk:
*   **Tim Pengembang (Developer):** Sebagai acuan utama dalam mengimplementasikan desain antarmuka, logika *backend* PHP, dan integrasi antarmuka.
*   **Administrator / Pengelola Desa Wisata:** Sebagai panduan fungsionalitas pengelolaan konten web (CRUD produk dan kegiatan).
*   **Pemilik UMKM Lokal:** Sebagai stakeholder untuk memastikan produk mereka ditampilkan dengan baik di dalam katalog digital.

### 1.3. Batasan Produk
Sistem yang dibangun saat ini adalah aplikasi web dinamis berarsitektur ringan dengan batasan meliputi:
*   Sistem *backend* menggunakan PHP murni tanpa memerlukan sistem manajemen basis data relasional (RDBMS) seperti MySQL. Data disimpan dalam bentuk berkas berformat JSON (`data.json`) demi memfasilitasi *hosting* gratis (misal: InfinityFree) tanpa butuh konfigurasi *database*.
*   Transaksi pembayaran produk UMKM tidak dilakukan di dalam website, melainkan diselesaikan secara langsung antara pembeli dan penjual melalui pengalihan ke WhatsApp.
*   Formulir kontak publik saat ini bersifat simulasi (*front-end only*).

### 1.4. Definisi dan Istilah
*   **UMKM:** Usaha Mikro, Kecil, dan Menengah milik warga desa Panggungharjo.
*   **CRUD:** *Create, Read, Update, Delete* – fungsi dasar manipulasi data pada Dashboard Admin.
*   **JSON (JavaScript Object Notation):** Format teks ringan yang digunakan untuk menyimpan dan bertukar data.
*   **WhatsApp Redirect:** Mekanisme pengalihan dari website langsung ke aplikasi WhatsApp penjual/admin dengan pesan yang sudah diformat.
*   **Leaflet.js:** *Library* JavaScript open-source untuk membuat peta interaktif.

---

## 2. Deskripsi Keseluruhan

### 2.1. Deskripsi Produk
Website Desa Wisata Panggungharjo merupakan portal informasi digital yang dirancang untuk mendukung ekosistem wisata dan ekonomi kreatif desa. Website ini berfungsi sebagai brosur digital interaktif, pasar digital sederhana untuk UMKM, pusat informasi kegiatan, serta peta tata ruang wisata desa. Sistem juga memiliki sisi panel *back-office* untuk pengelola desa.

### 2.2. Fungsi Produk
**Bagi Pengunjung (Wisatawan/Pembeli):**
1.  Melihat profil dan keunggulan Desa Panggungharjo.
2.  Menjelajahi katalog produk UMKM berdasarkan kategori (Kerajinan, Makanan, Pertanian, Tekstil).
3.  Melihat detail produk dan menghubungi penjual UMKM via WhatsApp.
4.  Melihat jadwal kegiatan/festival desa (Timeline).
5.  Mengeksplorasi lokasi penting (UMKM, Wisata, Kantor) menggunakan peta interaktif.

**Bagi Administrator:**
1. Melakukan Autentikasi (Login/Logout).
2. Menambah, mengubah (edit), dan menghapus daftar produk UMKM.
3. Menambah dan menghapus daftar kegiatan desa.

### 2.3. Penggolongan Karakteristik Pengguna
| Kategori Pengguna | Tugas | Hak Akses | Kemampuan |
| :--- | :--- | :--- | :--- |
| **Pengunjung / Wisatawan** | Membaca informasi, memfilter produk, menggunakan peta interaktif, dan menekan tombol WhatsApp. | Akses Publik (Read-Only) | Mampu mengoperasikan peramban web (*browser*) dan aplikasi WhatsApp. |
| **Administrator** | Mengelola katalog produk dan data kegiatan web. | Terbatas (Dilindungi Sandi) | Mampu mengisi form digital sederhana. |

### 2.4. Lingkungan Operasi
Sistem dapat diakses melalui berbagai perangkat keras (komputer, laptop, tablet, dan *smartphone*) menggunakan peramban web modern. *Backend* membutuhkan web server yang mendukung eksekusi skrip **PHP** (Apache/Nginx) dengan izin baca-tulis (*read-write permissions*) pada folder tempat *file* `data.json` berada.

---

## 3. Kebutuhan Antarmuka Eksternal

### 3.1. User Interfaces
Desain antarmuka dirancang responsif dan dibagi menjadi dua bagian (Halaman Publik dan Halaman Admin):
**Halaman Publik:**
1.  **Halaman Beranda (Hero):** Menampilkan judul utama, statistik desa, dan *Call to Action* (CTA).
2.  **Katalog UMKM:** Menampilkan *grid* produk dinamis yang ditarik dari API, beserta tombol filter.
3.  **Modal Detail Produk:** Tampilan *pop-up* yang berisi foto, spesifikasi ketersediaan stok, dan tombol "Hubungi Penjual".
4.  **Kegiatan (Timeline):** Menampilkan daftar program/acara mendatang dengan format kronologis visual dari API.
5.  **Peta Interaktif:** Antarmuka peta dengan panel *toggle* (saklar) spesifik.

**Halaman Admin:**
1. **Halaman Login (`admin.html`):** Form keamanan untuk masuk ke dashboard.
2. **Halaman Dashboard (`dashboard.html`):** Tabel interaktif untuk memonitor data, beserta form untuk input dan edit data Produk serta Kegiatan.

### 3.2. Software Interface
*   **PHP:** Bertindak sebagai *server-side scripting* yang memproses setiap *request* API dari antarmuka web dan memanipulasi *file* JSON.
*   **Leaflet & OpenStreetMap:** Terintegrasi untuk merender peta interaktif geospasial.

### 3.3. Communication Interface
Sistem menggunakan komunikasi HTTP/HTTPS di mana antarmuka pengguna memanggil *Application Programming Interface* (API) internal yang di-*host* pada berkas `api.php` menggunakan metode HTTP GET, POST, dan DELETE dengan format pertukaran data JSON.

---

## 4. Functional Requirement

| ID | Kebutuhan Fungsional | Penjelasan |
| :--- | :--- | :--- |
| **FR-01** | Navigasi & Tampilan Profil | Sistem menampilkan informasi umum dan keunggulan desa di bagian beranda. |
| **FR-02** | Manajemen Produk UMKM (CRUD) | Administrator dapat menambah produk baru, mengubah data produk (edit), dan menghapus produk via Dashboard. Data ini akan ditampilkan pada beranda publik secara dinamis. |
| **FR-03** | Filter Kategori UMKM | Sistem memungkinkan pengunjung memilah tampilan produk UMKM publik berdasarkan kategori. |
| **FR-04** | Lihat Detail Produk (Modal) | Sistem harus menampilkan detail produk dalam bentuk *modal pop-up*. |
| **FR-05** | Redirect WhatsApp | Sistem menyediakan tombol "Hubungi Penjual" yang akan mengarahkan pengguna ke nomor WhatsApp penjual. |
| **FR-06** | Manajemen Kegiatan (CRUD) | Administrator dapat menambah kegiatan baru dan menghapusnya via Dashboard. Kegiatan ditampilkan dalam bentuk *timeline*. |
| **FR-07** | Peta Interaktif Geospasial | Sistem menampilkan peta yang dapat difilter lapisan lokasinya (Layer UMKM, Wisata, Kantor). |
| **FR-08** | Autentikasi Admin | Sistem harus memvalidasi kombinasi nama pengguna dan kata sandi sebelum memberikan akses ke Dashboard. |

---

## 5. Non-Functional Requirements

| ID | Parameter | Kebutuhan |
| :--- | :--- | :--- |
| **NFR-01** | *Ergonomy (Responsiveness)* | Tata letak (layout) website harus responsif dan menyesuaikan secara rapi di berbagai ukuran layar (mobile, tablet, desktop). |
| **NFR-02** | *Portability* | Sistem berjalan sempurna pada peramban web modern dan *environment* server PHP minimal. |
| **NFR-03** | *Performance / Speed* | Peralihan filter produk UMKM dan eksekusi antarmuka tidak boleh terkunci atau macet saat melakukan *request* asinkron ke server. |
| **NFR-04** | *Usability* | Peta interaktif harus mudah digunakan (*user-friendly*), dan form input admin harus memberikan indikator keberhasilan (*success message*). |
| **NFR-05** | *Simplicity (Deployment)* | Sistem tidak boleh membutuhkan instalasi sistem basis data SQL, agar mudah diunggah langsung (*drag and drop*) pada platform *hosting* gratis. |
