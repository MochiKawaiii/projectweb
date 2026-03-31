// ===== WHENEVER ATELIER — App Router & Components =====

// ===== SHARED COMPONENTS =====
function renderAnnouncement() {
  return `<div class="announcement-bar">Free shipping for orders over 1,000,000₫</div>`;
}

function renderHeader() {
  return `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <div style="display:flex;align-items:center;gap:16px;">
        <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <nav class="header-nav" id="header-nav">
          <a href="#/collections/all">SHOP</a>
          <a href="#/pages/about">ABOUT</a>
          <a href="#/pages/philanthropy">WHENEVER CARE</a>
          <a href="#/pages/faq">FAQ</a>
        </nav>
      </div>
      <a href="#/" class="site-logo"><img src="${MEDIA.logo}" alt="WHENEVER Atelier" class="logo-img"></a>
      <div class="header-actions">
        <button id="search-btn" onclick="openSearch()">SEARCH</button>
        <a href="#/account/login" class="hide-mobile">ACCOUNT</a>
        <button id="cart-btn" onclick="openCart()">CART (0)</button>
      </div>
    </div>
  </header>`;
}

function renderNewsletter() {
  return `
  <section class="newsletter-section" id="newsletter">
    <h3>Newsletter</h3>
    <form class="newsletter-form" onsubmit="event.preventDefault();alert('Đăng ký thành công!');">
      <input type="email" placeholder="Email address" required>
      <button type="submit">→</button>
    </form>
    <p class="newsletter-privacy">By signing up, you agree to our <a href="#/pages/chinh-sach-bao-mat">Privacy Policy</a>.</p>
  </section>`;
}

function renderFooter() {
  const navLinks = FOOTER_NAV.navigate.map(l => `<a href="${l.hash}">${l.name}</a>`).join('');
  const socialLinks = FOOTER_NAV.social.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.name}</a>`).join('');
  const officialLinks = FOOTER_NAV.official.map(l => `<a href="${l.hash}">${l.name}</a>`).join('');

  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <h4>Newsletter</h4>
        <form class="newsletter-form" style="max-width:100%;" onsubmit="event.preventDefault();alert('Đăng ký thành công!');">
          <input type="email" placeholder="Email address" required>
          <button type="submit">→</button>
        </form>
        <p class="newsletter-privacy" style="text-align:left;margin-top:8px;">By signing up, you agree to our <a href="#/pages/chinh-sach-bao-mat">Privacy Policy</a>.</p>
      </div>
      <div class="footer-col">
        <h4>Navigate</h4>
        ${navLinks}
      </div>
      <div class="footer-col">
        <h4>Social</h4>
        ${socialLinks}
      </div>
      <div class="footer-col">
        <h4>Official</h4>
        ${officialLinks}
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <p>We're here Mon-Sun 10:00am - 9:30pm GMT+7.</p>
        <a href="#/pages/lien-he" class="support-link" style="margin-top:8px;">Drop us a note anytime.</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span><img src="${MEDIA.footerLogo}" alt="WHENEVER Atelier" style="height:40px;margin-bottom:12px;display:block;">© Copyright Whenever Atelier 2026</span>
      <div class="footer-social-icons">
        <a href="https://www.instagram.com/whenever.atelier/" target="_blank" rel="noopener" title="Instagram">📷</a>
        <a href="https://www.youtube.com/@WheneverAtelier" target="_blank" rel="noopener" title="YouTube">▶</a>
        <a href="https://www.tiktok.com/@whenever.atelier" target="_blank" rel="noopener" title="TikTok">♪</a>
      </div>
    </div>
  </footer>`;
}

function renderStickySocial() {
  return `
  <div class="sticky-social">
    <a href="https://www.instagram.com/whenever.atelier/" target="_blank" rel="noopener" class="ig-btn" title="Instagram">📷</a>
    <a href="https://www.youtube.com/@WheneverAtelier" target="_blank" rel="noopener" class="yt-btn" title="YouTube">▶</a>
    <a href="javascript:void(0)" class="top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Back to top">↑</a>
  </div>`;
}

function renderSearchOverlay() {
  return `
  <div class="search-overlay" id="search-overlay">
    <div class="search-overlay-inner">
      <input type="text" placeholder="Tìm kiếm..." id="search-overlay-input" autofocus>
    </div>
    <span class="search-overlay-close" onclick="closeSearch()">×</span>
  </div>`;
}

function renderCartDrawer() {
  return `
  <div class="cart-overlay" id="cart-overlay" onclick="closeCart()"></div>
  <div class="cart-drawer" id="cart-drawer">
    <div class="cart-drawer-header">
      <h3>Giỏ hàng</h3>
      <span class="cart-drawer-close" onclick="closeCart()">×</span>
    </div>
    <div class="cart-drawer-body">
      <div class="cart-drawer-notice">PHÍ SHIP DAO ĐỘNG TỪ 17K - 30K TÙY KHU VỰC VÀ GIÁ TRỊ ĐƠN HÀNG ❤</div>
      <div class="cart-drawer-empty">0 items<br><br>Giỏ hàng đang trống</div>
    </div>
    <div class="cart-drawer-footer">
      <div class="cart-drawer-total"><span>Tổng cộng</span><span>0₫</span></div>
      <a href="#/cart" class="cart-drawer-checkout" onclick="closeCart()">Đến trang giỏ hàng</a>
    </div>
  </div>`;
}

function renderMobileMenu() {
  const shopCategories = SHOP_CATEGORIES_VN.map(c =>
    `<a href="#/collections/${c.slug}" onclick="closeMobile()">${c.name}</a>`
  ).join('');

  return `
  <div class="mobile-menu" id="mobile-menu">
    <div class="mobile-menu-header">
      <a href="#/" class="site-logo" onclick="closeMobile()"><img src="${MEDIA.logo}" alt="WHENEVER Atelier" class="logo-img" style="height:28px;"></a>
      <span class="mobile-menu-close" onclick="closeMobile()">×</span>
    </div>
    <div class="mobile-menu-nav">
      <a href="javascript:void(0)" onclick="toggleSubmenu(this)">SHOP ▾</a>
      <div class="mobile-submenu" id="shop-submenu">${shopCategories}</div>
      <a href="#/pages/about" onclick="closeMobile()">ABOUT</a>
      <a href="#/pages/philanthropy" onclick="closeMobile()">WHENEVER CARE</a>
      <a href="#/pages/faq" onclick="closeMobile()">FAQ</a>
    </div>
    <div class="mobile-menu-auth">
      <a href="#/account/login" onclick="closeMobile()">Đăng nhập</a>
      <a href="#/account/register" onclick="closeMobile()">Đăng kí</a>
    </div>
  </div>`;
}

// ===== INTERACTION HANDLERS =====
function openSearch() {
  document.getElementById('search-overlay').classList.add('active');
  setTimeout(() => document.getElementById('search-overlay-input').focus(), 100);
}
function closeSearch() {
  document.getElementById('search-overlay').classList.remove('active');
}
function openCart() {
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function openMobile() {
  document.getElementById('mobile-menu').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('active');
  document.body.style.overflow = '';
}
function toggleSubmenu(el) {
  const sub = el.nextElementSibling;
  if (sub) sub.classList.toggle('active');
}

// ===== ROUTER =====
function getRoute() {
  const hash = location.hash.slice(1) || '/';
  return hash;
}

function renderPage() {
  const route = getRoute();
  const app = document.getElementById('app');
  let content = '';

  // Determine page content
  if (route === '/' || route === '') {
    content = PAGES.home();
  } else if (route.startsWith('/pages/')) {
    const pageSlug = route.replace('/pages/', '');
    if (PAGES[pageSlug]) {
      content = PAGES[pageSlug]();
    } else {
      content = `<div class="page-content"><h1>Trang không tìm thấy</h1><p>Trang bạn tìm kiếm không tồn tại.</p></div>`;
    }
  } else if (route.startsWith('/collections/')) {
    const slug = route.replace('/collections/', '');
    content = PAGES.collection(slug);
  } else if (route === '/search') {
    content = PAGES.search();
  } else if (route === '/account/login') {
    content = PAGES.login();
  } else if (route === '/account/register') {
    content = PAGES.register();
  } else if (route === '/cart') {
    content = PAGES.cart();
  } else if (route.startsWith('/products/')) {
    // Simple product page
    const slug = route.replace('/products/', '');
    const all = getAllProducts();
    const prod = all.find(p => p.slug === slug);
    if (prod) {
      content = `
        <div class="page-content" style="text-align:center;">
          <div style="max-width:500px;margin:0 auto;">
            <div class="product-image" style="aspect-ratio:3/4;background:#f5f5f5;margin-bottom:24px;overflow:hidden;border-radius:4px;">
              <img src="${prod.image}" alt="${prod.name}" style="width:100%;height:100%;object-fit:cover;">
            </div>
          </div>
          <h1 style="font-size:20px;letter-spacing:1px;">${prod.name}</h1>
          <p style="font-size:20px;font-weight:700;margin:16px 0;">${prod.price}</p>
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px;">${prod.category}</p>
          <button class="buy-now-btn" style="margin-top:24px;" onclick="alert('Đã thêm vào giỏ hàng!')">Thêm vào giỏ</button>
        </div>
      `;
    } else {
      content = `<div class="page-content"><h1>Sản phẩm không tìm thấy</h1></div>`;
    }
  } else {
    content = `<div class="page-content"><h1>404</h1><p>Trang không tồn tại.</p></div>`;
  }

  // Assemble full page
  app.innerHTML =
    renderAnnouncement() +
    renderHeader() +
    '<main id="main-content">' + content + '</main>' +
    renderNewsletter() +
    renderFooter() +
    renderStickySocial() +
    renderSearchOverlay() +
    renderCartDrawer() +
    renderMobileMenu();

  // Scroll to top
  window.scrollTo(0, 0);

  // Initialize page interactions
  initPageInteractions();
}

function initPageInteractions() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  if (menuToggle) menuToggle.addEventListener('click', openMobile);

  // Header scroll effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Carousel tabs
  const tabs = document.querySelectorAll('.carousel-tab');
  const tracks = document.querySelectorAll('.carousel-track');
  const buyBtn = document.getElementById('carousel-buy-btn');
  const carouselKeys = ['cloudline','slippers','loungewear','rawDenim','denim'];
  const carouselSlugs = ['cloudline','dep','loungewear','raw-denim','denim'];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index);
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tracks.forEach((tr, i) => {
        tr.style.display = i === idx ? 'flex' : 'none';
      });
      if (buyBtn) buyBtn.href = '#/collections/' + carouselSlugs[idx];
    });
  });

  // Carousel navigation
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const activeTrack = document.querySelector('.carousel-track[style*="flex"], .carousel-track:not([style*="none"])');
      if (activeTrack) activeTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const activeTrack = document.querySelector('.carousel-track[style*="flex"], .carousel-track:not([style*="none"])');
      if (activeTrack) activeTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));

  // Search overlay keyboard
  const searchInput = document.getElementById('search-overlay-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
      if (e.key === 'Enter' && searchInput.value.trim()) {
        closeSearch();
        location.hash = '#/search';
      }
    });
  }

  // Page search
  const pageSearchInput = document.getElementById('page-search-input');
  if (pageSearchInput) {
    pageSearchInput.addEventListener('input', () => {
      const query = pageSearchInput.value.toLowerCase().trim();
      const results = document.getElementById('search-results');
      if (!query) { results.innerHTML = ''; return; }
      const all = getAllProducts();
      const matches = all.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
      if (matches.length === 0) {
        results.innerHTML = '<p style="color:#888;">Không tìm thấy sản phẩm nào.</p>';
      } else {
        results.innerHTML = '<div class="product-grid" style="padding:0;">' + matches.map(p => `
          <div class="product-card">
            <a href="#/products/${p.slug}">
              <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;"></div>
              <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">${p.price}</div>
              </div>
            </a>
          </div>
        `).join('') + '</div>';
      }
    });
  }

  // Update page title
  updatePageTitle();
}

function updatePageTitle() {
  const route = getRoute();
  let title = 'WHENEVER Atelier';
  if (route.startsWith('/pages/')) {
    const slug = route.replace('/pages/', '');
    const titles = {
      'chinh-sach-doi-tra': 'Chính sách đổi trả',
      'chinh-sach-bao-mat': 'Chính sách bảo mật',
      'chinh-sach-van-chuyen': 'Chính sách vận chuyển',
      'chinh-sach-kiem-hang': 'Chính sách kiểm hàng',
      'chinh-sach-thanh-toan': 'Chính sách thanh toán',
      'dieu-khoan-dich-vu': 'Điều khoản dịch vụ',
      'customer-request-invoice': 'Hoá đơn theo yêu cầu',
      'about-us': 'Giới thiệu',
      'about': 'About',
      'lien-he': 'Liên hệ',
      'faq': 'FAQ',
      'philanthropy': 'Whenever Care',
      'whenever-membership-policy': 'Membership Policy',
      'thong-bao': 'Thông báo',
    };
    title = (titles[slug] || slug) + ' — WHENEVER Atelier';
  } else if (route.startsWith('/collections/')) {
    const slug = route.replace('/collections/', '');
    const col = COLLECTIONS.find(c => c.slug === slug);
    title = (col ? col.name : slug) + ' — WHENEVER Atelier';
  } else if (route === '/search') {
    title = 'Tìm kiếm — WHENEVER Atelier';
  } else if (route === '/cart') {
    title = 'Giỏ hàng — WHENEVER Atelier';
  } else if (route === '/account/login') {
    title = 'Đăng nhập — WHENEVER Atelier';
  } else if (route === '/account/register') {
    title = 'Đăng kí — WHENEVER Atelier';
  }
  document.title = title;
}

// ===== INIT =====
window.addEventListener('hashchange', renderPage);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/';
  renderPage();
});
