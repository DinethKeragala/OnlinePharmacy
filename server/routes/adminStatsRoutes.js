const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getMonthlySales } = require('../controllers/adminStatsController');

router.get('/sales', adminAuth, getMonthlySales);

module.exports = router;
