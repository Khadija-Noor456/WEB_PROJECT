require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Mountain Majesty Print',
    price: 149.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    description: 'Breathtaking mountain landscape captured at golden hour. Premium quality print on archival paper.',
    stock: 25,
    featured: true,
    rating: 4.8
  },
  {
    name: 'Forest Serenity Canvas',
    price: 199.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    description: 'Peaceful forest path through ancient trees. Museum-quality canvas print.',
    stock: 15,
    featured: true,
    rating: 4.9
  },
  {
    name: 'Wildlife Photography Workshop',
    price: 899.00,
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?auto=format&fit=crop&w=800&q=80',
    description: '5-day intensive wildlife photography workshop in Yellowstone. Learn tracking, composition, and ethical photography.',
    stock: 8,
    featured: true,
    rating: 5.0
  },
  {
    name: 'Sunset Over Lake Print',
    price: 129.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    description: 'Stunning sunset reflection over a pristine mountain lake. Available in multiple sizes.',
    stock: 30,
    featured: false,
    rating: 4.7
  },
  {
    name: 'Landscape Basics Workshop',
    price: 399.00,
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
    description: '2-day beginner-friendly workshop covering landscape photography fundamentals.',
    stock: 12,
    featured: false,
    rating: 4.6
  },
  {
    name: 'Aurora Borealis Canvas',
    price: 249.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    description: 'Spectacular northern lights display over Iceland. Limited edition canvas print.',
    stock: 10,
    featured: true,
    rating: 5.0
  },
  {
    name: 'Desert Dawn Print',
    price: 119.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
    description: 'First light illuminating the desert landscape. Vibrant colors and stunning detail.',
    stock: 20,
    featured: false,
    rating: 4.5
  },
  {
    name: 'Professional Camera Tripod',
    price: 299.99,
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    description: 'Carbon fiber tripod perfect for landscape and wildlife photography. Lightweight and sturdy.',
    stock: 15,
    featured: false,
    rating: 4.8
  },
  {
    name: 'Nature Photography Guide Book',
    price: 39.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive guide to nature photography techniques, featuring 200+ pages of tips and stunning examples.',
    stock: 50,
    featured: false,
    rating: 4.7
  },
  {
    name: 'ND Filter Set',
    price: 179.99,
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1606486913359-1c53b0e17822?auto=format&fit=crop&w=800&q=80',
    description: 'Professional neutral density filter set for long exposure photography. Includes 3, 6, and 10-stop filters.',
    stock: 25,
    featured: false,
    rating: 4.9
  },
  {
    name: '2025 Nature Calendar',
    price: 24.99,
    category: 'Calendars',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful 12-month calendar featuring award-winning nature photography from around the world.',
    stock: 100,
    featured: false,
    rating: 4.6
  },
  {
    name: 'Macro Lens 100mm',
    price: 599.99,
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1606486913359-1c53b0e17822?auto=format&fit=crop&w=800&q=80',
    description: 'Professional macro lens perfect for capturing intricate details in nature photography.',
    stock: 8,
    featured: false,
    rating: 4.8
  },
  {
    name: 'Advanced Composition Workshop',
    price: 599.00,
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=800&q=80',
    description: '3-day workshop focusing on advanced composition techniques and creative vision.',
    stock: 10,
    featured: false,
    rating: 4.9
  },
  {
    name: 'Coastal Sunrise Print',
    price: 139.99,
    category: 'Prints',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=80',
    description: 'Dramatic coastal sunrise with crashing waves. Perfect for office or home decor.',
    stock: 18,
    featured: false,
    rating: 4.7
  },
  {
    name: 'Photography Field Guide',
    price: 29.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    description: 'Portable field guide with quick reference tips for outdoor photography.',
    stock: 60,
    featured: false,
    rating: 4.5
  }
];
const seedDatabase = async () => {
  try {
    // Corrected environment variable name
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} sample products`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};
seedDatabase();

