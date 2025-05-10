const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/vendorControllers');
const { authenticate } = require('../middlewares/authMiddleware');

// router.post('/send',authenticate, sendMessage);
router.post('/send', sendMessage);

module.exports = router;