// ===== WHENEVER ATELIER — Data Layer =====

// === THEME / SECTION IMAGES ===
const MEDIA = {
  heroVideo: 'https://cdn.hstatic.net/files/200001023102/file/skate_la_03.mp4',
  heroPoster: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_banner_img_dt.png?v=1236',
  logo: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/logo.png?v=1236',
  footerLogo: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/footer_logo_img.png?v=1236',
  slide1: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_hp1_slide_img.png?v=1236',
  slide2: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_hp2_slide_img.png?v=1236',
  featuredProd1: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_hp1_prod_img.png?v=1236',
  featuredProd2: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_hp2_prod_img.png?v=1236',
  wheneverCare: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_iwc_img.png?v=1236',
  ugc: [
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_1.png?v=1236',
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_2.png?v=1236',
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_3.png?v=1236',
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_4.png?v=1236',
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_5.png?v=1236',
    'https://cdn.hstatic.net/themes/200001023102/1001450306/14/idx_ugc_img_6.png?v=1236',
  ],
  shareFb: 'https://cdn.hstatic.net/themes/200001023102/1001450306/14/share_fb_home.png?v=1236',
};

const PRODUCTS = {
  cloudline: [
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / BLACK FADED', category: 'LONGSLEEVE', price: '720,000₫', slug: 'whenever-cloudline-longsleeve-black', image: 'https://cdn.hstatic.net/products/200001023102/2b729649-a432-4639-91b4-fc583f926a74_c14eefeac1fa422d9d05499bc316bced.jpg' },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / PINK DUST', category: 'LONGSLEEVE', price: '720,000₫', slug: 'whenever-cloudline-longsleeve-pink', image: 'https://cdn.hstatic.net/products/200001023102/4038e578-931c-44ef-9567-d0e1a93063fc_4dc6d8a61e394a73abe3b6148ebfa33c.jpg' },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / SKY BLUE', category: 'LONGSLEEVE', price: '720,000₫', slug: 'whenever-cloudline-longsleeve-blue', image: 'https://cdn.hstatic.net/products/200001023102/c19fa024-4797-4861-bd59-197bb4a9592e_3abdf9a27d1a4b09b8ffbfe7e0e5947b.jpg' },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / WHITE', category: 'LONGSLEEVE', price: '720,000₫', slug: 'whenever-cloudline-longsleeve-white', image: 'https://cdn.hstatic.net/products/200001023102/b5494dd5-8187-4203-87be-7963ae3a6775_992d616ff5934606b030478f7de46a47.jpg' },
  ],
  slippers: [
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / BLACK', category: 'SLIPPERS', price: '350,000₫', slug: 'whenever-wa-splippers-black', image: 'https://cdn.hstatic.net/products/200001023102/c89a2b28-ef70-4d88-b54d-d3a0072cc93f_ed8da080ecd7487b84fe6c7c78fe81b1.jpg' },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / CREAM', category: 'SLIPPERS', price: '350,000₫', slug: 'whenever-wa-splippers-white', image: 'https://cdn.hstatic.net/products/200001023102/202ba18a-580b-4f26-82d7-b8feea77c73a_0c796730dd7f418fa25d523399075f74.jpg' },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / GREY', category: 'SLIPPERS', price: '350,000₫', slug: 'dep-whenever-wa-splippers-grey', image: 'https://cdn.hstatic.net/products/200001023102/043e1c3c-b5a5-47d1-b536-28ab4d298dbc_c148db9d8c544e41aafe056214375429.jpg' },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / SAND', category: 'SLIPPERS', price: '350,000₫', slug: 'dep-whenever-wa-splippers-sand', image: 'https://cdn.hstatic.net/products/200001023102/26384933-5469-437b-9972-31007b6295a7_8a81d245046b40f3bc1890cff23ebf75.jpg' },
  ],
  loungewear: [
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / BLACK', category: 'LOUNGEWEAR', price: '990,000₫', slug: 'whenever-set-satin-long-pajama-black', image: 'https://cdn.hstatic.net/products/200001023102/9b1e15cd-6e91-4b94-9883-358c0e2abc46_ced94f319c364291a8981bbe7cbab9a8.jpg' },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / BROWN', category: 'LOUNGEWEAR', price: '990,000₫', slug: 'whenever-set-satin-long-pajama-bronw', image: 'https://cdn.hstatic.net/products/200001023102/e51441ed-9898-4ca8-bf65-dbaa8b47f741_52c5c76ff02c412e96129f96ba9df7cd.jpg' },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / NAVY', category: 'LOUNGEWEAR', price: '990,000₫', slug: 'whenever-set-satin-long-pajama-navy', image: 'https://cdn.hstatic.net/products/200001023102/65c9f428-89de-4942-bc08-7e9f390362ec_0fc968923abc475aae99c0c44aaae8f4.jpg' },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / PINK', category: 'LOUNGEWEAR', price: '990,000₫', slug: 'whenever-set-satin-long-pajama-pink', image: 'https://cdn.hstatic.net/products/200001023102/2eb971ae-f2f3-4c14-80fa-ad2e1b8febd5_88db1e940d8446bcbef4c975ae7f86dd.jpg' },
  ],
  rawDenim: [
    { name: '"WHENEVER" STAR RAW DENIM JACKET / BLACK', category: 'RAW DENIM JACKET', price: '1,450,000₫', slug: 'whenever-star-raw-denim-jacket-black', image: 'https://cdn.hstatic.net/products/200001023102/9c2833cf-a06b-4aa7-90c5-0999625d2a1c_30bfdfcdd6a24343863e87a00b629754.jpg' },
    { name: '"WHENEVER" STAR RAW DENIM JACKET / BLUE', category: 'RAW DENIM JACKET', price: '1,450,000₫', slug: 'whenever-star-raw-denim-jacket-blue', image: 'https://cdn.hstatic.net/products/200001023102/b365ce97-8ed2-47c1-b848-09ae86ea7b32_f8c2fb8db5774e95b91a1c5e24709309.jpg' },
    { name: '"WHENEVER" STAR RAW DENIM PANTS / BLACK', category: 'RAW DENIM PANTS', price: '1,250,000₫', slug: 'whenever-star-raw-denim-pants-black', image: 'https://cdn.hstatic.net/products/200001023102/a265754d-50f7-424a-a46b-6b47f69e1dc1_a1bf3499ed634262ad8857d94243bc90.jpg' },
    { name: '"WHENEVER" STAR RAW DENIM PANTS / BLUE', category: 'RAW DENIM PANTS', price: '1,250,000₫', slug: 'whenever-star-raw-denim-pants-blue', image: 'https://cdn.hstatic.net/products/200001023102/7a3ff802-92b0-474e-89bc-4e44462ffc9a_833cc27965f64390abb27fa05752da55.jpg' },
  ],
  denim: [
    { name: '"WHENEVER" STAR WASH DENIM JACKET', category: 'DENIM JACKET', price: '1,450,000₫', slug: 'whenever-star-wash-denim-jacket', image: 'https://cdn.hstatic.net/products/200001023102/9a2a3c53-79f0-4cf9-872f-78b1dd163e70_903e05b2b72243fc960dd78df330ca93.jpg' },
    { name: '"WHENEVER" STAR WASH DENIM PANTS', category: 'DENIM PANTS', price: '1,250,000₫', slug: 'whenever-star-wash-denim-pants', image: 'https://cdn.hstatic.net/products/200001023102/72e9e5dc-613f-427e-9884-a299e015122e_997506e9ec6a4ed296dfa657bf021ae4.jpg' },
    { name: '\u201CWHENEVER\u201C BASIC DENIM JACKET / WASH BLUE', category: 'DENIM JACKET', price: '1,250,000₫', slug: 'whenever-basic-denim-jacket-wash-blue', image: 'https://cdn.hstatic.net/products/200001023102/21b5917f-d38f-4308-b9b2-99ca07483bb4_0de12211e58f47d3ab0976854842e237.jpg' },
    { name: '\u201CWHENEVER\u201C BASIC DENIM JEANS / WASH BLUE', category: 'DENIM PANTS', price: '1,050,000₫', slug: 'whenever-basic-denim-jeans-wash-blue', image: 'https://cdn.hstatic.net/products/200001023102/ec025f9c-6e8c-4123-a3b5-294391b2413d_a26e6000c37047749ffacadcdadefc6f.jpg' },
  ],
  active: [
    { name: '"WHENEVER" BASIC SPORTS SHORTS / BLACK', category: 'SHORTS', price: '720,000₫', slug: 'whenever-basic-sports-shorts-black', image: 'https://cdn.hstatic.net/products/200001023102/5e43dcba-d278-4972-b64d-64b843f8cc36_42899ea2cd37475da9ba3b6d2d40e045.jpg' },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / NAVY', category: 'SHORTS', price: '720,000₫', slug: 'whenever-basic-sports-shorts-navy', image: 'https://cdn.hstatic.net/products/200001023102/effb626a-10f9-4d49-81fa-1c974ad11ec9_3001df76a9a744dd8c54900ec9f3701c.jpg' },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / CHOCO', category: 'SHORTS', price: '720,000₫', slug: 'whenever-basic-sports-shorts-choco', image: 'https://cdn.hstatic.net/products/200001023102/ea4dade5-722f-47ea-9cf8-ebd3f88b16ee_a06639f7093144b3ad30c69071396a5a.jpg' },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / WHITE', category: 'SHORTS', price: '720,000₫', slug: 'whenever-basic-sports-shorts-white', image: 'https://cdn.hstatic.net/products/200001023102/1d7b7c0a-7e88-4e7d-9673-da45f9482a5a_70f2da6bc9244721a31e86f8b3c5a0f5.jpg' },
    { name: '"WHENEVER" FLATTERING BRA / BLACK', category: 'BRA', price: '550,000₫', slug: 'whenever-flattering-bra-black', image: 'https://cdn.hstatic.net/products/200001023102/870075ce-6073-41fd-95fa-332226b88107_67b6511a915f496d8c102220166c17fe.jpg' },
    { name: '"WHENEVER" FLATTERING BRA / OLIVE', category: 'BRA', price: '550,000₫', slug: 'whenever-flattering-bra-olive', image: 'https://cdn.hstatic.net/products/200001023102/1998f036-b74f-49d7-81b9-3cad8af4d69f_19be5586dcb84070b950cff85e0c67e7.jpg' },
    { name: '"WHENEVER" FLATTERING BRA / CHOCO', category: 'BRA', price: '550,000₫', slug: 'whenever-flattering-bra-choco', image: 'https://cdn.hstatic.net/products/200001023102/1e4c502e-b6e4-416c-8c09-d6606c9ce533_98e33af5bbd24fbbad907d6cec84048c.jpg' },
    { name: '"WHENEVER" FLATTERING HIGH-FLARE LEGGINGS / BLACK', category: 'LEGGINGS', price: '790,000₫', slug: 'whenever-flattering-high-flare-leggings-black', image: 'https://cdn.hstatic.net/products/200001023102/3041630a-b6fe-4bc4-bb28-9d4420faaf89_ed3587215d38425d988064bd17d5e086.jpg' },
  ],
};

const COLLECTIONS = [
  { name: 'WHENEVER', slug: 'best-seller' },
  { name: 'NEW', slug: 'new-arrival' },
  { name: 'WHENEVER ACTIVE', slug: 'whenever-active' },
  { name: 'TEE', slug: 'tee-shirt' },
  { name: 'CLOUDLINE', slug: 'cloudline' },
  { name: 'FLANNEL', slug: 'so-mi' },
  { name: 'RAW DENIM', slug: 'raw-denim' },
  { name: 'LOUNGEWEAR', slug: 'loungewear' },
  { name: 'SLIPPERS', slug: 'dep' },
  { name: 'KNIT', slug: 'knit' },
  { name: 'ORIGIN', slug: 'whenever-origin' },
  { name: 'BOMBER', slug: 'bomber' },
  { name: 'HOODIE', slug: 'sweatshirt' },
  { name: 'JACKET', slug: 'ao-khoac' },
  { name: 'DENIM', slug: 'denim' },
  { name: 'PANTS', slug: 'bottoms' },
  { name: 'SHORTS', slug: 'shorts' },
  { name: 'COMBO', slug: 'combo' },
  { name: 'ACCESSORIES', slug: 'accessories' },
  { name: 'HANDMADE', slug: 'handmade' },
  { name: 'VEST', slug: 'blazer' },
];

const SHOP_CATEGORIES_VN = [
  { name: 'COMBO', slug: 'combo' },
  { name: 'SẢN PHẨM MỚI', slug: 'new-arrival' },
  { name: 'ÁO LEN', slug: 'ao-len' },
  { name: 'ÁO THUN', slug: 'tee-shirt' },
  { name: 'ÁO KHOÁC', slug: 'ao-khoac' },
  { name: 'SƠ MI', slug: 'so-mi' },
  { name: 'ÁO KHOÁC NỈ', slug: 'sweatshirt' },
  { name: 'QUẦN DÀI', slug: 'bottoms' },
  { name: 'QUẦN NGẮN', slug: 'shorts' },
  { name: 'ÁO VEST', slug: 'blazer' },
  { name: 'HANDMADE', slug: 'handmade' },
  { name: 'PHỤ KIỆN', slug: 'accessories' },
  { name: 'WHENEVER ORIGIN', slug: 'whenever-origin' },
  { name: 'LOUNGEWEAR', slug: 'loungewear' },
  { name: 'RAW DENIM', slug: 'raw-denim' },
  { name: 'BOMBER', slug: 'bomber' },
  { name: 'DÉP', slug: 'dep' },
  { name: 'BEST SELLER', slug: 'best-seller' },
  { name: 'CLOUDLINE', slug: 'cloudline' },
  { name: 'Whenever Active', slug: 'whenever-active' },
  { name: 'KNIT', slug: 'knit' },
];

const FOOTER_NAV = {
  navigate: [
    { name: 'Tìm kiếm', hash: '#/search' },
    { name: 'Giới thiệu', hash: '#/pages/about-us' },
    { name: 'Chính sách đổi trả', hash: '#/pages/chinh-sach-doi-tra' },
    { name: 'Liên hệ', hash: '#/pages/lien-he' },
    { name: 'Chính sách bảo mật', hash: '#/pages/chinh-sach-bao-mat' },
    { name: 'Điều khoản dịch vụ', hash: '#/pages/dieu-khoan-dich-vu' },
    { name: 'Hóa đơn theo yêu cầu của khách hàng', hash: '#/pages/customer-request-invoice' },
  ],
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/whenever.atelier/' },
    { name: 'Youtube', url: 'https://www.youtube.com/@WheneverAtelier' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@whenever.atelier' },
  ],
  official: [
    { name: 'Hoá đơn theo yêu cầu của khách hàng', hash: '#/pages/customer-request-invoice' },
    { name: 'Chính sách đổi trả', hash: '#/pages/chinh-sach-doi-tra' },
    { name: 'Chính sách vận chuyển', hash: '#/pages/chinh-sach-van-chuyen' },
    { name: 'Chính sách kiểm hàng', hash: '#/pages/chinh-sach-kiem-hang' },
    { name: 'Chính sách bảo mật', hash: '#/pages/chinh-sach-bao-mat' },
    { name: 'Chính sách thanh toán', hash: '#/pages/chinh-sach-thanh-toan' },
  ],
};

function getAllProducts() {
  const all = [];
  Object.values(PRODUCTS).forEach(arr => all.push(...arr));
  return all;
}
