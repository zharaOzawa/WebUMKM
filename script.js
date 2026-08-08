// navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  // Fetch products from backend
  let loadedMore = false;
  async function loadProducts() {
    try {
      const res = await fetch('api.php?action=get_products');
      const data = await res.json();
      const grid = document.getElementById('productGrid');
      grid.innerHTML = '';
      
      data.forEach((p, index) => {
        const isHidden = index >= 6 ? 'hidden-card' : '';
        const displayStyle = isHidden ? 'style="display: none;"' : '';
        
        const html = `
          <article class="product-card ${isHidden}" data-cat="${p.category.toLowerCase()}"
            data-name="${p.name}" data-price="${p.price}" data-category="${p.category}"
            data-seller="${p.seller}" data-seller-img="${p.sellerImg}"
            data-rating="${p.rating}" data-reviews="${p.reviews}" data-stock="${p.stock}"
            data-desc="${p.desc}" data-material="${p.material}" data-size="${p.size}" data-weight="${p.weight}"
            data-image="${p.image}" data-whatsapp="${p.whatsapp}" ${displayStyle}>
            <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
            <div class="product-body">
              <div class="product-top"><span class="cat-tag">${p.category}</span><span class="price">${p.price}</span></div>
              <h4>${p.name}</h4>
              <p class="desc">${p.desc}</p>
              <div class="product-foot">
                <span class="seller"><span class="avatar"><img src="${p.sellerImg}" alt=""></span>By ${p.seller}</span>
                <a href="#" class="btn-detail">Lihat Detail</a>
              </div>
            </div>
          </article>
        `;
        grid.insertAdjacentHTML('beforeend', html);
      });
      
      initFilters();
    } catch(e) {
      console.error('Error fetching products:', e);
    }
  }

  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-pill');
    const products = document.querySelectorAll('#productGrid .product-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        products.forEach(card => {
          const match = filter === 'semua' || card.dataset.cat === filter;
          if (card.classList.contains('hidden-card') && !loadedMore) {
            card.style.display = 'none';
            return;
          }
          card.style.display = match ? 'flex' : 'none';
        });
      });
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', () => {
      loadedMore = !loadedMore;
      const activeFilter = document.querySelector('.filter-pill.active').dataset.filter;
      document.querySelectorAll('.hidden-card').forEach(card => {
        const match = activeFilter === 'semua' || card.dataset.cat === activeFilter;
        card.style.display = loadedMore && match ? 'flex' : 'none';
      });
      loadMoreBtn.innerHTML = loadedMore
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15 12 9l-6 6"/></svg> Tampilkan Lebih Sedikit'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 1 2.6 6.4M3 12V6m0 6h6"/></svg> Lihat Semua Produk';
    });
  }

  // Panggil loadProducts saat halaman dimuat
  loadProducts();

  async function loadActivities() {
    try {
      const res = await fetch('api.php?action=get_activities');
      const data = await res.json();
      const container = document.getElementById('timelineContainer');
      if (!container) return;
      
      // Preserve the timeline line
      container.innerHTML = '<div class="timeline-line"></div>';

      data.forEach((act, index) => {
        // Alternate flip class for even/odd rows
        const isFlip = index % 2 !== 0 ? 'flip' : '';
        
        let rowHtml = '';
        if (isFlip) {
          rowHtml = `
            <div class="t-row flip">
              <div class="t-photo"><img src="${act.image}" alt="${act.title}"></div>
              <div class="t-dot"></div>
              <div class="t-card">
                <span class="cat-tag">${act.category}</span>
                <h4>${act.title}</h4>
                <p>${act.description}</p>
                <div class="t-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  ${act.date}
                </div>
              </div>
            </div>
          `;
        } else {
          rowHtml = `
            <div class="t-row">
              <div class="t-card">
                <span class="cat-tag">${act.category}</span>
                <h4>${act.title}</h4>
                <p>${act.description}</p>
                <div class="t-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  ${act.date}
                </div>
              </div>
              <div class="t-dot"></div>
              <div class="t-photo"><img src="${act.image}" alt="${act.title}"></div>
            </div>
          `;
        }
        
        container.insertAdjacentHTML('beforeend', rowHtml);
      });
    } catch(e) {
      console.error('Error fetching activities:', e);
    }
  }

  loadActivities();
  // ============ PETA INTERAKTIF (Leaflet + OpenStreetMap) ============
  (function () {
    const mapEl = document.getElementById('leafletMap');
    if (!mapEl || typeof L === 'undefined') return;

    // Desa Panggungharjo, Kec. Sewon, Kab. Bantul, DI Yogyakarta
    const VILLAGE_CENTER = [-7.8322, 110.3552];
    const DEFAULT_ZOOM = 15;

    const map = L.map('leafletMap', {
      zoomControl: false,
      scrollWheelZoom: false
    }).setView(VILLAGE_CENTER, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const ICONS = {
      home: 'M3 21V8l9-5 9 5v13M9 21v-7h6v7',
      mountain: 'M3 19 9.5 6l3 5.5L16 7l5 12H3Z',
      building: 'M4 21V10l8-6 8 6v11M9 21v-7h6v7'
    };

    function pinIcon(color, path) {
      return L.divIcon({
        className: '',
        html: `<div class="custom-pin" style="background:${color};">
                 <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${path}"/></svg>
               </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });
    }

    // Titik-titik nyata di Desa Panggungharjo, Sewon, Bantul
    // Catatan: koordinat berikut perkiraan berdasarkan alamat resmi tiap tempat —
    // silakan presisikan lewat klik kanan lokasi di Google Maps kalau perlu akurasi lebih tinggi
    const POINTS = [
      { layer: 'umkm',   coords: [-7.8355, 110.3520], color: 'var(--gold)', icon: ICONS.home,     name: 'Sentra Tenun Dibyo Lurik', desc: 'Jl. Sawit · UMKM Tenun' },
      { layer: 'umkm',   coords: [-7.8390, 110.3505], color: 'var(--gold)', icon: ICONS.home,     name: 'TPST 3R Panggung Lestari',  desc: 'BUMDes · Pengelolaan Sampah' },
      { layer: 'wisata', coords: [-7.8168, 110.3487], color: '#6fcf97',     icon: ICONS.mountain, name: 'Kampoeng Mataraman',        desc: 'Jl. Ring Road Selatan · Wisata Budaya Agraris' },
      { layer: 'wisata', coords: [-7.8254, 110.3634], color: '#6fcf97',     icon: ICONS.mountain, name: 'Panggung Krapyak',          desc: 'Situs Cagar Budaya Mataram' },
      { layer: 'kantor', coords: [-7.8322, 110.3617], color: '#cfd8d3',     icon: ICONS.building, name: 'Kantor Kalurahan Panggungharjo', desc: 'Jl. KH. Ali Maksum · Pusat Desa' }
    ];

    const layerGroups = { umkm: L.layerGroup(), wisata: L.layerGroup(), kantor: L.layerGroup() };

    POINTS.forEach(p => {
      const marker = L.marker(p.coords, { icon: pinIcon(p.color, p.icon) });
      marker.bindPopup(`<strong>${p.name}</strong>${p.desc}`);
      marker.addTo(layerGroups[p.layer]);
    });

    Object.values(layerGroups).forEach(group => group.addTo(map));

    // toggle layer sesuai switch di panel kiri (UMKM Hubs / Destinasi Wisata / Kantor Desa)
    document.querySelectorAll('.switch').forEach(sw => {
      sw.addEventListener('click', () => {
        sw.classList.toggle('on');
        const layer = sw.dataset.layer;
        const isOn = sw.classList.contains('on');
        const group = layerGroups[layer];
        if (!group) return;
        if (isOn) group.addTo(map);
        else map.removeLayer(group);
      });
    });

    // tombol zoom & pusatkan peta (kontrol kustom, terhubung ke peta asli)
    document.getElementById('zoomIn').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoomOut').addEventListener('click', () => map.zoomOut());
    document.getElementById('mapCenter').addEventListener('click', () => map.setView(VILLAGE_CENTER, DEFAULT_ZOOM));

    // aktifkan scroll-zoom hanya saat peta diklik, biar scroll halaman tidak "kejebak"
    map.on('click', () => map.scrollWheelZoom.enable());
  })();

  // contact form (demo submission, no backend)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.style.display = 'block';
    form.reset();
    setTimeout(() => { status.style.display = 'none'; }, 4000);
  });

  // ============ MODAL DETAIL PRODUK ============
  (function () {
    const overlay = document.getElementById('productModalOverlay');

    function fillModal(card) {
      const d = card.dataset;

      document.getElementById('modalImg').src = d.image;
      document.getElementById('modalImg').alt = d.name;
      document.getElementById('modalCat').textContent = d.category;
      document.getElementById('modalProductName').textContent = d.name;
      document.getElementById('modalPrice').textContent = d.price;
      document.getElementById('modalSeller').textContent = d.seller;
      document.getElementById('modalSellerImg').src = d.sellerImg || '';
      document.getElementById('modalDesc').textContent = d.desc;
      document.getElementById('modalMaterial').textContent = d.material;
      document.getElementById('modalSize').textContent = d.size;
      document.getElementById('modalWeight').textContent = d.weight;

      const stockEl = document.getElementById('modalStock');
      const stockLabel = { tersedia: 'Tersedia', 'hampir-habis': 'Hampir Habis', habis: 'Habis' };
      stockEl.textContent = stockLabel[d.stock] || d.stock;
      stockEl.className = 'stock-badge ' + (d.stock || '');

      const rating = parseFloat(d.rating) || 0;
      const ratingEl = document.getElementById('modalRating');
      ratingEl.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const filled = i <= Math.round(rating);
        ratingEl.innerHTML += `<svg viewBox="0 0 24 24" ${filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.5"'}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7Z"/></svg>`;
      }
      ratingEl.innerHTML += `<span>${d.rating} (${d.reviews} ulasan)</span>`;

      document.getElementById('modalContactBtn').href = d.whatsapp || '#';
    }

    function openModal(card) {
      fillModal(card);
      overlay.classList.add('open');
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-detail');
      if (btn) {
        e.preventDefault();
        openModal(btn.closest('.product-card'));
      }
    });

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('modalCloseBtn2').addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  })();