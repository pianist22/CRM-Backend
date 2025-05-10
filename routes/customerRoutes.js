const express = require('express');
const router = express.Router();
const { addCustomer, viewAllCustomer } = require('../controllers/customerController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/add-customers',authenticate, addCustomer);
// router.post('/add-customers', addCustomer);

router.get('/view-customers',authenticate,viewAllCustomer);
// router.get('/view-customers',viewAllCustomer);

module.exports = router;
