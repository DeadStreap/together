const express = require('express');
const taskRoutes = require('./routes/tasks');
const app = express();
require('dotenv').config();

app.use('/api', taskRoutes); // Все маршруты будут по пути /api/tasks

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

