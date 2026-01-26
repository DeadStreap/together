const express = require('express');
const cors = require('cors'); // Установите: npm install cors
const db = require('./config/db');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/content_items', async (req, res) => {
  try {
    console.log('→ Запрос к БД...');
    const [rows] = await db.execute('SELECT * FROM content_items');
    console.log(`✓ Получено ${rows.length} записей`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Ошибка SQL:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Сервер не смог обработать запрос',
      details: error.message
    });
  }
});

app.listen(3001, () => {
  console.log('🔗 Сервер на http://localhost:3001');
});
