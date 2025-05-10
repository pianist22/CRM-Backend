// worker/deliveryConsumer.js

const mongoose = require('mongoose');
const CommunicationLog = require('../models/CommunicationLog');
const DeliveryQueue = require('../models/DeliveryQueue');

const processQueue = async () => {
  const queueItems = await DeliveryQueue.find().limit(100);

  if (queueItems.length === 0) return;

  const bulkOps = queueItems.map((item) => ({
    updateOne: {
      filter: { _id: item.logId },
      update: {
        status: item.status,
        deliveredAt: item.receivedAt,
      },
    },
  }));

  try {
    await CommunicationLog.bulkWrite(bulkOps);
    await DeliveryQueue.deleteMany({ _id: { $in: queueItems.map((i) => i._id) } });
    console.log(`[✔] Processed ${queueItems.length} delivery receipts`);
  } catch (err) {
    console.error('Batch processing error:', err);
  }
};

setInterval(processQueue, 5000); // Run every 5 seconds
