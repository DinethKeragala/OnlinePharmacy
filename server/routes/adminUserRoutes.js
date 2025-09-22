const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl = require('../controllers/adminUserController');

router.use(adminAuth);

router.get('/', ctrl.list);

module.exports = router;
