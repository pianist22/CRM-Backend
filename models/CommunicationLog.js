const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['SENT', 'FAILED','PENDING'], default: 'SENT' },
  message: String,
  sentAt: Date,
  userId:String,
}, { timestamps: true });

module.exports = mongoose.model('CommunicationLog', logSchema);
