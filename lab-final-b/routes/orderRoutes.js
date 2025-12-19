const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { applyDiscount } = require('../middleware/discountMiddleware');

// Order Preview (GET)
router.get('/preview', (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  res.render('order/preview', {
    cart,
    subtotal,
    discount: 0,
    total: subtotal
  });
});

// Order Preview with Coupon (POST)
router.post('/preview', applyDiscount, (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart');
  }

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const discount = req.discountAmount || 0;
  const total = subtotal - discount;

  res.render('order/preview', {
    cart,
    subtotal,
    discount,
    total,
    couponApplied: req.couponApplied || false
  });
});

// Confirm Order
router.post('/confirm', applyDiscount, async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const { email, address, phone } = req.body;

    if (cart.length === 0) {
      return res.redirect('/cart');
    }

    if (!email) {
      return res.status(400).send('Email is required');
    }

    let subtotal = 0;
    const items = cart.map(item => {
      subtotal += item.price * item.quantity;
      return {
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity
      };
    });

    const discount = req.discountAmount || 0;
    const total = subtotal - discount;

    const order = new Order({
      email,
      address,
      phone,
      items,
      subtotal,
      discount,
      total,
      status: 'Placed',
      orderDate: new Date()
    });

    await order.save();
    req.session.cart = [];

    res.redirect(`/order/success/${order._id}`);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).send('Error creating order');
  }
});

// Success Page
router.get('/success/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('order/success', { order });
  } catch (error) {
    console.error('Error loading order:', error);
    res.status(500).send('Error loading order');
  }
});

// My Orders (GET)
router.get('/my-orders', (req, res) => {
  res.render('order/myOrders', { orders: null, email: null });
});

// My Orders (POST)
router.post('/my-orders', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.render('order/myOrders', { 
        orders: null, 
        email: null,
        error: 'Please enter an email address' 
      });
    }

    const orders = await Order.find({ email }).sort({ orderDate: -1 });

    res.render('order/myOrders', { orders, email });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});

module.exports = router;