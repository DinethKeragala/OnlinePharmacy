const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getCategories, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
// Admin create product
router.post('/', adminAuth, createProduct);
// Admin update/delete product
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;