const express = require('express');
const router = express.Router();
const { updateDeliveryStatus } = require('../controllers/deliveryController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/delivery-receipt',authenticate,updateDeliveryStatus);
// router.post('/delivery-receipt', updateDeliveryStatus);

module.exports = router;
