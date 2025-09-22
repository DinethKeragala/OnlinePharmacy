const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getCategories, createProduct } = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
// Admin create product
router.post('/', adminAuth, createProduct);

module.exports = router;