const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Mahar@786',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'online_shop_db'}\`;`);
    console.log(`Database '${process.env.DB_NAME || 'online_shop_db'}' created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error('Failed to create database:', error);
  }
}

createDb();
