const express = require('express');
const router = express.Router();
const {
  getHealthProducts,
  getHealthProductById,
  getHealthCategories,
  createHealthProduct,
  updateHealthProduct,
  deleteHealthProduct,
} = require('../controllers/healthProductController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', getHealthProducts);
router.get('/categories', getHealthCategories);
router.get('/:id', getHealthProductById);

// Admin CRUD
router.post('/', adminAuth, createHealthProduct);
router.put('/:id', adminAuth, updateHealthProduct);
router.delete('/:id', adminAuth, deleteHealthProduct);

module.exports = router;
