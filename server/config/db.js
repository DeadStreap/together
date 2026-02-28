const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 1,
  queueLimit: 10,
  waitForConnections: true,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
  enableKeepAlive: false
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
