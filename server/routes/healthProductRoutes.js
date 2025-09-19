const express = require('express');
const router = express.Router();
const {
  getHealthProducts,
  getHealthProductById,
  getHealthCategories,
} = require('../controllers/healthProductController');

router.get('/', getHealthProducts);
router.get('/categories', getHealthCategories);
router.get('/:id', getHealthProductById);

module.exports = router;
