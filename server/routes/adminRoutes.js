const router = require('express').Router();
const admin = require('../controllers/adminController');

router.post('/login', admin.login);
router.get('/me', admin.me);

module.exports = router;
