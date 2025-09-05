const db = require('../config/db');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id`
        );
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const [products] = await db.query(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.category_id = ?`,
            [categoryId]
        );
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.id = ?`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock_quantity,
            category_id,
            requires_prescription,
            image_url
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO products 
             (name, description, price, stock_quantity, category_id, requires_prescription, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, stock_quantity, category_id, requires_prescription, image_url]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock_quantity,
            category_id,
            requires_prescription,
            image_url
        } = req.body;

        await db.query(
            `UPDATE products 
             SET name = ?, description = ?, price = ?, stock_quantity = ?, 
                 category_id = ?, requires_prescription = ?, image_url = ? 
             WHERE id = ?`,
            [name, description, price, stock_quantity, category_id, 
             requires_prescription, image_url, req.params.id]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};
