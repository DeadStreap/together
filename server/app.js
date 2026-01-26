// server.js
const express = require('express');
const pool = require('./config/db');
const prisma = require('./prismaClient'); // Ваш модуль с PrismaClient
const app = express();
const PORT = 3001; // Выберите порт для вашего API (отличный от порта React-приложения)

// Разрешаем CORS, чтобы React-приложение могло делать запросы
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Замените 3000 на порт вашего React-приложения
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Маршрут API для получения всех элементов контента
app.get('/api/content_items', async (req, res) => {
  pool.query(`SELECT * FROM content_items`, (err, result) => {
            if (!err) {
                res.json(result)
            }
            else {
                res.send(err)
                console.log(err)
            }
        })
});

app.listen(PORT, () => {
  console.log(`Сервер API запущен на http://localhost:${PORT}`);
});