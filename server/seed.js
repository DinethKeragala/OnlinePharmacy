require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const HealthProduct = require('./models/HealthProduct');

const medicines = [
  {
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    description: 'Antibiotic used to treat a wide variety of bacterial infections.',
    price: 9.99,
    category: 'Antibiotics',
    tags: ['Antibiotics'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 120,
    prescription: true,
    rating: 4.6,
  },
  {
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    description: 'ACE inhibitor used to treat high blood pressure.',
    price: 15.5,
    category: 'Blood Pressure',
    tags: ['Blood Pressure'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 80,
    prescription: true,
    rating: 4.4,
  },
  {
    name: 'Ibuprofen 200mg',
    genericName: 'Ibuprofen',
    description: 'NSAID used to relieve pain and reduce fever.',
    price: 6.99,
    category: 'Pain Relief',
    tags: ['Pain Relief'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 200,
    prescription: false,
    rating: 4.7,
  },
  {
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine',
    description: 'Antihistamine used to relieve allergy symptoms.',
    price: 14.5,
    category: 'Allergies',
    tags: ['Allergies'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 150,
    prescription: false,
    rating: 4.6,
  },
];

const healthProducts = [
  {
    name: 'Digital Blood Pressure Monitor',
    genericName: '',
    description: 'Accurate and easy-to-use blood pressure monitor for home health.',
    price: 49.99,
    category: 'Medical Devices',
    tags: ['Medical Devices'],
    imageUrl: 'https://images.unsplash.com/photo-1612538499190-a7772e1f7da5?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 25,
    rating: 4.6,
  },
  {
    name: 'Vitamin D3 Supplements',
    genericName: '',
    description: 'High-quality Vitamin D3 softgels for daily wellness.',
    price: 12.99,
    category: 'Vitamins & Supplements',
    tags: ['Vitamins & Supplements'],
    imageUrl: 'https://images.unsplash.com/photo-1610360655545-d1073f1c6e2c?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 150,
    rating: 4.5,
  },
  {
    name: 'Infrared Thermometer',
    genericName: '',
    description: 'Contactless thermometer for quick and safe temperature checks.',
    price: 34.95,
    category: 'Medical Devices',
    tags: ['Medical Devices'],
    imageUrl: 'https://images.unsplash.com/photo-1610851467645-bbc4b40da5ba?q=80&w=1200&auto=format&fit=crop',
    inStock: true,
    stock: 60,
    rating: 4.4,
  },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all([
      Product.deleteMany({}),
      HealthProduct.deleteMany({}),
    ]);
    const [meds, health] = await Promise.all([
      Product.insertMany(medicines),
      HealthProduct.insertMany(healthProducts),
    ]);
    console.log('Seeded medicines:', meds.length, '| health products:', health.length);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
