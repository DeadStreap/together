const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'bpvc1zsief2yavox1cw7-mysql.services.clever-cloud.com',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'ucqa9qdpsstwl4i0',
  password: process.env.MYSQL_PASSWORD || 'uyeQo6bmhrycuT1jz9KW',
  database: process.env.MYSQL_DATABASE || 'bpvc1zsief2yavox1cw7',
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
