const router = require('express').Router();
const { 
    uploadPrescription, 
    getPrescriptions, 
    reviewPrescription,
    getAllPrescriptions 
} = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');
const isPharmacist = require('../middleware/isPharmacist');

// Prescription routes
router.post('/upload', auth, uploadPrescription);
router.get('/my-prescriptions', auth, getPrescriptions);
router.get('/all', auth, isPharmacist, getAllPrescriptions);
router.put('/:id/review', auth, isPharmacist, reviewPrescription);

module.exports = router;
