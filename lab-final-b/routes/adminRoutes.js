const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// View All Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.render('admin/orders', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});

// View Order Details
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('admin/orderDetail', { order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Error fetching order');
  }
});

// Update Order Status
router.post('/orders/:orderId/update-status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).send('Order not found');
    }

    const currentStatus = order.status;

    // Validate status transitions
    const validTransitions = {
      'Placed': ['Processing'],
      'Processing': ['Delivered'],
      'Delivered': []
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      return res.status(400).send(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    order.status = newStatus;
    await order.save();

    res.redirect(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Error updating order status');
  }
});

module.exports = router;