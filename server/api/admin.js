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

const normalizeText = (value = '') => value.trim();
const normalizeEmail = (value = '') => value.trim().toLowerCase();
const createOtpCode = () => String(randomInt(0, 10 ** Number(MyConstants.OTP_LENGTH || 6))).padStart(Number(MyConstants.OTP_LENGTH || 6), '0');
const createOtpHash = (otp) => CryptoUtil.md5(`otp:${otp}`);
const createOtpExpiry = () => Date.now() + Number(MyConstants.OTP_EXPIRES_MS || 600000);

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
  const image = req.body.image;
  const description = req.body.description || '';
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = { name, slug, price, image, description, sizes, colors, cdate: now, category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const description = req.body.description || '';
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id, name, slug, price, image, description, sizes, colors, category };
  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// ===== ORDER =====
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
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
