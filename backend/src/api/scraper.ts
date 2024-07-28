import express from 'express';
import rgb2hex from 'rgb2hex';
import { Browser, chromium, firefox, Page, webkit } from 'playwright';
import {
  getDivs,
  getDivs2,
  getImgs,
  getPage,
  getTexts,
} from '../utils/playwright';
import Color from 'colorjs.io';
import { colorToHex } from '../utils/color';
import { getPlaywright } from '../utils/playwright/base';
import { getBoxes, getTexts2 } from '../utils/playwright/elements';

const router = express.Router();

// router.get('/progressive-data', async (req, res) => {

//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   const sendData = (data) => {
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   };

//   const height = 1080;
//   const width = 1920;
//   const url = 'https://www.purduepool.com';

//   try {
//     // Open the page
//     const [page, browser] = await getPage({
//       height,
//       width,
//       url,
//     });

//     const divs = await getDivs({ page, height, width, url });
//     sendData({ divs });

//     const texts = await getTexts({ page, height, width, url });
//     sendData({ texts });

//     // Close the browser
//     await browser.close();

//     res.write('event: end\n');
//     res.write('data: {}\n\n');
//     res.end();
//   } catch (error) {
//     // Handle errors
//     res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
//     res.end();
//   }
// });

router.get('/all', async (req, res) => {
  const height = 1080;
  const width = 1920;
  const url = 'https://www.purduepool.com';

  const [page, browser] = await getPage({
    height,
    width,
    url,
  });

  const divs = await getDivs2({ page, height, width, url });
});

router.get('/divs', async (req, res) => {
  res.json(
    await getDivs({
      url: 'https://www.amazon.com',
      height: 1080,
      width: 1920,
    })
  );
});

router.get('/imgs', async (req, res) => {
  res.json(
    await getImgs({
      url: 'https://www.amazon.com',
      height: 1080,
      width: 1920,
    })
  );
});

router.post('/imgs', async (req, res) => {
  const { height, width, url } = req.body;
  res.json(
    await getImgs({
      url,
      height,
      width,
    })
  );
});

router.post('/divs', async (req, res) => {
  const { height, width, url } = req.body;
  res.json(await getDivs({ height, width, url }));
});

router.post('/boxes', async (req, res) => {
  const { height, width, url } = req.body;

  const [page, browser] = await getPlaywright({ height, width, url });
  const data = await getBoxes({ page, height, width });
  res.json(data);
  await browser.close();
});

router.get('/test1', async (req, res) => {
  const height = 1080;
  const width = 1920;
  const url = 'https://www.amazon.com';

  const [page, browser] = await getPlaywright({ height, width, url });
  const data = await getBoxes({ page, height, width });
  res.json(data);
  await browser.close();
});

router.post('/texts2', async (req, res) => {
  const { height, width, url } = req.body;

  const [page, browser] = await getPlaywright({ height, width, url });
  const data = await getTexts2({ page, height, width });
  res.json(data);
  await browser.close();
});

router.get('/color', async (req, res) => {
  res.json({
    c1: colorToHex('oklch(0.133892 0.011427 219.055)'),
    c2: colorToHex('oklch(0.794488 0.059203 82.3535 / 0.8)'),
  });
});

router.get('/text', async (req, res) => {
  res.json(
    await getTexts({
      url: 'https://www.purduepool.com',
      height: 1080,
      width: 1920,
    })
  );
});

router.post('/text', async (req, res) => {
  const { height, width, url } = req.body;
  res.json(await getTexts({ height, width, url }));
});

export default router;
