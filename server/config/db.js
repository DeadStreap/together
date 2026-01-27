const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('✅ Подключение к MySQL проверено');
  } catch (err) {
    console.error('❌ Ошибка подключения к MySQL:', err);
  }
}

testConnection();

module.exports = pool;