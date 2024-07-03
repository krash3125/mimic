import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import scraper from './scraper';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/scrape', scraper);

export default router;
