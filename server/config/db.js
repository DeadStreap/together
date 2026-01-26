const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'bpvc1zsief2yavox1cw7-mysql.services.clever-cloud.com',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'ucqa9qdpsstwl4i0',
  password: process.env.MYSQL_PASSWORD || 'uyeQo6bmhrycuT1jz9KW',
  database: process.env.MYSQL_DATABASE || 'bpvc1zsief2yavox1cw7',
  ssl: { rejectUnauthorized: false },
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000,
  timeout: 30000 
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
