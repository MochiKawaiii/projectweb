// ===== WHENEVER ATELIER — Page Templates =====

const PAGES = {};

// Helper: render product image with real CDN URL
function prodImg(p, extraClass) {
  const cls = extraClass || '';
  return `<img src="${p.image}" alt="${p.name}" loading="lazy" class="${cls}" style="width:100%;height:100%;object-fit:cover;">`;
}

// ===== HOMEPAGE =====
PAGES.home = function() {
  const carouselTabs = ['CLOUDLINE','SLIPPERS','LOUNGEWEAR','RAW DENIM','DENIM'];
  const carouselKeys = ['cloudline','slippers','loungewear','rawDenim','denim'];

  function renderCarouselProducts(key) {
    const items = PRODUCTS[key] || [];
    return items.map(p => `
      <div class="product-card-carousel">
        <a href="#/products/${p.slug}">
          <div class="product-image">${prodImg(p)}</div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-category">${p.category}</div>
          </div>
        </a>
      </div>
    `).join('');
  }

  function renderActiveProducts() {
    const items = PRODUCTS.active || [];
    return items.map(p => `
      <div class="product-card">
        <a href="#/products/${p.slug}">
          <div class="product-image">
            ${prodImg(p)}
            <div class="add-to-cart-overlay">Thêm vào giỏ</div>
          </div>
          <div class="product-info">
            <div class="brand-label">WHENEVER</div>
            <div class="product-name">${p.name}</div>
            <div class="product-price">${p.price}</div>
            <div class="product-type">${p.category}</div>
          </div>
        </a>
      </div>
    `).join('');
  }

  const categoryTickerItems = COLLECTIONS.map(c =>
    `<span class="category-ticker-item" onclick="location.hash='#/collections/${c.slug}'">${c.name}</span>`
  ).join('');

  const ugcGrid = MEDIA.ugc.map((url, i) =>
    `<a class="social-grid-item" href="https://www.instagram.com/whenever.atelier/" target="_blank" rel="noopener">
      <img src="${url}" alt="@whenever.atelier ${i+1}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
    </a>`
  ).join('');

  return `
    <!-- Hero Video -->
    <section class="hero-section" id="hero">
      <video class="hero-video" autoplay muted loop playsinline poster="${MEDIA.heroPoster}">
        <source src="${MEDIA.heroVideo}" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
      <div class="hero-text">
        <img src="${MEDIA.logo}" alt="WHENEVER Atelier" class="hero-logo-img">
      </div>
      <div class="hero-cta">
        <a href="#/collections/all">WHENEVER</a>
      </div>
    </section>

    <!-- Product Carousel Section -->
    <section class="carousel-section" id="carousel-section">
      <div class="carousel-tabs" id="carousel-tabs">
        ${carouselTabs.map((t, i) => `<div class="carousel-tab${i===0?' active':''}" data-index="${i}">${t}</div>`).join('')}
      </div>
      <div class="section-header" style="padding:0 40px;">
        <div></div>
        <div class="carousel-nav">
          <button id="carousel-prev" aria-label="Previous">‹</button>
          <button id="carousel-next" aria-label="Next">›</button>
        </div>
      </div>
      ${carouselKeys.map((key, i) => `
        <div class="carousel-track${i===0?' active':''}" data-carousel="${i}" ${i > 0 ? 'style="display:none"' : ''}>
          ${renderCarouselProducts(key)}
        </div>
      `).join('')}
      <div style="text-align:center; padding: 20px 40px 0;">
        <a href="#/collections/${carouselKeys[0]}" class="buy-now-btn" id="carousel-buy-btn">Buy now</a>
      </div>
    </section>

    <!-- Marquee -->
    <section class="marquee-section">
      <div class="marquee-track">
        ${Array(10).fill(`<span class="marquee-item">WHENEVER </span>`).join('')}
      </div>
    </section>

    <!-- Category Ticker -->
    <section class="category-ticker">
      <div class="category-ticker-track">
        ${categoryTickerItems}${categoryTickerItems}
      </div>
    </section>

    <!-- Whenever Active Grid -->
    <section class="product-grid-section fade-in" id="active-grid">
      <h2 class="section-title">WHENEVER ACTIVE</h2>
      <div class="product-grid">
        ${renderActiveProducts()}
      </div>
    </section>

    <!-- Featured Section (Slide 1 + Slide 2) -->
    <section class="featured-section fade-in" id="featured">
      <div class="featured-inner">
        <div class="featured-image">
          <img src="${MEDIA.slide1}" alt="Star Washed Denim" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
        </div>
        <div class="featured-content">
          <h2>Star Washed Denim</h2>
          <p>Bộ sưu tập Denim mới nhất từ WHENEVER Atelier — những sản phẩm denim được wash thủ công, mang đậm dấu ấn cá nhân. Mỗi sản phẩm là duy nhất, phản ánh tinh thần tự do và phong cách đường phố hiện đại.</p>
          <p>Chất liệu denim cao cấp, được xử lý qua nhiều công đoạn thủ công để tạo ra hiệu ứng wash tự nhiên, mang lại vẻ ngoài vintage đặc trưng.</p>
          <div class="featured-product">
            <div class="fp-name">"WHENEVER" STAR WASH DENIM JACKET</div>
            <div class="fp-desc">Premium washed denim jacket with star detail</div>
            <div class="fp-price">1,450,000₫</div>
          </div>
          <div class="featured-product">
            <div class="fp-name">"WHENEVER" STAR WASH DENIM PANTS</div>
            <div class="fp-desc">Premium washed denim pants with star detail</div>
            <div class="fp-price">1,250,000₫</div>
          </div>
          <a href="#/collections/denim" class="buy-now-btn" style="display:inline-block;">Xem bộ sưu tập</a>
        </div>
      </div>
    </section>

    <!-- Second Featured (Slide 2) -->
    <section class="featured-section fade-in">
      <div class="featured-inner" style="direction:rtl;">
        <div class="featured-image" style="direction:ltr;">
          <img src="${MEDIA.slide2}" alt="Featured Collection" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
        </div>
        <div class="featured-content" style="direction:ltr;">
          <h2>Cloudline Collection</h2>
          <p>Cotton 85% – Linen 15%: kết hợp hoàn hảo giữa tự nhiên và tinh tế. Mang lại cảm giác cực kì thoải mái khi mặc.</p>
          <a href="#/collections/cloudline" class="buy-now-btn" style="display:inline-block;">Xem bộ sưu tập</a>
        </div>
      </div>
    </section>

    <!-- Whenever Care -->
    <section class="featured-section fade-in">
      <div class="featured-inner">
        <div class="featured-image">
          <img src="${MEDIA.wheneverCare}" alt="Whenever Care" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
        </div>
        <div class="featured-content">
          <h2>Whenever Care</h2>
          <p>At WHENEVER Atelier, we believe fashion should make a positive impact beyond style. Through our WHENEVER CARE initiative, we're committed to giving back to the community.</p>
          <a href="#/pages/philanthropy" class="buy-now-btn" style="display:inline-block;">Tìm hiểu thêm</a>
        </div>
      </div>
    </section>

    <!-- Social/Instagram -->
    <section class="social-section fade-in" id="social">
      <h2>Find Us On Social</h2>
      <div class="social-grid">
        ${ugcGrid}
      </div>
    </section>
  `;
};

// ===== POLICY PAGES =====
PAGES['chinh-sach-doi-tra'] = () => `
<div class="page-content">
  <h1>Chính sách đổi trả</h1>
  <h2>ĐỐI VỚI ĐƠN HÀNG MUA TẠI CỬA HÀNG</h2>
  <ul>
    <li>KHÁCH HÀNG ĐỔI SIZE TẠI CỬA HÀNG TRONG VÒNG 3 NGÀY KẾ TỪ NGÀY MUA TRÊN HÓA ĐƠN.</li>
  </ul>
  <h2>ĐỐI VỚI ĐƠN HÀNG ONLINE</h2>
  <ul>
    <li>KHÁCH HÀNG GỬI LẠI WHENEVER ATELIER SẢN PHẨM TRONG VÒNG 3 NGÀY (NỘI THÀNH)</li>
    <li>VÀ 7 NGÀY (NGOẠI THÀNH) KẾ TỪ NGÀY NHẬN HÀNG.</li>
  </ul>
  <h2>ĐIỀU KIỆN ĐỔI HÀNG</h2>
  <ul>
    <li>WHENEVER ATELIER CHỈ CHẤP NHẬN ĐỔI TRẢ SẢN PHẨM KHI ĐẦY ĐỦ TAG, BAO BÌ, HÓA ĐƠN. SẢN PHẨM CHƯA QUA SỬ DỤNG, KHÔNG BỊ DỠ BẨN, CHƯA QUA GIẶT ỦI, KHÔNG CÓ MÙI LẠ, HÀNG KHÔNG BỊ LỖI DO QUÁ TRÌNH LƯU GIỮ, VẬN CHUYỂN CỦA NGƯỜI SỬ DỤNG.</li>
    <li>KHÔNG ÁP DỤNG ĐỔI HÀNG ĐỐI VỚI PHỤ KIỆN (TẤT, MŨ, THẮT LƯNG,...).</li>
    <li>WHENEVER CÓ QUYỀN TỪ CHỐI ĐỔI HÀNG NẾU SẢN PHẨM KHÔNG ĐÁP ỨNG NHỮNG ĐIỀU KIỆN TRÊN.</li>
  </ul>
  <h2>QUY ĐỊNH ĐỔI HÀNG</h2>
  <ul>
    <li>CHỈ ĐỔI KHI SẢN PHẨM CÓ LỖI DO NHÀ SẢN XUẤT HOẶC DO VẬN CHUYỀN ÁP DỤNG ĐỐI VỚI ĐƠN HÀNG ONLINE.</li>
    <li>ÁP DỤNG ĐỔI KHI SẢN PHẨM CÓ LỖI DO NHÀ SẢN XUẤT, LỖI DO VẬN CHUYỀN HOẶC ĐỔI THEO YÊU CẦU CỦA KHÁCH HÀNG.</li>
    <li>CHỈ ÁP DỤNG VỚI WEBSITE, IG, FB CỦA WHENEVER ATELIER.</li>
    <li>KHÔNG NHẬN ĐỔI/ TRẢ SẢN PHẨM KHI KHÁCH HÀNG KHÔNG MUA TRỰC TIẾP TẠI WHENEVER ATELIER.</li>
    <li>MỖI SẢN PHẨM CHỈ ĐƯỢC ĐỔI 01 (MỘT) LẦN.</li>
    <li>CHỈ ĐƯỢC ĐỔI SANG SẢN PHẨM CÓ GIÁ TRỊ BẰNG HOẶC CAO HƠN VÀ BÙ PHẦN TIỀN CHÊNH LỆCH NẾU CÓ.</li>
    <li>TRONG TRƯỜNG HỢP KHÁCH HÀNG ĐỔI SANG SẢN PHẨM GIÁ THẤP HƠN, WHENEVER ATELIER SẼ KHÔNG HOÀN TRẢ LẠI PHẦN TIỀN THỪA.</li>
    <li>KHI ĐỔI SẢN PHẨM, KHÁCH HÀNG KHÔNG ĐƯỢC ÁP DỤNG THÊM CÁC CHƯƠNG TRÌNH KHÁC.</li>
    <li>KHI NHẬN HÀNG QUÝ KHÁCH VUI LÒNG QUAY VIDEO TOÀN BỘ QUÁ TRÌNH MỞ GÓI HÀNG.</li>
  </ul>
  <h2>QUY ĐỊNH VỀ PHÍ VẬN CHUYỂN KHI ĐỔI HÀNG ONLINE</h2>
  <ul>
    <li>TRƯỜNG HỢP SẢN PHẨM CÓ LỖI DO NHÀ SẢN XUẤT HOẶC DO VẬN CHUYẾN, WHENEVER SẼ CHI TRẢ PHÍ VẬN CHUYẾN 2 CHIỀU.</li>
    <li>TRƯỜNG HỢP ĐỔI THEO YÊU CẦU CỦA KHÁCH HÀNG THÌ KHÁCH HÀNG SẼ CHI TRẢ PHÍ VẬN CHUYỂN 2 CHIỀU.</li>
  </ul>
</div>`;

PAGES['chinh-sach-bao-mat'] = () => `
<div class="page-content">
  <h1>Chính sách bảo mật</h1>
  <h2>1. Mục đích và phạm vi thu thập.</h2>
  <p>Việc thu thập dữ liệu trên website bao gồm: họ tên, email, điện thoại, địa chỉ khách hàng. Đây là các thông tin mà chúng tôi cần khách hàng cung cấp bắt buộc khi gửi thông tin nhờ tư vấn hay muốn mua sản phẩm.</p>
  <h2>2. Phạm vi sử dụng thông tin.</h2>
  <p>Chúng tôi sử dụng thông tin khách hàng cung cấp để:</p>
  <ul>
    <li>Liên hệ xác nhận đơn hàng và giao hàng cho khách hàng;</li>
    <li>Cung cấp thông tin về sản phẩm đến khách hàng nếu có yêu cầu;</li>
    <li>Gửi email tiếp thị, khuyến mại về hàng hóa;</li>
    <li>Gửi các thông báo về các hoạt động trên website;</li>
    <li>Liên lạc và giải quyết với người dùng trong những trường hợp đặc biệt;</li>
    <li>Khi có yêu cầu của cơ quan tư pháp.</li>
  </ul>
  <h2>3. Thời gian lưu trữ thông tin.</h2>
  <p>Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu ban quản trị hủy bỏ.</p>
  <h2>4. Những người hoặc tổ chức có thể tiếp cận thông tin cá nhân.</h2>
  <ul>
    <li>Ban quản trị website.</li>
    <li>Khách hàng sở hữu thông tin cá nhân đó.</li>
    <li>Các cơ quan Pháp luật Việt Nam có thẩm quyền.</li>
    <li>Các đối tác hoạt động liên quan đến giao dịch của bạn.</li>
  </ul>
  <h2>5. Địa chỉ của đơn vị thu thập và quản lí thông tin cá nhân.</h2>
  <p><strong>CÔNG TY TNHH WHENEVER ATELIER</strong></p>
  <p>Địa chỉ: 141/8 Bàn Cờ, Phường 03, Quận 3, Thành phố Hồ Chí Minh</p>
  <h2>6. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân.</h2>
  <p>Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ với ban quản trị website.</p>
  <h2>7. Cơ chế tiếp nhận và giải quyết khiếu nại.</h2>
  <p>Khi phát hiện thông tin cá nhân bị sử dụng sai mục đích, khách hàng gọi <strong>0335896868</strong> hoặc mail <strong>whenever.atelier@gmail.com</strong>.</p>
</div>`;

PAGES['dieu-khoan-dich-vu'] = () => `
<div class="page-content">
  <h1>Điều khoản dịch vụ</h1>
  <h2>1. Giới thiệu</h2>
  <p>Chào mừng quý khách hàng đến với website chúng tôi. Khi quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này.</p>
  <h2>2. Hướng dẫn sử dụng website</h2>
  <p>Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.</p>
  <h2>3. Thanh toán an toàn và tiện lợi</h2>
  <ul>
    <li>Cách 1: Thanh toán trực tiếp (người mua nhận hàng tại địa chỉ người bán)</li>
    <li>Cách 2: Thanh toán sau (COD – giao hàng và thu tiền tận nơi)</li>
  </ul>
</div>`;

PAGES['chinh-sach-van-chuyen'] = () => `
<div class="page-content">
  <h1>Chính sách vận chuyển</h1>
  <h2>1. Các phương thức giao hàng và phạm vi giao hàng.</h2>
  <p>Khách hàng mua trực tiếp hàng tại cửa hàng hoặc ship hàng qua các đơn vị vận chuyển.</p>
  <h2>2. Thời hạn ước tính cho việc giao hàng.</h2>
  <p>Đối với các khu vực khác: 3-5 ngày làm việc (không tính ngày lễ, Tết)</p>
  <ul>
    <li>Nhân viên liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng.</li>
    <li>Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.</li>
    <li>Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.</li>
    <li>Đối tác vận chuyển giao hàng bị chậm.</li>
  </ul>
  <h2>3. Các giới hạn về mặt địa lý cho việc giao hàng.</h2>
  <p>Riêng khách tỉnh có nhu cầu mua số lượng lớn, chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển.</p>
  <h2>4. Phân định trách nhiệm.</h2>
  <ul>
    <li>Bên giao nhận có trách nhiệm cung cấp chứng từ hàng hoá.</li>
    <li>Đơn vị vận chuyển sẽ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc "nguyên đai, nguyên kiện".</li>
  </ul>
  <h2>5. Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển.</h2>
  <p>Đối với hàng hóa bị hư hỏng do quá trình vận chuyển, chúng tôi sẽ là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.</p>
</div>`;

PAGES['chinh-sach-kiem-hang'] = () => `
<div class="page-content">
  <h1>Chính sách kiểm hàng</h1>
  <h2>1. Định nghĩa.</h2>
  <p>Kiểm hàng là thực hiện các công việc kiểm tra và so sánh các sản phẩm nhận được với các sản phẩm trong đơn hàng mà quý khách hàng yêu cầu.</p>
  <h2>2. Thời điểm kiểm hàng.</h2>
  <ul>
    <li>whenever.vn chấp nhận cho khách hàng đồng kiểm với nhân viên giao hàng tại thời điểm nhận hàng (hoặc trong vòng 30p kể từ khi khách nhận được hàng hóa).</li>
  </ul>
  <p><em>Lưu ý: Quý khách quay video lúc mở thùng hàng để đối chiếu khi cần thiết.</em></p>
  <h2>3. Phạm vi kiểm tra hàng hóa.</h2>
  <ul>
    <li>Theo các thuộc tính cơ bản hàng hóa: tên hàng, số lượng, thông tin khách hàng.</li>
    <li>Theo mẫu mã được hiển thị bởi ảnh đại diện của sản phẩm.</li>
    <li>Tuyệt đối không bóc, mở các hộp sản phẩm có tem niêm phong.</li>
  </ul>
  <h2>4. Các bước xử lý khi hàng hóa nhận được không như đơn đặt hàng.</h2>
  <ul>
    <li>Liên hệ hotline để được gặp bộ phận chăm sóc khách hàng.</li>
    <li>Trường hợp đóng sai đơn hàng, khách có thể không nhận hàng, không thanh toán.</li>
  </ul>
  <h2>5. Các kênh thông tin tiếp nhận khiếu nại.</h2>
  <p>Hotline: <strong>0911062050</strong> hoặc mail <strong>SUPPORT@WHENEVER.VN</strong></p>
</div>`;

PAGES['chinh-sach-thanh-toan'] = () => `
<div class="page-content">
  <h1>Chính sách thanh toán</h1>
  <h2>Thanh toán tiền mặt.</h2>
  <h3>Thanh toán tiền mặt tại nhà khi nhận hàng</h3>
  <p>Khi nhân viên giao hàng, khách hàng kiểm tra sản phẩm và thanh toán trực tiếp cho nhân viên giao hàng theo giá trị tiền trên hóa đơn.</p>
  <h3>Thanh toán tiền mặt tại cửa hàng</h3>
  <p>Khách hàng đến cửa hàng tham quan, mua sản phẩm sẽ thanh toán trực tiếp bằng tiền mặt hoặc chuyển khoản trực tiếp tại cửa hàng.</p>
  <p>Nếu trong quá trình thanh toán, bạn gặp trở ngại hoặc cần hỗ trợ thì cứ liên hệ hotline để được hỗ trợ nhé.</p>
</div>`;

PAGES['customer-request-invoice'] = () => `
<div class="page-content">
  <h1>Hoá đơn theo yêu cầu của khách hàng</h1>
  <p>QUÝ KHÁCH VUI LÒNG ĐIỀN ĐẦY ĐỦ CÁC MỤC SAU:</p>
  <ul>
    <li><strong>1. Mã đơn hàng:</strong> Điền mã đơn đã nhận qua email hoặc tin nhắn sau khi đặt hàng.</li>
    <li><strong>2. Số điện thoại mua hàng:</strong> Số điện thoại dùng để đặt đơn.</li>
    <li><strong>3. Mã số thuế:</strong> Mã số thuế của công ty cần xuất hóa đơn.</li>
    <li><strong>4. Tên công ty:</strong> Tên đầy đủ theo giấy phép kinh doanh.</li>
    <li><strong>5. Địa chỉ công ty:</strong> Ghi đúng địa chỉ đăng ký của công ty.</li>
    <li><strong>6. Email nhận hóa đơn:</strong> Hóa đơn điện tử sẽ gửi về địa chỉ email này.</li>
  </ul>
  <p>📌 <strong>Lưu ý:</strong></p>
  <ul>
    <li>Vui lòng gửi thông tin trong ngày đặt hàng để được hỗ trợ xuất hoá đơn.</li>
    <li>Nếu không có thông tin trong ngày, công ty sẽ xuất hoá đơn cá nhân.</li>
  </ul>
</div>`;

PAGES['about-us'] = () => `
<div class="about-hero">
  <div class="about-hero-content">
    <img src="${MEDIA.logo}" alt="WHENEVER Atelier" style="height:60px;margin:0 auto 30px;display:block;">
    <p>Consider us your style confidant, that friend who's always up for an adventure and encourages you to express yourself. We're right there with you, embracing a free-spirited life of spontaneity, creativity, and the simple joy of dressing up for yourself.</p>
  </div>
</div>
<div class="page-content">
  <p>Our collection is unisex and for everyone, we believe style knows no boundaries, neither of time, nor place, nor gender. Our designs are intentionally versatile and timeless, built on quality and clean aesthetics.</p>
  <p>At Whenever Atelier, we want fashion to be fun, free, and a little bit fearless. So go ahead and wear what makes you smile, try something new, or just throw on your favorite go-to piece. After all, the best outfit is the one you feel most yourself in — whenever and wherever that may be.</p>
</div>`;

PAGES['about'] = PAGES['about-us'];

PAGES['lien-he'] = () => `
<div class="page-content">
  <h1>Liên hệ</h1>
  <p style="text-align:center;margin-bottom:30px;">Feel free to reach out to us at any time. We're here to help with orders, product questions, and any feedback you may have.</p>
  <div class="contact-form">
    <div class="form-group"><label>Tên *</label><input type="text" placeholder="Tên của bạn" id="contact-name"></div>
    <div class="form-group"><label>Email *</label><input type="email" placeholder="Email" id="contact-email"></div>
    <div class="form-group"><label>Chủ đề</label>
      <select id="contact-topic"><option value="">Chọn chủ đề</option><option>Order status</option><option>Cancel or modify an order</option><option>Returns or exchanges</option><option>My order is missing</option><option>My order arrived damaged</option><option>Product questions</option><option>Other / General Inquiry</option></select>
    </div>
    <div class="form-group"><label>Tin nhắn *</label><textarea placeholder="Nội dung tin nhắn..." id="contact-message"></textarea></div>
    <button class="form-submit" type="button" onclick="alert('Cảm ơn bạn! Tin nhắn đã được gửi.')">Gửi</button>
  </div>
</div>`;

PAGES['faq'] = () => `
<div class="page-content">
  <h1>FAQ — Câu hỏi thường gặp</h1>
  <h2>Làm sao để đặt hàng?</h2>
  <p>Bạn có thể đặt hàng trực tiếp trên website whenever.vn, qua Instagram @whenever.atelier, hoặc đến trực tiếp cửa hàng.</p>
  <h2>Thời gian giao hàng mất bao lâu?</h2>
  <p>Đơn hàng nội thành TP.HCM: 1-2 ngày. Đơn hàng ngoại thành: 3-5 ngày làm việc.</p>
  <h2>Chính sách đổi trả như thế nào?</h2>
  <p>Chi tiết vui lòng xem tại trang <a href="#/pages/chinh-sach-doi-tra">Chính sách đổi trả</a>.</p>
  <h2>Làm sao để liên hệ?</h2>
  <p>Hotline: <strong>0911062050</strong> | Email: <strong>SUPPORT@WHENEVER.VN</strong> | Instagram: <strong>@whenever.atelier</strong></p>
</div>`;

PAGES['philanthropy'] = () => `
<div class="page-content" style="text-align:center;">
  <img src="${MEDIA.wheneverCare}" alt="Whenever Care" style="width:100%;max-width:600px;margin:0 auto 30px;border-radius:8px;">
  <h1>Whenever Care</h1>
  <p>At WHENEVER Atelier, we believe fashion should make a positive impact beyond style. Through our WHENEVER CARE initiative, we're committed to giving back to the community and supporting those in need.</p>
  <p>A portion of our proceeds goes toward supporting local communities and environmental initiatives.</p>
  <p>Follow our journey at <a href="https://www.instagram.com/whenever.atelier/" target="_blank">@whenever.atelier</a>.</p>
</div>`;

PAGES['whenever-membership-policy'] = () => `
<div class="page-content">
  <h1>Whenever Membership Policy</h1>
  <p>Chính sách thành viên WHENEVER Atelier giúp bạn tích lũy điểm và nhận ưu đãi đặc biệt khi mua sắm.</p>
  <h2>Cách tích điểm</h2>
  <p>Mỗi đơn hàng thành công sẽ được tích luỹ điểm thưởng.</p>
  <h2>Quyền lợi thành viên</h2>
  <ul>
    <li>Ưu đãi sinh nhật đặc biệt</li>
    <li>Truy cập sớm các bộ sưu tập mới</li>
    <li>Giảm giá độc quyền cho thành viên</li>
    <li>Miễn phí vận chuyển cho đơn hàng nhất định</li>
  </ul>
</div>`;

PAGES['thong-bao'] = () => `
<div class="page-content">
  <h1>Thông báo</h1>
  <p>Hiện tại không có thông báo mới. Vui lòng theo dõi các kênh chính thức của WHENEVER Atelier.</p>
</div>`;

// ===== COLLECTION PAGE =====
PAGES.collection = function(slug) {
  const col = COLLECTIONS.find(c => c.slug === slug);
  const title = col ? col.name : slug.toUpperCase().replace(/-/g,' ');
  const all = getAllProducts();
  const products = all.map(p => `
    <div class="product-card">
      <a href="#/products/${p.slug}">
        <div class="product-image">
          ${prodImg(p)}
          <div class="add-to-cart-overlay">Thêm vào giỏ</div>
        </div>
        <div class="product-info">
          <div class="brand-label">WHENEVER</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">${p.price}</div>
          <div class="product-type">${p.category}</div>
        </div>
      </a>
    </div>
  `).join('');
  return `
    <div class="collection-header"><h1>${title}</h1></div>
    <div class="collection-sort">
      <select><option>Sắp xếp</option><option>Giá: Thấp đến Cao</option><option>Giá: Cao đến Thấp</option><option>Mới nhất</option></select>
    </div>
    <div class="collection-grid">${products}</div>
  `;
};

// ===== SEARCH =====
PAGES.search = () => `
<div class="search-page">
  <h1>Tìm kiếm</h1>
  <div class="search-input-wrap">
    <input type="text" placeholder="Tìm kiếm sản phẩm..." id="page-search-input" autofocus>
  </div>
  <div id="search-results" style="padding-top:40px;"></div>
</div>`;

// ===== AUTH =====
PAGES.login = () => `
<div class="auth-page">
  <h1>Đăng nhập</h1>
  <div class="form-group"><label>Email</label><input type="email" placeholder="Email" id="login-email"></div>
  <div class="form-group"><label>Mật khẩu</label><input type="password" placeholder="Mật khẩu" id="login-password"></div>
  <button class="form-submit" type="button" style="margin-top:10px;">Đăng nhập</button>
  <a href="#/account/register" class="auth-link">Tạo tài khoản mới →</a>
</div>`;

PAGES.register = () => `
<div class="auth-page">
  <h1>Đăng kí</h1>
  <div class="form-group"><label>Họ</label><input type="text" placeholder="Họ"></div>
  <div class="form-group"><label>Tên</label><input type="text" placeholder="Tên"></div>
  <div class="form-group"><label>Email</label><input type="email" placeholder="Email"></div>
  <div class="form-group"><label>Mật khẩu</label><input type="password" placeholder="Mật khẩu"></div>
  <button class="form-submit" type="button" style="margin-top:10px;">Tạo tài khoản</button>
  <a href="#/account/login" class="auth-link">Đã có tài khoản? Đăng nhập →</a>
</div>`;

// ===== CART =====
PAGES.cart = () => `
<div class="cart-page">
  <h1>Giỏ hàng</h1>
  <div class="cart-notice">PHÍ SHIP DAO ĐỘNG TỪ 17K - 30K TÙY KHU VỰC VÀ GIÁ TRỊ ĐƠN HÀNG. LƯU Ý: PHÍ SHIP SẼ TỰ CHUYỂN QUA ĐVVC NÊN SẼ KHÔNG HIỂN THỊ BILL TRÊN WEBSITE ❤</div>
  <div class="cart-empty">
    <p>Giỏ hàng của bạn đang trống.</p>
    <a href="#/collections/all" class="buy-now-btn" style="display:inline-block;margin-top:20px;">Tiếp tục mua sắm</a>
  </div>
</div>`;
