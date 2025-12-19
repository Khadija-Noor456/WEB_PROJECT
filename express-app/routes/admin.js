const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      categories,
      recentProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Product List (READ)
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.render('admin/products', {
      title: 'Manage Products',
      layout: 'admin',
      products,
      currentPage: page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    console.error('Products list error:', error);
    res.status(500).send('Error loading products');
  }
});

// Add Product Page (CREATE - Form)
router.get('/products/add', (req, res) => {
  res.render('admin/product-form', {
    title: 'Add New Product',
    layout: 'admin',
    product: null,
    action: '/admin/products/add'
  });
});

// Create Product (CREATE - Submit)
router.post('/products/add', async (req, res) => {
  try {
    const { name, price, category, image, description, stock, featured, rating } = req.body;
    
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      category,
      image,
      description,
      stock: parseInt(stock) || 0,
      featured: featured === 'on',
      rating: parseFloat(rating) || 0
    });

    await newProduct.save();
    res.redirect('/admin/products?success=Product added successfully');
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).send('Error adding product');
  }
});

// Edit Product Page (UPDATE - Form)
router.get('/products/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('admin/product-form', {
      title: 'Edit Product',
      layout: 'admin',
      product,
      action: `/admin/products/edit/${product._id}`
    });
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).send('Error loading product');
  }
});

// Update Product (UPDATE - Submit)
router.post('/products/edit/:id', async (req, res) => {
  try {
    const { name, price, category, image, description, stock, featured, rating } = req.body;
    
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price: parseFloat(price),
      category,
      image,
      description,
      stock: parseInt(stock) || 0,
      featured: featured === 'on',
      rating: parseFloat(rating) || 0
    });

    res.redirect('/admin/products?success=Product updated successfully');
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).send('Error updating product');
  }
});

// Delete Product (DELETE)
router.post('/products/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products?success=Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).send('Error deleting product');
  }
});

// View Single Product
router.get('/products/view/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('admin/product-view', {
      title: `View Product - ${product.name}`,
      layout: 'admin',
      product
    });
  } catch (error) {
    console.error('View product error:', error);
    res.status(500).send('Error loading product');
  }
});

module.exports = router;