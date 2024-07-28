import express from 'express';
import { getDivs, getImgs, getTexts } from '../utils/playwright';
import { colorToHex } from '../utils/color';
import { getPlaywright } from '../utils/playwright/base';
import { getBoxes, getTexts2 } from '../utils/playwright/elements';

const router = express.Router();

router.post('/', async (req, res) => {
  const { height, width, url } = req.body;

  const includeBoxes = (req.query.includeBoxes + '').toLowerCase() === 'true';
  const includeTexts = (req.query.includeTexts + '').toLowerCase() === 'true';

  let data: any = {};

  const [page, browser] = await getPlaywright({ height, width, url });

  if (includeBoxes) {
    const boxes = await getBoxes({ page, height, width });
    data = { boxes };
  }

  if (includeTexts) {
    const texts = await getTexts2({ page, height, width });
    data = { ...data, texts };
  }

  res.json(data);

  await browser.close();
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

router.post('/boxes', async (req, res) => {
  const { height, width, url } = req.body;

  const [page, browser] = await getPlaywright({ height, width, url });
  const data = await getBoxes({ page, height, width });
  res.json(data);
  await browser.close();
});

router.post('/texts', async (req, res) => {
  const { height, width, url } = req.body;

  const [page, browser] = await getPlaywright({ height, width, url });
  const data = await getTexts2({ page, height, width });
  res.json(data);
  await browser.close();
});

export default router;

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
