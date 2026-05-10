const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Altering user_info table...');
    await connection.query('ALTER TABLE user_info MODIFY mobile VARCHAR(15)');
    console.log('Altering user_info_backup table...');
    await connection.query('ALTER TABLE user_info_backup MODIFY mobile VARCHAR(15)');
    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

migrate();
