const express = require('express');
const router = express.Router();
const { addOrder, viewAllOrders } = require('../controllers/orderController');
const { route } = require('./customerRoutes');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/add-orders',authenticate, addOrder);
// router.post('/add-orders', addOrder);

router.get('/view-orders',authenticate,viewAllOrders);
// router.get('/view-orders',viewAllOrders);

module.exports = router;
