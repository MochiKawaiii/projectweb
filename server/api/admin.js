const express = require('express');
const { randomInt } = require('crypto');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');
const CryptoUtil = require('../utils/CryptoUtil');
const MyConstants = require('../utils/MyConstants');
// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const Models = require('../models/Models');

const normalizeText = (value = '') => value.trim();
const normalizeEmail = (value = '') => value.trim().toLowerCase();
const createOtpCode = () => String(randomInt(0, 10 ** Number(MyConstants.OTP_LENGTH || 6))).padStart(Number(MyConstants.OTP_LENGTH || 6), '0');
const createOtpHash = (otp) => CryptoUtil.md5(`otp:${otp}`);
const createOtpExpiry = () => Date.now() + Number(MyConstants.OTP_EXPIRES_MS || 600000);
const ORDER_STATUS_TRANSITIONS = {
  PENDING: ['APPROVED', 'CANCELED'],
  APPROVED: ['SHIPPING', 'CANCELED'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELED: [],
};

// ===== LOGIN =====
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// ===== CATEGORY =====
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, '-');
  const category = { name: name, slug: slug };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, '-');
  const category = { _id: _id, name: name, slug: slug };
  const result = await CategoryDAO.update(category);
  res.json(result);
});
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// ===== PRODUCT =====
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  var products = await ProductDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const price = req.body.price;
  const cid = req.body.category;
  const images = Array.isArray(req.body.images) ? req.body.images.filter(Boolean) : [];
  const image = req.body.image || images[0] || '';
  const description = req.body.description || '';
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = { name, slug, price, image, images, description, sizes, colors, cdate: now, category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const price = req.body.price;
  const cid = req.body.category;
  const images = Array.isArray(req.body.images) ? req.body.images.filter(Boolean) : [];
  const image = req.body.image || images[0] || '';
  const description = req.body.description || '';
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id, name, slug, price, image, images, description, sizes, colors, category };
  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// ===== ORDER =====
router.get('/dashboard/summary', JwtUtil.checkToken, async function (req, res) {
  try {
    const [
      orderSummary,
      totalProducts,
      totalCustomers,
      activeCustomers,
      totalCategories,
    ] = await Promise.all([
      OrderDAO.getDashboardSummary(),
      Models.Product.countDocuments({}).exec(),
      Models.Customer.countDocuments({}).exec(),
      Models.Customer.countDocuments({ active: 1 }).exec(),
      Models.Category.countDocuments({}).exec(),
    ]);

    res.json({
      stats: {
        totalOrders: orderSummary.totalOrders,
        pendingOrders: orderSummary.pendingOrders,
        approvedOrders: orderSummary.approvedOrders,
        shippingOrders: orderSummary.shippingOrders,
        deliveredOrders: orderSummary.deliveredOrders,
        canceledOrders: orderSummary.canceledOrders,
        totalRevenue: orderSummary.totalRevenue,
        totalProducts,
        totalCustomers,
        activeCustomers,
        totalCategories,
      },
      recentOrders: orderSummary.recentOrders,
    });
  } catch (error) {
    console.error('Admin dashboard summary error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load dashboard summary.' });
  }
});
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const newStatus = normalizeText(req.body.status).toUpperCase();

    if (!newStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required.' });
    }

    const order = await OrderDAO.selectByID(_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const currentStatus = String(order.status || 'PENDING').toUpperCase();
    const allowedStatuses = ORDER_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status transition from ${currentStatus} to ${newStatus}.`,
        currentStatus,
        allowedStatuses,
      });
    }

    const result = await OrderDAO.updateStatus(_id, newStatus);
    return res.json({
      success: true,
      message: `Order updated to ${newStatus}.`,
      order: result,
    });
  } catch (error) {
    console.error('Admin order status update error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to update order status.' });
  }
});
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// ===== CUSTOMER =====
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
router.post('/customers', JwtUtil.checkToken, async function (req, res) {
  const username = normalizeText(req.body.username);
  const password = normalizeText(req.body.password);
  const name = normalizeText(req.body.name);
  const phone = normalizeText(req.body.phone);
  const email = normalizeEmail(req.body.email);
  const active = Number(req.body.active || 0);

  if (!username || !password || !name || !phone || !email) {
    return res.json({ success: false, message: 'Please fill all required fields' });
  }

  const existed = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (existed) {
    return res.json({ success: false, message: 'Username or email already exists' });
  }

  const customer = {
    username,
    password,
    name,
    phone,
    email,
    active,
    token: '',
    otpCode: '',
    otpExpiresAt: 0,
    otpSentAt: 0,
  };
  const result = await CustomerDAO.insert(customer);
  res.json(result);
});
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = normalizeText(req.body.username);
  const password = normalizeText(req.body.password);
  const name = normalizeText(req.body.name);
  const phone = normalizeText(req.body.phone);
  const email = normalizeEmail(req.body.email);
  const active = Number(req.body.active || 0);

  if (!_id || !username || !password || !name || !phone || !email) {
    return res.json({ success: false, message: 'Please fill all required fields' });
  }

  const current = await CustomerDAO.selectByID(_id);
  if (!current) {
    return res.json({ success: false, message: 'Customer not found' });
  }

  const duplicated = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (duplicated && String(duplicated._id) !== String(_id)) {
    return res.json({ success: false, message: 'Username or email already exists' });
  }

  const customer = { _id, username, password, name, phone, email, active };
  const result = await CustomerDAO.adminUpdate(customer);
  res.json(result);
});
router.delete('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CustomerDAO.delete(_id);
  res.json(result);
});
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CustomerDAO.setActive(_id, 0);
  res.json(result);
});
router.put('/customers/active/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CustomerDAO.setActive(_id, 1);
  res.json(result);
});
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    if (cust.active === 1) {
      return res.json({ success: false, message: 'Customer is already active' });
    }

    const otp = createOtpCode();
    const otpCode = createOtpHash(otp);
    const otpExpiresAt = createOtpExpiry();
    await CustomerDAO.updateOtp(_id, otpCode, otpExpiresAt);

    const send = await EmailUtil.sendOtp(cust.email, otp, cust.name);
    if (send) { res.json({ success: true, message: 'OTP has been sent to customer email' }); }
    else { res.json({ success: false, message: 'Email failure' }); }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

module.exports = router;
