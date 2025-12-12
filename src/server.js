import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import { connectMongoDB } from './db/connectMongoDB.js';
import studentsRoutes from './routes/studentsRoutes.js';

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

app.use(cors());

//=================================================================

app.use(studentsRoutes);

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
