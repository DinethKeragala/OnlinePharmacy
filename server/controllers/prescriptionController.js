const db = require('../config/db');

// Upload prescription
const uploadPrescription = async (req, res) => {
    try {
        const { prescription_image } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO prescriptions (user_id, prescription_image) VALUES (?, ?)',
            [req.user.id, prescription_image]
        );

        res.status(201).json({
            message: 'Prescription uploaded successfully',
            prescriptionId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's prescriptions
const getPrescriptions = async (req, res) => {
    try {
        const [prescriptions] = await db.query(
            `SELECT p.*, 
                    u2.first_name as reviewer_first_name, 
                    u2.last_name as reviewer_last_name
             FROM prescriptions p
             LEFT JOIN users u2 ON p.reviewed_by = u2.id
             WHERE p.user_id = ?
             ORDER BY p.uploaded_at DESC`,
            [req.user.id]
        );

        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all prescriptions (pharmacist only)
const getAllPrescriptions = async (req, res) => {
    try {
        const [prescriptions] = await db.query(
            `SELECT p.*, 
                    u1.first_name as user_first_name,
                    u1.last_name as user_last_name,
                    u1.email as user_email,
                    u2.first_name as reviewer_first_name,
                    u2.last_name as reviewer_last_name
             FROM prescriptions p
             JOIN users u1 ON p.user_id = u1.id
             LEFT JOIN users u2 ON p.reviewed_by = u2.id
             ORDER BY 
                CASE 
                    WHEN p.status = 'pending' THEN 1
                    WHEN p.status = 'approved' THEN 2
                    ELSE 3
                END,
                p.uploaded_at DESC`
        );

        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Review prescription
const reviewPrescription = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const prescriptionId = req.params.id;

        const [result] = await db.query(
            `UPDATE prescriptions 
             SET status = ?, 
                 notes = ?,
                 reviewed_by = ?,
                 reviewed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, notes, req.user.id, prescriptionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        res.json({ message: 'Prescription reviewed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadPrescription,
    getPrescriptions,
    getAllPrescriptions,
    reviewPrescription
};
