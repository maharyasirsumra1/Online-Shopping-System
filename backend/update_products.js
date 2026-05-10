const pool = require('./config/db');

const updateProducts = async () => {
  try {
    await pool.query(`
      UPDATE products 
      SET 
        title = CASE 
          WHEN id = 1 THEN 'Barbie Doll Collection' 
          WHEN id = 2 THEN '4K Ultra HD Smart TV' 
          WHEN id = 3 THEN 'Catan Board Game' 
          WHEN id = 4 THEN 'High-Speed RC Car' 
        END,
        description = CASE 
          WHEN id = 1 THEN 'Beautiful Barbie doll collection set for kids.' 
          WHEN id = 2 THEN 'Stunning 4K Ultra HD Smart TV with vibrant colors.' 
          WHEN id = 3 THEN 'Classic strategy board game for the whole family.' 
          WHEN id = 4 THEN 'Remote control car with high-speed off-road capabilities.' 
        END,
        price = CASE 
          WHEN id = 1 THEN 29.99 
          WHEN id = 2 THEN 799.99 
          WHEN id = 3 THEN 45.00 
          WHEN id = 4 THEN 85.00 
        END
      WHERE id IN (1,2,3,4)
    `);
    console.log('Products updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateProducts();
