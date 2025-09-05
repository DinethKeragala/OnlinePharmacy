const router = require('express').Router();
const { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart,
    clearCart 
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Cart routes
router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update/:productId', auth, updateCartItem);
router.delete('/remove/:productId', auth, removeFromCart);
router.delete('/clear', auth, clearCart);

module.exports = router;
