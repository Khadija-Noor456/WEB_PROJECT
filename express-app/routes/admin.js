const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Admin middleware
const adminAuth = (req, res, next) => {
    if (req.session && req.session.admin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin Login Page
router.get('/admin/login', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admin');
    }
    res.render('admin/login', {
        title: 'Admin Login',
        layout: false
    });
});

// Admin Login Handler
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded credentials for demo
    if (username === 'admin' && password === 'admin123') {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login', {
            title: 'Admin Login',
            layout: false,
            error: 'Invalid credentials'
        });
    }
});

// Admin Logout
router.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Apply admin middleware to protected routes
router.use('/admin', adminAuth);

// Admin Dashboard
router.get('/admin', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalFeatured = await Product.countDocuments({ featured: true });
        const totalStock = await Product.aggregate([
            { $group: { _id: null, total: { $sum: "$stock" } } }
        ]);
        
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.render('admin/dashboard', {
            title: 'Dashboard',
            page: 'dashboard',
            layout: 'admin/layout',
            totalProducts,
            totalFeatured,
            totalStock: totalStock[0]?.total || 0,
            recentProducts
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('admin/dashboard', {
            title: 'Dashboard',
            page: 'dashboard',
            layout: 'admin/layout',
            error: 'Error loading dashboard'
        });
    }
});

// Products List Page
router.get('/admin/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        
        res.render('admin/products', {
            title: 'Products Management',
            page: 'products',
            layout: 'admin/layout',
            products,
            currentPage: page,
            totalPages,
            limit,
            totalProducts,
            success: req.query.success,
            error: req.query.error
        });
    } catch (error) {
        console.error('Products list error:', error);
        res.status(500).render('admin/products', {
            title: 'Products Management',
            page: 'products',
            layout: 'admin/layout',
            error: 'Error loading products'
        });
    }
});

// Add Product Page
router.get('/admin/products/add', (req, res) => {
    const categories = ['Prints', 'Workshops', 'Equipment', 'Books', 'Calendars'];
    
    res.render('admin/product-form', {
        title: 'Add New Product',
        page: 'products',
        layout: 'admin/layout',
        product: null,
        categories,
        formAction: '/admin/products',
        formMethod: 'POST',
        error: req.query.error
    });
});

// Create Product (POST)
router.post('/admin/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        
        res.redirect('/admin/products?success=Product added successfully');
    } catch (error) {
        console.error('Create product error:', error);
        res.redirect(`/admin/products/add?error=${encodeURIComponent(error.message)}`);
    }
});

// Edit Product Page
router.get('/admin/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.redirect('/admin/products?error=Product not found');
        }
        
        const categories = ['Prints', 'Workshops', 'Equipment', 'Books', 'Calendars'];
        
        res.render('admin/product-form', {
            title: 'Edit Product',
            page: 'products',
            layout: 'admin/layout',
            product,
            categories,
            formAction: `/admin/products/${product._id}`,
            formMethod: 'PUT',
            error: req.query.error
        });
    } catch (error) {
        console.error('Edit product error:', error);
        res.redirect('/admin/products?error=Error loading product');
    }
});

// Update Product (PUT)
router.post('/admin/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.redirect('/admin/products?error=Product not found');
        }
        
        res.redirect('/admin/products?success=Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        res.redirect(`/admin/products/edit/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
});

// Delete Product
router.get('/admin/products/delete/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.redirect('/admin/products?error=Product not found');
        }
        
        res.redirect('/admin/products?success=Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        res.redirect('/admin/products?error=Error deleting product');
    }
});

// Orders Page (Placeholder)
router.get('/admin/orders', (req, res) => {
    res.render('admin/orders', {
        title: 'Orders Management',
        page: 'orders',
        layout: 'admin/layout'
    });
});

module.exports = router;