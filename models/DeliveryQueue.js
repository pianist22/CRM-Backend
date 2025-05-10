// models/DeliveryQueue.js
const mongoose = require('mongoose');

const deliveryQueueSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationLog' },
  status: String,
  receivedAt: Date,
});

module.exports = mongoose.model('DeliveryQueue', deliveryQueueSchema);
