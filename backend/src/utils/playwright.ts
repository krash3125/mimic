import { chromium, firefox, webkit } from 'playwright';
import rgb2hex from 'rgb2hex';
import { colorToHex } from './color';

export const getDivs = async ({
  height,
  width,
  url,
  headless = true,
}: {
  height: number;
  width: number;
  url: string;
  headless?: boolean;
}) => {
  console.log(height, width, url);
  const browser = await chromium.launch({
    headless,
  });
  const page = await browser.newPage();

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto(url);

  const divs = await page.$$('div, section, main, nav');
  let lst: any[] = [];

  for (const div of divs) {
    if (await div.isVisible()) {
      const box = await div.boundingBox();

      if (!box) {
        continue;
      }

      const computed = await div.evaluate((el) => {
        return window.getComputedStyle(el);
      });

      const bg = colorToHex(computed.backgroundColor);

      let data = {
        ...box,
        bg: bg.hex,
        alpha: bg.alpha,
      };

      if (
        bg.alpha === 0 ||
        data.x < 0 ||
        data.y < 0 ||
        data.x > width ||
        data.y > height ||
        data.width === 0 ||
        data.height === 0
      ) {
        continue;
      }

      if (data.width + data.x > width) {
        data.width = width - data.x;
      }

      if (data.height + data.y > height) {
        data.height = height - data.y;
      }

      lst.push({
        ...data,
        bg: bg.hex,
        alpha: bg.alpha,
      });
    }
  }

  await browser.close();
  return lst;
};

export const getTexts = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const height = 1920;
  const width = 1080;

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto('https://amazon.com');

  const texts = await page.$$('h1, h2, h3, h4, h5, h6, p, a');

  let lst: any[] = [];

  for (const text of texts) {
    if (!(await text.isVisible())) {
      continue;
    }

    const computed = await text.evaluate((el) => window.getComputedStyle(el));
    const boundingBox = await text.boundingBox();

    if (
      !boundingBox ||
      boundingBox.x < 0 ||
      boundingBox.y < 0 ||
      boundingBox.x > width ||
      boundingBox.y > height
    ) {
      continue;
    }

    lst.push({ ...boundingBox });
  }

  // const computed = await text?.evaluate((el) => window.getComputedStyle(el));
  // const boundingBox = await text?.boundingBox();
  // console.log(text?.asElement());

  await browser.close();

  return lst;

  // for (const div of divs) {
  //   if (await div.isVisible()) {
  //     const box = await div.boundingBox();

  //     const computed = await div.evaluate((el) => {
  //       return window.getComputedStyle(el);
  //     });

  //     const bg = colorToHex(computed.backgroundColor);

  //     console.log(bg);
  //     if (bg.alpha !== 0) {
  //       lst.push({
  //         ...box,
  //         bg: bg.hex,
  //         alpha: bg.alpha,
  //       });
  //     }
  //   }
  // }

  await browser.close();
};
