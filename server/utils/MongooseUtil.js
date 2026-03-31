const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = MyConstants.DB_URI;

if (!uri) {
  console.error('MongoDB connection skipped: DB_URI is not configured.');
} else {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('Connected to MongoDB.');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
}
