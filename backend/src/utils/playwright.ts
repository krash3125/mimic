import { Page, chromium, firefox, webkit } from 'playwright';
import rgb2hex from 'rgb2hex';
import { colorToHex } from './color';

export const getPage = async ({
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
  const browser = await chromium.launch({
    headless,
  });
  const page = await browser.newPage();

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto(url);

  return page;
};

// http://localhost:5000/api/v1/scrape/divs
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
        borderRadius: computed.borderRadius,
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
        borderRadius: computed.borderRadius,
      });
    }
  }

  await browser.close();
  return lst;
};

// http://localhost:5000/api/v1/scrape/text
export const getTexts = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const height = 1920;
  const width = 1080;

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto('https://purduepool.com');

  const texts = await page.$$('h1, h2, h3, h4, h5, h6, p, a');

  let lst: any[] = [];

  for (const text of texts) {
    if (!(await text.isVisible())) {
      continue;
    }
    
    const textContent = await text.evaluate((el) => el.textContent);
    const computed = await text.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        fontStyle: style.fontStyle,
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
      };
    });

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

    lst.push({
      text: textContent,
      boundingBox: boundingBox,
      color: computed.color,
      fontStyle: computed.fontStyle,
      fontWeight: computed.fontWeight,
      fontSize: computed.fontSize,
    });
  }

  await browser.close();

  return lst;
};
