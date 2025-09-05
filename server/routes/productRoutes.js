const router = require('express').Router();
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByCategory
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Product routes
router.get('/', getAllProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
