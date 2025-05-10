const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  amount: Number,
  orderDate: Date,
  userId:String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
