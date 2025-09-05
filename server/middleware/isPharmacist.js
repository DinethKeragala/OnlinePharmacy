const isPharmacist = (req, res, next) => {
    if (req.user && req.user.role === 'pharmacist') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Pharmacist privileges required.' });
    }
};

module.exports = isPharmacist;
