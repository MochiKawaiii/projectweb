require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('./Models');

const normalizeText = (value = '') => value.trim();
const normalizeEmail = (value = '') => value.trim().toLowerCase();

const CustomerDAO = {
  async selectAll() {
    const customers = await Models.Customer.find({}).exec();
    return customers;
  },

  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  async selectByUsername(username) {
    const customer = await Models.Customer.findOne({ username: normalizeText(username) }).exec();
    return customer;
  },

  async selectByEmail(email) {
    const customer = await Models.Customer.findOne({ email: normalizeEmail(email) }).exec();
    return customer;
  },

  async selectByUsernameOrEmail(username, email) {
    const query = {
      $or: [
        { username: normalizeText(username) },
        { email: normalizeEmail(email) },
      ],
    };
    const customer = await Models.Customer.findOne(query).exec();
    return customer;
  },

  async selectByUsernameAndPassword(usernameOrEmail, password) {
    const identifier = normalizeText(usernameOrEmail);
    const query = {
      password,
      $or: [
        { username: identifier },
        { email: normalizeEmail(identifier) },
      ],
    };
    const customer = await Models.Customer.findOne(query).exec();
    return customer;
  },

  async insert(customer) {
    const payload = {
      ...customer,
      _id: customer._id || new mongoose.Types.ObjectId(),
      username: normalizeText(customer.username),
      name: normalizeText(customer.name),
      phone: normalizeText(customer.phone),
      email: normalizeEmail(customer.email),
      otpCode: customer.otpCode || '',
      otpExpiresAt: Number(customer.otpExpiresAt || 0),
      otpSentAt: Number(customer.otpSentAt || 0),
    };
    const result = await Models.Customer.create(payload);
    return result;
  },

  async update(customer) {
    const newvalues = {
      username: normalizeText(customer.username),
      password: customer.password,
      name: normalizeText(customer.name),
      phone: normalizeText(customer.phone),
      email: normalizeEmail(customer.email),
    };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },

  async adminUpdate(customer) {
    const newvalues = {
      username: normalizeText(customer.username),
      password: customer.password,
      name: normalizeText(customer.name),
      phone: normalizeText(customer.phone),
      email: normalizeEmail(customer.email),
      active: Number(customer.active || 0),
    };

    if (Number(customer.active || 0) === 1) {
      newvalues.token = '';
      newvalues.otpCode = '';
      newvalues.otpExpiresAt = 0;
      newvalues.otpSentAt = 0;
    }

    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },

  async updatePendingSignup(customer) {
    const newvalues = {
      username: normalizeText(customer.username),
      password: customer.password,
      name: normalizeText(customer.name),
      phone: normalizeText(customer.phone),
      email: normalizeEmail(customer.email),
      active: 0,
      token: customer.token || '',
      otpCode: customer.otpCode || '',
      otpExpiresAt: Number(customer.otpExpiresAt || 0),
      otpSentAt: Number(customer.otpSentAt || Date.now()),
    };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },

  async updateOtp(_id, otpCode, otpExpiresAt) {
    const newvalues = {
      otpCode,
      otpExpiresAt: Number(otpExpiresAt || 0),
      otpSentAt: Date.now(),
      active: 0,
    };
    const result = await Models.Customer.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  },

  async activateByEmailAndOtp(email, otpCode) {
    const now = Date.now();
    const query = {
      email: normalizeEmail(email),
      otpCode,
      active: 0,
      otpExpiresAt: { $gte: now },
    };
    const newvalues = {
      active: 1,
      token: '',
      otpCode: '',
      otpExpiresAt: 0,
      otpSentAt: 0,
    };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true }).exec();
    return result;
  },

  async setActive(_id, active) {
    const newvalues = { active: Number(active || 0) };
    if (Number(active || 0) === 1) {
      newvalues.token = '';
      newvalues.otpCode = '';
      newvalues.otpExpiresAt = 0;
      newvalues.otpSentAt = 0;
    }
    const result = await Models.Customer.findByIdAndUpdate(_id, newvalues, { new: true }).exec();
    return result;
  },

  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true }).exec();
    return result;
  },

  async delete(_id) {
    const result = await Models.Customer.findByIdAndDelete(_id).exec();
    return result;
  },
};

module.exports = CustomerDAO;
