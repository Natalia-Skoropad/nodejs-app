import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import studentsRoutes from './routes/studentsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

//=================================================================

const app = express();
const PORT = process.env.PORT ?? 3000;

//=================================================================

app.use(logger);

app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());

//=================================================================

app.use(authRoutes);
app.use(studentsRoutes);
app.use(userRoutes);

//=================================================================

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

//=================================================================

await connectMongoDB();

//=================================================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//=================================================================
