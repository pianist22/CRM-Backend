const CommunicationLog = require('../models/CommunicationLog');

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { logId, status } = req.body;
    await CommunicationLog.findByIdAndUpdate(logId, { status });
    res.json({ message: 'Delivery status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
