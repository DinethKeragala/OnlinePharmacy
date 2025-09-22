const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/health-products', require('./routes/healthProductRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/prescriptions', require('./routes/adminPrescriptionRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Pharmacy API' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});