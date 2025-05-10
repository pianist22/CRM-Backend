const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  message: String,
  description: String,
  segmentRules: Object,
  audienceSize: Number,
  userId:String,
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
