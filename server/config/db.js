const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'together.ru',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'u3427285_default',
  password: process.env.MYSQL_PASSWORD || 'xyGR3SVIo12xIY7K',
  database: process.env.MYSQL_DATABASE || 'u3427285_default',
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
