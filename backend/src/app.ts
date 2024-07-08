import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

// app.use(morgan('dev'));
// app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

// // logging middleware
// app.use((req, res, next) => {
//   serverDebug(`${new Date().toISOString()}: ${req.method} ${req.url}`);
//   next();
// });

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;