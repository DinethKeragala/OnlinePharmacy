const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Online Pharmacy API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
