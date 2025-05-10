const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  totalSpend: Number,
  visitCount: Number,
  lastActiveDate: Date,
  userId:String
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
