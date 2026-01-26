// server.js
const express = require('express');
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
  try {
    const allItems = await prisma.content_items.findMany();
    res.json(allItems); // Отправляем данные в формате JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер API запущен на http://localhost:${PORT}`);
});