// ===== WHENEVER ATELIER — Database Seed Script =====
// Run: node seed.js
// This script auto-populates MongoDB with categories, products, and admin account.

const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const CryptoUtil = require('./utils/CryptoUtil');

const uri = MyConstants.DB_URI;

// ===== Schemas (inline) =====
const AdminSchema = mongoose.Schema({ _id: mongoose.Schema.Types.ObjectId, username: String, password: String }, { versionKey: false });
const CategorySchema = mongoose.Schema({ _id: mongoose.Schema.Types.ObjectId, name: String, slug: String }, { versionKey: false });
const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, name: String, slug: String, price: Number,
  image: String, description: String, sizes: [String], colors: [String],
  cdate: Number, category: CategorySchema
}, { versionKey: false });

const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

// ===== DATA =====
const CATEGORIES_DATA = [
  { name: 'Cloudline', slug: 'cloudline' },
  { name: 'Slippers', slug: 'dep' },
  { name: 'Loungewear', slug: 'loungewear' },
  { name: 'Raw Denim', slug: 'raw-denim' },
  { name: 'Denim', slug: 'denim' },
  { name: 'Active', slug: 'whenever-active' },
];

const PRODUCTS_DATA = {
  'Cloudline': [
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / BLACK FADED', price: 720000, slug: 'whenever-cloudline-longsleeve-black', image: 'https://cdn.hstatic.net/products/200001023102/2b729649-a432-4639-91b4-fc583f926a74_c14eefeac1fa422d9d05499bc316bced.jpg', description: 'Cotton 85% – Linen 15%. Cloudline Collection.', sizes: ['S','M','L','XL'], colors: ['Black'] },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / PINK DUST', price: 720000, slug: 'whenever-cloudline-longsleeve-pink', image: 'https://cdn.hstatic.net/products/200001023102/4038e578-931c-44ef-9567-d0e1a93063fc_4dc6d8a61e394a73abe3b6148ebfa33c.jpg', description: 'Cotton 85% – Linen 15%. Cloudline Collection.', sizes: ['S','M','L','XL'], colors: ['Pink'] },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / SKY BLUE', price: 720000, slug: 'whenever-cloudline-longsleeve-blue', image: 'https://cdn.hstatic.net/products/200001023102/c19fa024-4797-4861-bd59-197bb4a9592e_3abdf9a27d1a4b09b8ffbfe7e0e5947b.jpg', description: 'Cotton 85% – Linen 15%. Cloudline Collection.', sizes: ['S','M','L','XL'], colors: ['Blue'] },
    { name: '\u201CWHENEVER\u201C CLOUDLINE LONGSLEEVE / WHITE', price: 720000, slug: 'whenever-cloudline-longsleeve-white', image: 'https://cdn.hstatic.net/products/200001023102/b5494dd5-8187-4203-87be-7963ae3a6775_992d616ff5934606b030478f7de46a47.jpg', description: 'Cotton 85% – Linen 15%. Cloudline Collection.', sizes: ['S','M','L','XL'], colors: ['White'] },
  ],
  'Slippers': [
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / BLACK', price: 350000, slug: 'whenever-wa-splippers-black', image: 'https://cdn.hstatic.net/products/200001023102/c89a2b28-ef70-4d88-b54d-d3a0072cc93f_ed8da080ecd7487b84fe6c7c78fe81b1.jpg', description: 'Dép WHENEVER WA Slippers cao cấp.', sizes: ['39','40','41','42','43'], colors: ['Black'] },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / CREAM', price: 350000, slug: 'whenever-wa-splippers-white', image: 'https://cdn.hstatic.net/products/200001023102/202ba18a-580b-4f26-82d7-b8feea77c73a_0c796730dd7f418fa25d523399075f74.jpg', description: 'Dép WHENEVER WA Slippers cao cấp.', sizes: ['39','40','41','42','43'], colors: ['Cream'] },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / GREY', price: 350000, slug: 'dep-whenever-wa-splippers-grey', image: 'https://cdn.hstatic.net/products/200001023102/043e1c3c-b5a5-47d1-b536-28ab4d298dbc_c148db9d8c544e41aafe056214375429.jpg', description: 'Dép WHENEVER WA Slippers cao cấp.', sizes: ['39','40','41','42','43'], colors: ['Grey'] },
    { name: 'ĐÔI DÉP "WHENEVER" WA SLIPPERS / SAND', price: 350000, slug: 'dep-whenever-wa-splippers-sand', image: 'https://cdn.hstatic.net/products/200001023102/26384933-5469-437b-9972-31007b6295a7_8a81d245046b40f3bc1890cff23ebf75.jpg', description: 'Dép WHENEVER WA Slippers cao cấp.', sizes: ['39','40','41','42','43'], colors: ['Sand'] },
  ],
  'Loungewear': [
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / BLACK', price: 990000, slug: 'whenever-set-satin-long-pajama-black', image: 'https://cdn.hstatic.net/products/200001023102/9b1e15cd-6e91-4b94-9883-358c0e2abc46_ced94f319c364291a8981bbe7cbab9a8.jpg', description: 'Bộ Satin Long Pajama cao cấp từ WHENEVER Atelier.', sizes: ['S','M','L','XL'], colors: ['Black'] },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / BROWN', price: 990000, slug: 'whenever-set-satin-long-pajama-bronw', image: 'https://cdn.hstatic.net/products/200001023102/e51441ed-9898-4ca8-bf65-dbaa8b47f741_52c5c76ff02c412e96129f96ba9df7cd.jpg', description: 'Bộ Satin Long Pajama cao cấp từ WHENEVER Atelier.', sizes: ['S','M','L','XL'], colors: ['Brown'] },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / NAVY', price: 990000, slug: 'whenever-set-satin-long-pajama-navy', image: 'https://cdn.hstatic.net/products/200001023102/65c9f428-89de-4942-bc08-7e9f390362ec_0fc968923abc475aae99c0c44aaae8f4.jpg', description: 'Bộ Satin Long Pajama cao cấp từ WHENEVER Atelier.', sizes: ['S','M','L','XL'], colors: ['Navy'] },
    { name: '"WHENEVER" BỘ ÁO VÀ QUẦN DÀI SATIN LONG PAJAMA / PINK', price: 990000, slug: 'whenever-set-satin-long-pajama-pink', image: 'https://cdn.hstatic.net/products/200001023102/2eb971ae-f2f3-4c14-80fa-ad2e1b8febd5_88db1e940d8446bcbef4c975ae7f86dd.jpg', description: 'Bộ Satin Long Pajama cao cấp từ WHENEVER Atelier.', sizes: ['S','M','L','XL'], colors: ['Pink'] },
  ],
  'Raw Denim': [
    { name: '"WHENEVER" STAR RAW DENIM JACKET / BLACK', price: 1450000, slug: 'whenever-star-raw-denim-jacket-black', image: 'https://cdn.hstatic.net/products/200001023102/9c2833cf-a06b-4aa7-90c5-0999625d2a1c_30bfdfcdd6a24343863e87a00b629754.jpg', description: 'Premium Star Raw Denim Jacket.', sizes: ['S','M','L','XL'], colors: ['Black'] },
    { name: '"WHENEVER" STAR RAW DENIM JACKET / BLUE', price: 1450000, slug: 'whenever-star-raw-denim-jacket-blue', image: 'https://cdn.hstatic.net/products/200001023102/b365ce97-8ed2-47c1-b848-09ae86ea7b32_f8c2fb8db5774e95b91a1c5e24709309.jpg', description: 'Premium Star Raw Denim Jacket.', sizes: ['S','M','L','XL'], colors: ['Blue'] },
    { name: '"WHENEVER" STAR RAW DENIM PANTS / BLACK', price: 1250000, slug: 'whenever-star-raw-denim-pants-black', image: 'https://cdn.hstatic.net/products/200001023102/a265754d-50f7-424a-a46b-6b47f69e1dc1_a1bf3499ed634262ad8857d94243bc90.jpg', description: 'Premium Star Raw Denim Pants.', sizes: ['S','M','L','XL'], colors: ['Black'] },
    { name: '"WHENEVER" STAR RAW DENIM PANTS / BLUE', price: 1250000, slug: 'whenever-star-raw-denim-pants-blue', image: 'https://cdn.hstatic.net/products/200001023102/7a3ff802-92b0-474e-89bc-4e44462ffc9a_833cc27965f64390abb27fa05752da55.jpg', description: 'Premium Star Raw Denim Pants.', sizes: ['S','M','L','XL'], colors: ['Blue'] },
  ],
  'Denim': [
    { name: '"WHENEVER" STAR WASH DENIM JACKET', price: 1450000, slug: 'whenever-star-wash-denim-jacket', image: 'https://cdn.hstatic.net/products/200001023102/9a2a3c53-79f0-4cf9-872f-78b1dd163e70_903e05b2b72243fc960dd78df330ca93.jpg', description: 'Star Wash Denim Jacket.', sizes: ['S','M','L','XL'], colors: ['Wash'] },
    { name: '"WHENEVER" STAR WASH DENIM PANTS', price: 1250000, slug: 'whenever-star-wash-denim-pants', image: 'https://cdn.hstatic.net/products/200001023102/72e9e5dc-613f-427e-9884-a299e015122e_997506e9ec6a4ed296dfa657bf021ae4.jpg', description: 'Star Wash Denim Pants.', sizes: ['S','M','L','XL'], colors: ['Wash'] },
    { name: '\u201CWHENEVER\u201C BASIC DENIM JACKET / WASH BLUE', price: 1250000, slug: 'whenever-basic-denim-jacket-wash-blue', image: 'https://cdn.hstatic.net/products/200001023102/21b5917f-d38f-4308-b9b2-99ca07483bb4_0de12211e58f47d3ab0976854842e237.jpg', description: 'Basic Denim Jacket.', sizes: ['S','M','L','XL'], colors: ['Wash Blue'] },
    { name: '\u201CWHENEVER\u201C BASIC DENIM JEANS / WASH BLUE', price: 1050000, slug: 'whenever-basic-denim-jeans-wash-blue', image: 'https://cdn.hstatic.net/products/200001023102/ec025f9c-6e8c-4123-a3b5-294391b2413d_a26e6000c37047749ffacadcdadefc6f.jpg', description: 'Basic Denim Jeans.', sizes: ['S','M','L','XL'], colors: ['Wash Blue'] },
  ],
  'Active': [
    { name: '"WHENEVER" BASIC SPORTS SHORTS / BLACK', price: 720000, slug: 'whenever-basic-sports-shorts-black', image: 'https://cdn.hstatic.net/products/200001023102/5e43dcba-d278-4972-b64d-64b843f8cc36_42899ea2cd37475da9ba3b6d2d40e045.jpg', description: 'Basic Sports Shorts.', sizes: ['S','M','L','XL'], colors: ['Black'] },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / NAVY', price: 720000, slug: 'whenever-basic-sports-shorts-navy', image: 'https://cdn.hstatic.net/products/200001023102/effb626a-10f9-4d49-81fa-1c974ad11ec9_3001df76a9a744dd8c54900ec9f3701c.jpg', description: 'Basic Sports Shorts.', sizes: ['S','M','L','XL'], colors: ['Navy'] },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / CHOCO', price: 720000, slug: 'whenever-basic-sports-shorts-choco', image: 'https://cdn.hstatic.net/products/200001023102/ea4dade5-722f-47ea-9cf8-ebd3f88b16ee_a06639f7093144b3ad30c69071396a5a.jpg', description: 'Basic Sports Shorts.', sizes: ['S','M','L','XL'], colors: ['Choco'] },
    { name: '"WHENEVER" BASIC SPORTS SHORTS / WHITE', price: 720000, slug: 'whenever-basic-sports-shorts-white', image: 'https://cdn.hstatic.net/products/200001023102/1d7b7c0a-7e88-4e7d-9673-da45f9482a5a_70f2da6bc9244721a31e86f8b3c5a0f5.jpg', description: 'Basic Sports Shorts.', sizes: ['S','M','L','XL'], colors: ['White'] },
    { name: '"WHENEVER" FLATTERING BRA / BLACK', price: 550000, slug: 'whenever-flattering-bra-black', image: 'https://cdn.hstatic.net/products/200001023102/870075ce-6073-41fd-95fa-332226b88107_67b6511a915f496d8c102220166c17fe.jpg', description: 'Flattering Bra.', sizes: ['S','M','L'], colors: ['Black'] },
    { name: '"WHENEVER" FLATTERING BRA / OLIVE', price: 550000, slug: 'whenever-flattering-bra-olive', image: 'https://cdn.hstatic.net/products/200001023102/1998f036-b74f-49d7-81b9-3cad8af4d69f_19be5586dcb84070b950cff85e0c67e7.jpg', description: 'Flattering Bra.', sizes: ['S','M','L'], colors: ['Olive'] },
    { name: '"WHENEVER" FLATTERING BRA / CHOCO', price: 550000, slug: 'whenever-flattering-bra-choco', image: 'https://cdn.hstatic.net/products/200001023102/1e4c502e-b6e4-416c-8c09-d6606c9ce533_98e33af5bbd24fbbad907d6cec84048c.jpg', description: 'Flattering Bra.', sizes: ['S','M','L'], colors: ['Choco'] },
    { name: '"WHENEVER" FLATTERING HIGH-FLARE LEGGINGS / BLACK', price: 790000, slug: 'whenever-flattering-high-flare-leggings-black', image: 'https://cdn.hstatic.net/products/200001023102/3041630a-b6fe-4bc4-bb28-9d4420faaf89_ed3587215d38425d988064bd17d5e086.jpg', description: 'Flattering High-Flare Leggings.', sizes: ['S','M','L','XL'], colors: ['Black'] },
  ],
};

// ===== SEED FUNCTION =====
async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB!\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('   Done.\n');

    // 1. Insert Admin
    console.log('👤 Creating admin account...');
    const admin = await Admin.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'admin',
      password: 'admin' // plain text for now (labs don't hash)
    });
    console.log('   ✅ Admin created: ' + admin.username + '\n');

    // 2. Insert Categories
    console.log('📁 Creating categories...');
    const categoryMap = {};
    for (const catData of CATEGORIES_DATA) {
      const cat = await Category.create({
        _id: new mongoose.Types.ObjectId(),
        name: catData.name,
        slug: catData.slug,
      });
      categoryMap[catData.name] = cat;
      console.log('   ✅ ' + cat.name);
    }
    console.log('   Total: ' + Object.keys(categoryMap).length + ' categories\n');

    // 3. Insert Products
    console.log('📦 Creating products...');
    let productCount = 0;
    const now = new Date().getTime();
    for (const [catName, products] of Object.entries(PRODUCTS_DATA)) {
      const category = categoryMap[catName];
      for (const p of products) {
        await Product.create({
          _id: new mongoose.Types.ObjectId(),
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: p.image,
          description: p.description || '',
          sizes: p.sizes || [],
          colors: p.colors || [],
          cdate: now - (productCount * 86400000), // stagger dates
          category: { _id: category._id, name: category.name, slug: category.slug },
        });
        productCount++;
        console.log('   ✅ ' + p.name);
      }
    }
    console.log('\n   Total: ' + productCount + ' products');

    console.log('\n🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin login:  username="admin"  password="admin"');
    console.log('Categories:   ' + CATEGORIES_DATA.length);
    console.log('Products:     ' + productCount);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
