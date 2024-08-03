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

export default router;
