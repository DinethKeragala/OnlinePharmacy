const router = require('express').Router();
const ctrl = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer storage (disk) - simple local storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), 'uploads', 'prescriptions'));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname || '').toLowerCase();
		const safeExt = ['.png', '.jpg', '.jpeg', '.pdf'].includes(ext) ? ext : '.png';
		cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`);
	}
});
const upload = multer({ storage });

// All routes require auth
router.use(auth);

router.get('/', ctrl.list);
// Accept optional 'image' file for prescription image
router.post('/', upload.single('image'), ctrl.create);
router.patch('/:id/request-refill', ctrl.requestRefill);

module.exports = router;
