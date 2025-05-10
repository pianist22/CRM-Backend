const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.addOrder = async (req, res) => {
  try {
    let { customerId, amount, orderDate,userId } = req.body;

    // Ensure amount is an integer
    const parsedAmount = parseInt(amount);

    // 1. Create and save the order
    const order = new Order({ customerId, amount: parsedAmount, orderDate,userId:userId });
    await order.save();

    // 2. Update the customer: totalSpend, visitCount, lastActiveDate
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.totalSpend = (customer.totalSpend || 0) + parsedAmount;
    customer.visitCount = (customer.visitCount || 0) + 1;
    customer.lastActiveDate = orderDate;

    await customer.save();

    // 3. Return response
    res.status(201).json(order);
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.viewAllOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    const orders = await Order.find({ userId }).populate('customerId');
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error while fetching orders" });
  }
};
