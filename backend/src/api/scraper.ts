import express from 'express';
import { getPlaywright } from '../utils/playwright/base';
import { getBoxes, getTexts } from '../utils/playwright/elements';
import { catchErrors } from '../middlewares';

const router = express.Router();

router.post(
  '/',
  catchErrors(async (req, res) => {
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
      const texts = await getTexts({ page, height, width });
      data = { ...data, texts };
    }

    res.json(data);

    await browser.close();
  })
);

export default router;
