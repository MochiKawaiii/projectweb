require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('./Models');

const ProductDAO = {
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 };
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } },
      { $limit: top },
    ]).exec();
    const products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      if (product) products.push(product);
    }
    return products;
  },
  async selectByCatID(categoryRef) {
    const value = String(categoryRef || '').trim();
    const clauses = [{ 'category.slug': value }];

    if (mongoose.Types.ObjectId.isValid(value)) {
      clauses.unshift({ 'category._id': value });
    }

    const query = clauses.length === 1 ? clauses[0] : { $or: clauses };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, 'i') } };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async insert(product) {
    const newId = new mongoose.Types.ObjectId();
    product._id = newId;
    const result = await Models.Product.create(product);
    return result;
  },
  async update(product) {
    const newvalues = {
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      description: product.description,
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
    };
    const result = await Models.Product.findByIdAndUpdate(product._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  },
};

module.exports = ProductDAO;