const db = require('../config/db');

// Get user's cart
const getCart = async (req, res) => {
    try {
        const [cartItems] = await db.query(
            `SELECT c.*, 
                    p.name, p.price, p.image_url, 
                    (p.stock_quantity >= c.quantity) as in_stock,
                    p.requires_prescription
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [req.user.id]
        );

        const totalAmount = cartItems.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );

        res.json({
            items: cartItems,
            total: totalAmount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if product exists and has enough stock
        const [products] = await db.query(
            'SELECT stock_quantity FROM products WHERE id = ?',
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (products[0].stock_quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Check if item already in cart
        const [existingItems] = await db.query(
            'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id]
        );

        if (existingItems.length > 0) {
            // Update quantity if already in cart
            const newQuantity = existingItems[0].quantity + quantity;
            
            if (newQuantity > products[0].stock_quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }

            await db.query(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, req.user.id, product_id]
            );
        } else {
            // Add new item to cart
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, quantity]
            );
        }

        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        // Check if product has enough stock
        const [products] = await db.query(
            'SELECT stock_quantity FROM products WHERE id = ?',
            [productId]
        );

        if (products[0].stock_quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const [result] = await db.query(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, req.user.id, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, req.params.productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
