-- Create Database
CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('customer', 'admin', 'pharmacist') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    requires_prescription BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    prescription_image VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    prescription_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY user_product (user_id, product_id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES
('Pain Relief', 'Medications for pain management'),
('Antibiotics', 'Prescription antibiotics'),
('First Aid', 'First aid supplies and medications'),
('Vitamins', 'Vitamin supplements'),
('Skincare', 'Skincare products and medications');

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_prescription_user ON prescriptions(user_id);
