// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MongoDB Connection ---
mongoose
  .connect('mongodb://127.0.0.1:27017/labFinalB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Home Route (FIXED) ---
app.get('/', (req, res) => {
  res.render('index'); // This renders the new clean file below
});

// --- Cart Page ---
app.get('/cart', (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [
      { productId: new mongoose.Types.ObjectId(), name: 'Product A', price: 50, quantity: 2 },
      { productId: new mongoose.Types.ObjectId(), name: 'Product B', price: 30, quantity: 1 }
    ];
  }
  res.render('cart', { cart: req.session.cart });
});

const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});