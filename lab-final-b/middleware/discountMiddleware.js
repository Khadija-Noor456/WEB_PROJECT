function applyDiscount(req, res, next) {
  const cart = req.session.cart || [];
  const couponCode = req.query.coupon || req.body.coupon;
  
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  req.discountAmount = 0;
  req.couponApplied = false;

  if (couponCode && couponCode.toUpperCase() === 'SAVE10') {
    req.discountAmount = subtotal * 0.10;
    req.couponApplied = true;
  }

  next();
}

module.exports = { applyDiscount };