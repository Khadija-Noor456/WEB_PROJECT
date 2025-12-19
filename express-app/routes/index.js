const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home - Nature Photography',
    page: 'home'
  });
});

// Shop/Products page with pagination and filtering
router.get('/shop', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Sort option
    let sort = {};
    if (req.query.sort === 'price-asc') {
      sort.price = 1;
    } else if (req.query.sort === 'price-desc') {
      sort.price = -1;
    } else if (req.query.sort === 'name') {
      sort.name = 1;
    } else {
      sort.createdAt = -1;
    }
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Fetch products
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    
    // Get all categories for filter dropdown
    const categories = await Product.distinct('category');
    
    res.render('shop', {
      title: 'Shop - Nature Photography',
      page: 'shop',
      products,
      currentPage: page,
      totalPages,
      limit,
      totalProducts,
      categories,
      filters: req.query
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
});

// Single product page
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).send('Product not found');
    }
    
    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(3);
    
    res.render('product-detail', {
      title: `${product.name} - Nature Photography`,
      page: 'shop',
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error loading product');
  }
});

// Services page
router.get('/services', (req, res) => {
  const services = [
    {
      icon: 'https://img.icons8.com/color/96/000000/mountain.png',
      title: 'Landscape Photography',
      description: 'Stunning natural vistas, golden sunsets, and serene scenes that tell the story of the earth.'
    },
    {
      icon: 'https://img.icons8.com/color/96/000000/deer.png',
      title: 'Wildlife Photography',
      description: 'Capturing animals in their natural habitats — the raw beauty of the wild, preserved forever.'
    },
    {
      icon: 'https://img.icons8.com/color/96/000000/camera.png',
      title: 'Photography Workshops',
      description: 'Join guided outdoor sessions to learn camera techniques and composition skills.'
    }
  ];
  
  res.render('services', { 
    title: 'Services - Nature Photography',
    page: 'services',
    services: services
  });
});

// Gallery page
router.get('/gallery', (req, res) => {
  res.render('gallery', { 
    title: 'Gallery - Nature Photography',
    page: 'gallery'
  });
});

// Workshops page
router.get('/workshops', (req, res) => {
  res.render('workshops', { 
    title: 'Workshops - Nature Photography',
    page: 'workshops'
  });
});

// Testimonials page
router.get('/testimonials', (req, res) => {
  const testimonials = [
    { quote: 'Absolutely mesmerizing photos! Each shot feels alive.', author: 'Sarah M.' },
    { quote: 'The workshop changed how I see the world through my lens.', author: 'Daniel K.' },
    { quote: 'Hired for a nature campaign — the results exceeded expectations!', author: 'WildEarth Media' }
  ];
  
  res.render('testimonials', { 
    title: 'Testimonials - Nature Photography',
    page: 'testimonials',
    testimonials: testimonials
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact - Nature Photography',
    page: 'contact'
  });
});

// Handle contact form submission
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submitted:', { name, email, message });
  res.render('contact', { 
    title: 'Contact - Nature Photography',
    page: 'contact',
    success: true,
    message: 'Thank you for your message! We will get back to you soon.'
  });
});
// TEST: Check if products are in database
router.get('/test-db', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(`
      <h1>Database Test</h1>
      <p>Found ${products.length} products in MongoDB</p>
      <ul>
        ${products.map(p => `<li>${p.name} - $${p.price} (ID: ${p._id})</li>`).join('')}
      </ul>
      <a href="/shop">Go to Shop</a>
    `);
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

module.exports = router;