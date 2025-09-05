const db = require('../config/db');

// Create new order
const createOrder = async (req, res) => {
    try {
        const { shipping_address, items, prescription_id } = req.body;
        const userId = req.user.id;

        // Start transaction
        await db.query('START TRANSACTION');

        // Calculate total amount and verify stock
        let totalAmount = 0;
        for (const item of items) {
            const [products] = await db.query(
                'SELECT price, stock_quantity, requires_prescription FROM products WHERE id = ?',
                [item.product_id]
            );

            if (products.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ 
                    message: `Product with id ${item.product_id} not found` 
                });
            }

            const product = products[0];

            // Check stock availability
            if (product.stock_quantity < item.quantity) {
                await db.query('ROLLBACK');
                return res.status(400).json({ 
                    message: `Insufficient stock for product id ${item.product_id}` 
                });
            }

            // Check prescription requirement
            if (product.requires_prescription && !prescription_id) {
                await db.query('ROLLBACK');
                return res.status(400).json({ 
                    message: `Prescription required for product id ${item.product_id}` 
                });
            }

            totalAmount += product.price * item.quantity;
        }

        // Create order
        const [orderResult] = await db.query(
            `INSERT INTO orders (user_id, total_amount, shipping_address, prescription_id) 
             VALUES (?, ?, ?, ?)`,
            [userId, totalAmount, shipping_address, prescription_id]
        );

        const orderId = orderResult.insertId;

        // Create order items and update stock
        for (const item of items) {
            // Add order item
            await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, subtotal) 
                 SELECT ?, ?, ?, price, price * ? 
                 FROM products WHERE id = ?`,
                [orderId, item.product_id, item.quantity, item.quantity, item.product_id]
            );

            // Update stock
            await db.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear user's cart
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        // Commit transaction
        await db.query('COMMIT');

        res.status(201).json({
            message: 'Order created successfully',
            orderId
        });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's orders
const getOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, 
                    COUNT(oi.id) as total_items,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price_per_unit', oi.price_per_unit,
                            'subtotal', oi.subtotal
                        )
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, 
                    u.email as user_email,
                    COUNT(oi.id) as total_items,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price_per_unit', oi.price_per_unit,
                            'subtotal', oi.subtotal
                        )
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN users u ON o.user_id = u.id
             GROUP BY o.id
             ORDER BY o.created_at DESC`
        );

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single order
const getOrderById = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price_per_unit', oi.price_per_unit,
                            'subtotal', oi.subtotal
                        )
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.id = ? AND (o.user_id = ? OR ? = 'admin')
             GROUP BY o.id`,
            [req.params.id, req.user.id, req.user.role]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orders[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
};
