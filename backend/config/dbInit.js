const pool = require('./db');

const initDB = async () => {
  try {
    console.log('Initializing Professional Database Schema...');

    // ENABLE FOREIGN KEY CHECKS
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // OPTIONAL: Drop old legacy tables if they exist to ensure clean start
    // const tablesToDrop = ['user_info', 'products', 'categories', 'cart', 'orders', 'orders_info', 'order_products', 'order_items'];
    // for (const table of tablesToDrop) {
    //   await pool.query(`DROP TABLE IF EXISTS ${table}`);
    // }

    // 1. Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        stock INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // 3. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        zip VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Cart Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        qty INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // 5. Orders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Credit Card',
        order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 6. Order Items Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_title VARCHAR(255) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        qty INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // SEED DATA - Add initial categories and products if empty
    const [catCount] = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (catCount[0].count === 0) {
      console.log('Seeding initial categories...');
      await pool.query(`
        INSERT INTO categories (name) VALUES 
        ('Electronics'), ('Fashion'), ('Home & Living'), ('Sports & Outdoors')
      `);
    }

    const [prodCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (prodCount[0].count === 0) {
      console.log('Seeding initial products...');
      await pool.query(`
        INSERT INTO products (category_id, title, price, description, image, stock) VALUES 
        (1, 'Professional Wireless Headphones', 299.99, 'Studio-quality sound with active noise cancellation and 40-hour battery life.', 'product_01.png', 50),
        (1, 'Smart Productivity Tablet', 749.00, 'Powerful performance for creators and professionals. Features a stunning 12-inch display.', 'product_02.png', 30),
        (2, 'Classic Minimalist Watch', 185.00, 'A timeless timepiece featuring a genuine leather strap and surgical-grade stainless steel.', 'product_03.png', 100),
        (3, 'Ergonomic Office Chair', 450.00, 'Designed for ultimate comfort during long working hours. Fully adjustable lumbar support.', 'product_04.png', 20)
      `);
    }

    console.log('Database Schema Initialized with Seed Data.');
  } catch (error) {
    console.error('Error Initializing Database:', error);
    process.exit(1);
  }
};

module.exports = initDB;
