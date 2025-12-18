require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
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

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'nature-photography-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));

// Routes
app.use('/', adminRoutes);
app.use('/', routes);

// Simple error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    
    // For admin routes
    if (req.originalUrl.startsWith('/admin')) {
        return res.redirect('/admin/login?error=' + encodeURIComponent('Server error occurred'));
    }
    
    // For main site
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error - Nature Photography</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
                h1 { color: #dc3545; }
                a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>⚠️ Server Error</h1>
            <p>Something went wrong. Please try again.</p>
            <a href="/">← Go Home</a>
        </body>
        </html>
    `);
});

// 404 Handler
app.use((req, res) => {
    if (req.originalUrl.startsWith('/admin')) {
        return res.redirect('/admin');
    }
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Page Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            </style>
        </head>
        <body>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">← Go Home</a>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin/login`);
    console.log(`📝 Default credentials: admin / admin123`);
    console.log(`👤 Main site: http://localhost:${PORT}`);
});