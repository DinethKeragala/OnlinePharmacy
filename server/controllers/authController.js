const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register new user
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, address } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, address]
        );

        // Generate token
        const token = jwt.sign(
            { id: result.insertId, email, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.insertId,
                first_name,
                last_name,
                email,
                role: 'customer'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user
        const [users] = await db.query(
            'SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, first_name, last_name, email, phone, address, role FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone, address } = req.body;

        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, address, req.user.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
