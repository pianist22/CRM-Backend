// controllers/deliveryReceiptController.js

const DeliveryQueue = require('../models/DeliveryQueue');

exports.handleReceipt = async (req, res) => {
  const { logId, status } = req.body;

  try {
    await DeliveryQueue.create({
      logId,
      status,
      receivedAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error in delivery receipt:', err);
    res.status(500).json({ message: 'Error saving receipt' });
  }
};
