const Customer = require('../models/Customer');

exports.addCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.viewAllCustomer = async (req, res) => {
  try {
    const userId = req.query.userId;
    const customers = await Customer.find({userId});
    res.status(200).json({ success: true, customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ success: false, message: "Server error while fetching customers" });
  }
};

