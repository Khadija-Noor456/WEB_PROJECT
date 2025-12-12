const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home - Nature Photography',
    page: 'home'
  });
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
  // Here you would typically save to database or send email
  console.log('Contact form submitted:', { name, email, message });
  res.render('contact', { 
    title: 'Contact - Nature Photography',
    page: 'contact',
    success: true,
    message: 'Thank you for your message! We will get back to you soon.'
  });
});

module.exports = router;