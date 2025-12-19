require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const routes = require('./routes/index');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);  // Admin routes FIRST with /admin prefix
app.use('/', routes);            // Main site routes

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin/dashboard`);
  console.log(`🛍️  Shop: http://localhost:${PORT}/shop`);
});