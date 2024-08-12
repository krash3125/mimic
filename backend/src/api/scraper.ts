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

    console.log('reached here 1');

    const [page, browser] = await getPlaywright({ height, width, url });

    console.log('reached here 2');

    if (includeBoxes) {
      const boxes = await getBoxes({ page, height, width });
      data = { boxes };
    }

    console.log('reached here 3');

    if (includeTexts) {
      const texts = await getTexts({ page, height, width });
      data = { ...data, texts };
    }

    console.log('reached here 4');

    res.json(data);

    console.log('reached here 5');

    await browser.close();

    console.log('reached here 6');
  })
);

export default router;
