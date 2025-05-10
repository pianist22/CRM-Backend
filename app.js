const express = require('express');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

require('./worker/deliveryConsumer'); // Start consumer process
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/receipt', receiptRoutes);


module.exports = app;