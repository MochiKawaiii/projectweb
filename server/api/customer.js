const express = require('express');
const { randomInt } = require('crypto');
const router = express.Router();

const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
const MyConstants = require('../utils/MyConstants');

const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const AdminDAO = require('../models/AdminDAO');

const normalizeText = (value = '') => value.trim();
const normalizeEmail = (value = '') => value.trim().toLowerCase();
const normalizeOtp = (value = '') => value.replace(/\D/g, '').slice(0, Number(MyConstants.OTP_LENGTH || 6));
const createOtpCode = () => String(randomInt(0, 10 ** Number(MyConstants.OTP_LENGTH || 6))).padStart(Number(MyConstants.OTP_LENGTH || 6), '0');
const createOtpHash = (otp) => CryptoUtil.md5(`otp:${otp}`);
const createOtpExpiry = () => Date.now() + Number(MyConstants.OTP_EXPIRES_MS || 600000);

// ===== CATEGORY =====
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// ===== PRODUCT =====
router.get('/products/new', async function (req, res) {
  try {
    const products = await ProductDAO.selectTopNew(4);
    res.json(products);
  } catch (e) {
    res.status(500).json([]);
  }
});

router.get('/products/hot', async function (req, res) {
  try {
    const products = await ProductDAO.selectTopHot(4);
    res.json(products);
  } catch (e) {
    res.status(500).json([]);
  }
});

router.get('/products/category/:cid', async function (req, res) {
  try {
    const _cid = req.params.cid;
    const products = _cid === 'all' ? await ProductDAO.selectAll() : await ProductDAO.selectByCatID(_cid);
    res.json(products);
  } catch (e) {
    res.status(500).json([]);
  }
});

router.get('/products/search/:keyword', async function (req, res) {
  try {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
  } catch (e) {
    res.status(500).json([]);
  }
});

router.get('/products/:id', async function (req, res) {
  try {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
  } catch (e) {
    res.status(500).json(null);
  }
});

// ===== CUSTOMER AUTH =====
router.post('/signup', async function (req, res) {
  try {
    const username = normalizeText(req.body.username);
    const password = normalizeText(req.body.password);
    const name = normalizeText(req.body.name);
    const phone = normalizeText(req.body.phone);
    const email = normalizeEmail(req.body.email);

    if (!username || !password || !name || !phone || !email) {
      return res.json({ success: false, message: 'Please fill all required fields.' });
    }

    if (!EmailUtil.isConfigured()) {
      return res.json({ success: false, message: 'Email service is not configured yet.' });
    }

    const existingByUsername = await CustomerDAO.selectByUsername(username);
    const existingByEmail = await CustomerDAO.selectByEmail(email);

    if ((existingByUsername && existingByUsername.active === 1) || (existingByEmail && existingByEmail.active === 1)) {
      return res.json({ success: false, message: 'Username or email already exists.' });
    }

    if (
      existingByUsername
      && existingByEmail
      && String(existingByUsername._id) !== String(existingByEmail._id)
    ) {
      return res.json({ success: false, message: 'Username or email already exists.' });
    }

    const otp = createOtpCode();
    const otpCode = createOtpHash(otp);
    const otpExpiresAt = createOtpExpiry();
    const pendingCustomer = {
      username,
      password,
      name,
      phone,
      email,
      active: 0,
      token: '',
      otpCode,
      otpExpiresAt,
      otpSentAt: Date.now(),
    };

    const existingPendingCustomer = existingByEmail || existingByUsername;
    const result = existingPendingCustomer
      ? await CustomerDAO.updatePendingSignup({ _id: existingPendingCustomer._id, ...pendingCustomer })
      : await CustomerDAO.insert(pendingCustomer);

    if (!result) {
      return res.json({ success: false, message: 'Unable to save account right now.' });
    }

    const sent = await EmailUtil.sendOtp(email, otp, name);
    if (!sent) {
      return res.json({
        success: true,
        requiresActivation: true,
        email,
        message: 'Account saved, but OTP email could not be sent. Please use resend OTP.',
      });
    }

    return res.json({
      success: true,
      requiresActivation: true,
      email,
      message: 'A 6-digit OTP has been sent to your email.',
    });
  } catch (error) {
    console.error('Customer signup error:', error.message);
    res.status(500).json({ success: false, message: 'Signup failed.' });
  }
});

router.post('/active', async function (req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = normalizeOtp(req.body.otp);

    if (!email || otp.length !== Number(MyConstants.OTP_LENGTH || 6)) {
      return res.json({ success: false, message: 'Please enter your email and the 6-digit OTP.' });
    }

    const result = await CustomerDAO.activateByEmailAndOtp(email, createOtpHash(otp));
    if (result) {
      return res.json({ success: true, message: 'Your account has been verified. You can login now.' });
    }

    const customer = await CustomerDAO.selectByEmail(email);
    if (!customer) {
      return res.json({ success: false, message: 'Account not found.' });
    }
    if (customer.active === 1) {
      return res.json({ success: false, message: 'This account has already been verified.' });
    }
    if (Number(customer.otpExpiresAt || 0) < Date.now()) {
      return res.json({ success: false, message: 'OTP expired. Please request a new code.' });
    }
    return res.json({ success: false, message: 'Invalid OTP code.' });
  } catch (error) {
    console.error('Customer activation error:', error.message);
    res.status(500).json({ success: false, message: 'OTP verification failed.' });
  }
});

router.post('/active/resend', async function (req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.json({ success: false, message: 'Please enter your email address.' });
    }

    if (!EmailUtil.isConfigured()) {
      return res.json({ success: false, message: 'Email service is not configured yet.' });
    }

    const customer = await CustomerDAO.selectByEmail(email);
    if (!customer) {
      return res.json({ success: false, message: 'Account not found.' });
    }
    if (customer.active === 1) {
      return res.json({ success: false, message: 'This account has already been verified.' });
    }

    const otp = createOtpCode();
    const otpCode = createOtpHash(otp);
    const otpExpiresAt = createOtpExpiry();
    await CustomerDAO.updateOtp(customer._id, otpCode, otpExpiresAt);

    const sent = await EmailUtil.sendOtp(email, otp, customer.name);
    if (!sent) {
      return res.json({ success: false, message: 'Unable to resend OTP right now.' });
    }

    return res.json({ success: true, message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error('Customer resend OTP error:', error.message);
    res.status(500).json({ success: false, message: 'Resend OTP failed.' });
  }
});

router.post('/login', async function (req, res) {
  try {
    const username = normalizeText(req.body.username);
    const password = normalizeText(req.body.password);

    if (!username || !password) {
      return res.json({ success: false, message: 'Please input username/email and password.' });
    }

    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(admin.username, admin.password);
      return res.json({
        success: true,
        role: 'admin',
        message: 'Admin authentication successful.',
        token,
        admin: { username: admin.username },
      });
    }

    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (!customer) {
      return res.json({ success: false, message: 'Incorrect username, email, or password.' });
    }

    if (customer.active !== 1) {
      return res.json({ success: false, message: 'Account is not verified yet. Please complete OTP verification.' });
    }

    const token = JwtUtil.genToken(customer.username, customer.password);
    res.json({ success: true, role: 'customer', message: 'Authentication successful.', token, customer });
  } catch (error) {
    console.error('Customer login error:', error.message);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token });
});

// ===== MYPROFILE =====
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const customer = { _id, username, password, name, phone, email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

// ===== CHECKOUT =====
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  try {
    const now = new Date().getTime();
    const total = Number(req.body.total || 0);
    const items = Array.isArray(req.body.items)
      ? req.body.items
        .map((item) => ({
          product: item.product,
          quantity: Number(item.quantity || 0),
        }))
        .filter((item) => item.product && item.quantity > 0)
      : [];
    const customerInput = req.body.customer || {};
    const shippingInput = req.body.shipping || {};
    const note = normalizeText(req.body.note);
    const invoiceRequested = Boolean(req.body.invoiceRequested);

    const customer = {
      _id: customerInput._id,
      username: normalizeText(customerInput.username),
      name: normalizeText(customerInput.name),
      phone: normalizeText(customerInput.phone),
      email: normalizeEmail(customerInput.email),
    };

    const shipping = {
      fullName: normalizeText(shippingInput.fullName || customer.name),
      phone: normalizeText(shippingInput.phone || customer.phone),
      email: normalizeEmail(shippingInput.email || customer.email),
      country: normalizeText(shippingInput.country || 'Vietnam'),
      addressLine: normalizeText(shippingInput.addressLine),
      region: normalizeText(shippingInput.region),
      shippingMethod: normalizeText(shippingInput.shippingMethod || 'Giao hang tan noi'),
    };

    const payment = {
      method: 'COD',
      label: 'Thanh toan khi giao hang (COD)',
    };

    if (!customer._id || items.length === 0 || total <= 0) {
      return res.status(400).json({ success: false, message: 'Cart data is invalid.' });
    }

    if (!shipping.fullName || !shipping.phone || !shipping.email || !shipping.addressLine || !shipping.region) {
      return res.status(400).json({ success: false, message: 'Please complete shipping information.' });
    }

    const order = {
      cdate: now,
      total,
      status: 'PENDING',
      customer,
      shipping,
      payment,
      note,
      invoiceRequested,
      items,
    };
    const result = await OrderDAO.insert(order);
    res.json(result);
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ success: false, message: 'Checkout failed.' });
  }
});

// ===== MYORDERS =====
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

router.put('/orders/cancel/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const authCustomer = await CustomerDAO.selectByUsernameAndPassword(req.decoded.username, req.decoded.password);

    if (!authCustomer) {
      return res.status(401).json({ success: false, message: 'Authentication failed.' });
    }

    const order = await OrderDAO.selectByID(_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (String(order.customer?._id || '') !== String(authCustomer._id)) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own orders.' });
    }

    if (String(order.status || 'PENDING').toUpperCase() !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be canceled.' });
    }

    const result = await OrderDAO.cancelPendingByCustomer(_id, authCustomer._id);
    if (!result) {
      return res.status(400).json({ success: false, message: 'Unable to cancel this order.' });
    }

    return res.json({
      success: true,
      message: 'Order canceled successfully.',
      order: result,
    });
  } catch (error) {
    console.error('Customer cancel order error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to cancel order right now.' });
  }
});

module.exports = router;
