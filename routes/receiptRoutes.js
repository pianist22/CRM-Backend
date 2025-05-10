const express = require('express');
const router = express.Router();
const { handleReceipt } = require('../controllers/deliveryReceiptController');
const { authenticate } = require('../middlewares/authMiddleware');


// router.post('/',authenticate, handleReceipt);
router.post('/', handleReceipt);

module.exports = router;
