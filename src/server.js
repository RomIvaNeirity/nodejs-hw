// src/server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
//pino-http для логування HTTP-запитів
app.use(logger);
// Middleware для парсингу JSON
app.use(express.json());
// Дозволяє запити з будь-яких джерел
app.use(cors());

// Кореневий маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.use(notesRoutes);

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Middleware для обробки помилок (останнє)
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
