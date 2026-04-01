require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('./Models');

const REVENUE_STATUSES = ['APPROVED', 'SHIPPING', 'DELIVERED'];

const OrderDAO = {
  async selectAll() {
    const orders = await Models.Order.find({}).sort({ cdate: -1 }).exec();
    return orders;
  },

  async selectRecent(limit = 6) {
    const orders = await Models.Order.find({}).sort({ cdate: -1 }).limit(limit).exec();
    return orders;
  },

  async selectByID(_id) {
    const order = await Models.Order.findById(_id).exec();
    return order;
  },

  async selectByCustID(_cid) {
    const orders = await Models.Order.find({ 'customer._id': _cid }).sort({ cdate: -1 }).exec();
    return orders;
  },

  async insert(order) {
    const payload = {
      ...order,
      _id: order._id || new mongoose.Types.ObjectId(),
    };
    const result = await Models.Order.create(payload);
    return result;
  },

  async updateStatus(_id, status) {
    const result = await Models.Order.findByIdAndUpdate(_id, { status }, { new: true }).exec();
    return result;
  },

  async cancelPendingByCustomer(_id, customerId) {
    const query = { _id, 'customer._id': customerId, status: 'PENDING' };
    const result = await Models.Order.findOneAndUpdate(query, { status: 'CANCELED' }, { new: true }).exec();
    return result;
  },

  async getDashboardSummary() {
    const [
      totalOrders,
      pendingOrders,
      approvedOrders,
      shippingOrders,
      deliveredOrders,
      canceledOrders,
      recentOrders,
      revenueResult,
    ] = await Promise.all([
      Models.Order.countDocuments({}).exec(),
      Models.Order.countDocuments({ status: 'PENDING' }).exec(),
      Models.Order.countDocuments({ status: 'APPROVED' }).exec(),
      Models.Order.countDocuments({ status: 'SHIPPING' }).exec(),
      Models.Order.countDocuments({ status: 'DELIVERED' }).exec(),
      Models.Order.countDocuments({ status: 'CANCELED' }).exec(),
      OrderDAO.selectRecent(6),
      Models.Order.aggregate([
        { $match: { status: { $in: REVENUE_STATUSES } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]).exec(),
    ]);

    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      shippingOrders,
      deliveredOrders,
      canceledOrders,
      totalRevenue: Number(revenueResult?.[0]?.totalRevenue || 0),
      recentOrders,
    };
  },
};

module.exports = OrderDAO;
