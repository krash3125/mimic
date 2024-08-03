import express from 'express';
import scraper from './scraper';

const router = express.Router();

router.use('/scrape', scraper);

export default router;
