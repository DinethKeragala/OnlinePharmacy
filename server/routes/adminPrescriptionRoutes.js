const router = require('express').Router();
const ctrl = require('../controllers/adminPrescriptionController');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
