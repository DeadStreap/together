const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'bpvc1zsief2yavox1cw7-mysql.services.clever-cloud.com',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'ucqa9qdpsstwl4i0',
  password: process.env.MYSQL_PASSWORD || 'uyeQo6bmhrycuT1jz9KW',
  database: process.env.MYSQL_DATABASE || 'bpvc1zsief2yavox1cw7',
  ssl: { rejectUnauthorized: false } // Обязательно для Clever Cloud
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err.message);
    throw err;
  }
  console.log('✅ Подключено к MySQL!');
});

module.exports = connection;

