const router = require('express').Router();
const { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Order routes
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getOrders);
router.get('/all', auth, isAdmin, getAllOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;
