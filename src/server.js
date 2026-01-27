// src/server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
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
app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
