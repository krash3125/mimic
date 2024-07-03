import express from 'express';
import rgb2hex from 'rgb2hex';
import { chromium, firefox, webkit } from 'playwright';
import { getDivs, getTexts } from '../utils/playwright';
import Color from 'colorjs.io';
import { colorToHex } from '../utils/color';

const router = express.Router();

router.get('/divs', async (req, res) => {
  res.json(
    await getDivs({
      url: 'https://www.amazon.com',
      height: 1080,
      width: 1920,
    })
  );
});

router.post('/divs', async (req, res) => {
  const { height, width, url } = req.body;
  res.json(await getDivs({ height, width, url }));
});

router.get('/color', async (req, res) => {
  res.json({
    c1: colorToHex('oklch(0.133892 0.011427 219.055)'),
    c2: colorToHex('oklch(0.794488 0.059203 82.3535 / 0.8)'),
  });
});

router.get('/text', async (req, res) => {
  res.json(await getTexts());
});

export default router;
