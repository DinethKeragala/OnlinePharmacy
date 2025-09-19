const router = require('express').Router();
const ctrl = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');

// All routes require auth
router.use(auth);

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.patch('/:id/request-refill', ctrl.requestRefill);

module.exports = router;
