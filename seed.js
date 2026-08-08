const db = require('./database');

const products = [
    {
        name: "Anyaman Bambu Premium", category: "Kerajinan", price: "Rp 85.000",
        seller: "Ibu Sari", sellerImg: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80",
        rating: "4.7", reviews: "86", stock: "tersedia",
        desc: "Keranjang anyaman tangan dengan teknik tradisional, tahan lama dan estetis.",
        material: "Bambu alami", size: "30 x 25 x 20 cm", weight: "450 gram",
        image: "assets/images/anyaman.jpg", whatsapp: "https://wa.me/6281234567890"
    },
    {
        name: "Sayur Organik Segar", category: "Pertanian", price: "Rp 15.000/kg",
        seller: "Pak Budi", sellerImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        rating: "4.5", reviews: "52", stock: "tersedia",
        desc: "Dipanen langsung dari kebun organik bersertifikat, tanpa pestisida kimia.",
        material: "Sayuran segar organik", size: "Per kg", weight: "1 kg",
        image: "assets/images/sayur.jpg", whatsapp: "https://wa.me/6281234567890"
    },
    {
        name: "Madu Hutan & Gula Aren", category: "Makanan", price: "Rp 45.000",
        seller: "Pak Hendra", sellerImg: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
        rating: "4.8", reviews: "140", stock: "tersedia",
        desc: "Produk alami liar dari hutan desa, dipanen secara berkelanjutan oleh komunitas petani.",
        material: "Madu murni & gula aren", size: "250 ml", weight: "300 gram",
        image: "assets/images/madu.jpg", whatsapp: "https://wa.me/6281234567890"
    },
    {
        name: "Keripik Tempe Bumbu Desa", category: "Makanan", price: "Rp 25.000",
        seller: "Ibu Dewi", sellerImg: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80",
        rating: "4.5", reviews: "128", stock: "hampir-habis",
        desc: "Dibuat dari kedelai pilihan lokal, digoreng dengan minyak kelapa murni. Renyah dan gurih alami.",
        material: "Kedelai & bumbu rempah", size: "200 gram/pack", weight: "200 gram",
        image: "assets/images/tempe.jpg", whatsapp: "https://wa.me/6281234567890"
    },
    {
        name: "Batik Tulis Motif Alam", category: "Tekstil", price: "Rp 350.000",
        seller: "Ibu Ratna", sellerImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
        rating: "4.9", reviews: "37", stock: "tersedia",
        desc: "Batik tulis premium dengan motif flora dan fauna khas desa, dikerjakan 3–4 minggu per lembar.",
        material: "Kain katun primis", size: "200 x 110 cm", weight: "350 gram",
        image: "assets/images/batik.jpg", whatsapp: "https://wa.me/6281234567890"
    },
    {
        name: "Ukiran Kayu Jati", category: "Kerajinan", price: "Rp 220.000",
        seller: "Pak Joko", sellerImg: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=100&q=80",
        rating: "4.6", reviews: "45", stock: "tersedia",
        desc: "Ukiran tangan dari kayu jati pilihan dengan motif flora nusantara, cocok untuk dekorasi rumah.",
        material: "Kayu jati pilihan", size: "40 x 20 x 15 cm", weight: "1.2 kg",
        image: "assets/images/kayu.jpg", whatsapp: "https://wa.me/6281234567890"
    }
];

const activities = [
    {
        title: "Festival Panen Raya", category: "Budaya", date: "15 Oktober 2024",
        description: "Perayaan syukur hasil panen dengan pertunjukan seni tradisional, pasar dadakan produk lokal, dan lomba memasak.",
        image: "assets/images/panen.jpg"
    },
    {
        title: "Pelatihan Pemasaran Digital", category: "Pelatihan", date: "3–5 November 2024",
        description: "Workshop fotografi produk dan pemasaran online untuk 50 pelaku UMKM desa bersama mentor profesional.",
        image: "assets/images/marketing.jpg"
    },
    {
        title: "Open Tour Desa Edukasi", category: "Lingkungan", date: "22–23 November 2024",
        description: "Paket wisata 2 hari 1 malam yang mengajak tamu mengenal proses pertanian organik, pembuatan kerajinan, dan memasak tradisional.",
        image: "assets/images/tur.jpg"
    },
    {
        title: "Pasar UMKM Akhir Tahun", category: "Pameran", date: "20–22 Desember 2024",
        description: "Pameran dan bazar produk UMKM terbesar Desa Wisata, menampilkan 80+ stand dari seluruh RW dan dusun.",
        image: "assets/images/umkm.jpg"
    }
];

setTimeout(() => {
    // Seed Products
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare(`INSERT INTO products (name, category, price, seller, sellerImg, rating, reviews, stock, desc, material, size, weight, image, whatsapp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            products.forEach(p => {
                stmt.run(p.name, p.category, p.price, p.seller, p.sellerImg, p.rating, p.reviews, p.stock, p.desc, p.material, p.size, p.weight, p.image, p.whatsapp);
            });
            stmt.finalize();
            console.log("Seeding products selesai!");
        } else {
            console.log("Data products sudah ada, skip seeder.");
        }
    });

    // Seed Activities
    db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare(`INSERT INTO activities (category, title, description, date, image) VALUES (?, ?, ?, ?, ?)`);
            activities.forEach(a => {
                stmt.run(a.category, a.title, a.description, a.date, a.image);
            });
            stmt.finalize();
            console.log("Seeding activities selesai!");
        } else {
            console.log("Data activities sudah ada, skip seeder.");
        }
    });
}, 1000);
