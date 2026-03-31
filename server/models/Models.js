const mongoose = require('mongoose');

const VariantSchema = mongoose.Schema({
  id: Number,
  title: String,
  sku: String,
  variant_title: String,
}, { versionKey: false, _id: false });

// ===== SCHEMAS =====
const AdminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String,
  otpCode: String,
  otpExpiresAt: Number,
  otpSentAt: Number,
}, { versionKey: false });

const OrderCustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  name: String,
  phone: String,
  email: String,
}, { versionKey: false, _id: false });

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  price: Number,
  image: String,
  images: [String],
  description: String,
  sizes: [String],
  colors: [String],
  vendor: String,
  available: Boolean,
  productType: String,
  sourceUrl: String,
  sourceId: Number,
  sourcePlatform: String,
  importedAt: Number,
  origin: String,
  distributor: String,
  address: String,
  material: String,
  form: String,
  details: String,
  variants: [VariantSchema],
  cdate: Number,
  category: CategorySchema,
}, { versionKey: false });

const ItemSchema = mongoose.Schema({
  product: ProductSchema,
  quantity: Number,
}, { versionKey: false, _id: false });

const ShippingSchema = mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  country: String,
  addressLine: String,
  region: String,
  shippingMethod: String,
}, { versionKey: false, _id: false });

const PaymentSchema = mongoose.Schema({
  method: String,
  label: String,
}, { versionKey: false, _id: false });

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  total: Number,
  status: String,
  customer: OrderCustomerSchema,
  shipping: ShippingSchema,
  payment: PaymentSchema,
  note: String,
  invoiceRequested: Boolean,
  items: [ItemSchema],
}, { versionKey: false });

// ===== MODELS =====
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { Admin, Category, Customer, Product, Order };
