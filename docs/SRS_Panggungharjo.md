# Software Requirements Specification untuk <Desa Wisata Panggungharjo>

**Versi 1.0**

## 1. Pendahuluan

### 1.1. Tujuan Penulisan Dokumen
Tujuan dari pengembangan website Desa Wisata Panggungharjo ini adalah untuk membangun sebuah platform informasi (landing page) digital yang interaktif dan responsif guna memperkenalkan potensi desa, mulai dari kekayaan budaya, destinasi wisata, hingga produk-produk UMKM lokal. Sistem ini bertujuan memfasilitasi pemasaran produk UMKM secara langsung ke pembeli melalui integrasi WhatsApp, tanpa memerlukan payment gateway internal, serta menyediakan informasi geospasial melalui peta interaktif desa.

### 1.2. Audien yang Dituju dan Pembaca yang Disarankan
Dokumen SRS ini ditujukan untuk:
*   **Tim Pengembang (Developer):** Sebagai acuan utama dalam mengimplementasikan desain antarmuka, logika filter produk, integrasi peta Leaflet, dan fitur WhatsApp Redirect.
*   **Manajer Proyek / Pengelola Desa Wisata:** Untuk memantau kesesuaian hasil akhir website dengan visi promosi desa.
*   **Pemilik UMKM Lokal:** Sebagai stakeholder untuk memastikan produk mereka ditampilkan dengan baik di dalam katalog digital.

### 1.3. Batasan Produk
Sistem yang dibangun saat ini adalah **Landing Page berbasis statis (HTML, CSS, Vanilla JavaScript)**. Batasannya meliputi:
*   Tidak ada sistem *backend* atau *database* dinamis pada tahap ini; data produk dan informasi desa di-*hardcode* di dalam berkas HTML/JS.
*   Transaksi pembayaran produk UMKM tidak dilakukan di dalam website, melainkan diselesaikan secara langsung antara pembeli dan penjual melalui WhatsApp.
*   Formulir kontak saat ini bersifat simulasi (*front-end only*) dan tidak mengirimkan email ke server sungguhan.

### 1.4. Definisi dan Istilah
*   **UMKM:** Usaha Mikro, Kecil, dan Menengah milik warga desa Panggungharjo.
*   **WhatsApp Redirect:** Mekanisme pengalihan dari website langsung ke aplikasi WhatsApp penjual/admin dengan pesan yang sudah diformat.
*   **Leaflet.js:** *Library* JavaScript open-source untuk membuat peta interaktif.
*   **Modal:** Kotak dialog pop-up yang muncul di atas halaman utama untuk menampilkan detail produk tanpa berpindah halaman.

---

## 2. Deskripsi Keseluruhan

### 2.1. Deskripsi Produk
Website Desa Wisata Panggungharjo merupakan portal informasi digital yang dirancang untuk mendukung ekosistem wisata dan ekonomi kreatif desa. Website ini berfungsi sebagai brosur digital interaktif, pasar digital sederhana untuk UMKM, serta pusat informasi kegiatan dan peta tata ruang wisata desa.

### 2.2. Fungsi Produk
Bagi pengunjung (wisatawan/pembeli), fungsi utamanya adalah:
1.  Melihat profil dan keunggulan Desa Panggungharjo.
2.  Menjelajahi katalog produk UMKM berdasarkan kategori (Kerajinan, Makanan, Pertanian, Tekstil).
3.  Melihat detail produk dan menghubungi penjual UMKM via WhatsApp.
4.  Melihat jadwal kegiatan/festival desa (Timeline).
5.  Mengeksplorasi lokasi penting (UMKM, Wisata, Kantor) menggunakan peta interaktif.

### 2.3. Penggolongan Karakteristik Pengguna
| Kategori Pengguna | Tugas | Hak Akses | Kemampuan |
| :--- | :--- | :--- | :--- |
| **Pengunjung / Wisatawan** | Membaca informasi, memfilter produk, menggunakan peta interaktif, dan menekan tombol WhatsApp. | Akses Publik (Read-Only) | Mampu mengoperasikan peramban web (*browser*) dan aplikasi WhatsApp. |

### 2.4. Lingkungan Operasi
Sistem berbasis web (*client-side*) yang dapat diakses melalui berbagai perangkat keras (komputer, laptop, tablet, dan *smartphone*) menggunakan peramban web modern (Google Chrome, Safari, Mozilla Firefox, Edge).

---

## 3. Kebutuhan Antarmuka Eksternal

### 3.1. User Interfaces
Desain antarmuka dirancang responsif dan dibagi dalam beberapa *section* pada satu halaman utama (*Single Page* style):
1.  **Halaman Beranda (Hero):** Menampilkan judul utama, statistik desa, dan *Call to Action* (CTA).
2.  **Katalog UMKM:** Menampilkan *grid* produk dengan tombol filter (Semua, Kerajinan, Makanan, Pertanian, Tekstil).
3.  **Modal Detail Produk:** Tampilan *pop-up* yang berisi foto besar, spesifikasi (bahan, ukuran, berat), ketersediaan stok, ulasan, dan tombol "Hubungi Penjual".
4.  **Kegiatan (Timeline):** Menampilkan daftar program/acara mendatang dengan format kronologis visual.
5.  **Peta Interaktif:** Antarmuka peta dengan panel *toggle* (saklar) untuk menampilkan/menyembunyikan *layer* spesifik (UMKM, Wisata, Kantor).
6.  **Kontak & Footer:** Formulir pengiriman pesan dan informasi kontak resmi desa.

### 3.2. Software Interface
*   **Leaflet & OpenStreetMap:** Terintegrasi untuk merender peta interaktif tanpa memerlukan kunci API berbayar.
*   **WhatsApp API (wa.me):** Menggunakan protokol URI `https://wa.me/` untuk fitur pengalihan komunikasi dari web ke aplikasi WhatsApp.

### 3.3. Communication Interface
Berjalan di atas protokol jaringan standar HTTP/HTTPS saat di-*hosting*. Tidak memerlukan koneksi basis data (*database*) untuk versi awal ini.

---

## 4. Functional Requirement

| ID | Kebutuhan Fungsional | Penjelasan |
| :--- | :--- | :--- |
| **FR-01** | Navigasi & Tampilan Profil | Sistem harus menampilkan informasi umum, keunggulan desa, dan statistik desa di bagian beranda. |
| **FR-02** | Filter Kategori UMKM | Sistem memungkinkan pengunjung memilah tampilan produk UMKM berdasarkan kategori (Kerajinan, Makanan, Pertanian, Tekstil) secara instan. |
| **FR-03** | Lihat Detail Produk (Modal) | Sistem harus menampilkan detail produk dalam bentuk *modal pop-up* saat pengguna menekan tombol "Lihat Detail" pada kartu produk. |
| **FR-04** | Redirect WhatsApp | Sistem menyediakan tombol "Hubungi Penjual" di dalam modal produk yang akan mengarahkan pengguna ke nomor WhatsApp penjual terkait. |
| **FR-05** | Timeline Kegiatan | Sistem harus menampilkan jadwal festival, pelatihan, atau pasar desa secara berurutan (*timeline*). |
| **FR-06** | Peta Interaktif Geospasial | Sistem menampilkan peta yang dapat di-*zoom*, digeser, dan difilter lapisan lokasinya (Layer UMKM, Wisata, Kantor) melalui tombol *toggle*. |
| **FR-07** | Simulasi Form Kontak | Sistem menyediakan formulir untuk menampung pesan pengunjung (saat ini menampilkan notifikasi sukses statis). |

---

## 5. Non-Functional Requirements

| ID | Parameter | Kebutuhan |
| :--- | :--- | :--- |
| **NFR-01** | *Ergonomy (Responsiveness)* | Tata letak (layout) website harus responsif dan menyesuaikan secara rapi di berbagai ukuran layar (mobile, tablet, desktop) tanpa *layout break*. |
| **NFR-02** | *Portability* | Sistem berjalan sempurna pada peramban web modern (Chrome, Safari, Firefox). |
| **NFR-03** | *Performance / Speed* | Peralihan filter produk UMKM dan pembukaan modal produk harus dieksekusi kurang dari 1 detik di sisi klien (*client-side rendering*). |
| **NFR-04** | *Usability* | Peta interaktif harus mudah digunakan (*user-friendly*), memiliki tombol navigasi (*zoom in/out*), dan fungsi pengembalian titik tengah (*center*) otomatis. |
| **NFR-05** | *Bahasa & Komunikasi* | Keseluruhan teks antarmuka wajib menggunakan Bahasa Indonesia yang komunikatif, menarik untuk promosi wisata, dan mudah dipahami. |
