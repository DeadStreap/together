const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Импортируем соединение

// GET-маршрут для проверки подключения
router.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('SQL ошибка:', err);
      return res.status(500).json({ error: 'Ошибка БД' });
    }
    res.json(results);
  });
});

module.exports = router;

