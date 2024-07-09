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

  const divs = await page.$$('div, section, main, nav, button, a, body, html');
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
        borderTopLeftRadius: computed.borderTopLeftRadius,
        borderTopRightRadius: computed.borderTopRightRadius,
        borderBottomLeftRadius: computed.borderBottomLeftRadius,
        borderBottomRightRadius: computed.borderBottomRightRadius,
        borderWidth: computed.borderWidth,
        borderColor: computed.borderColor,
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
export const getTexts = async ({
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
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto(url);

  const texts = await page.$$(
    'div, h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, button'
  );

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

    const innerText = await text.innerText();
    const el = await text.innerHTML();

    computed.fontSize;

    if (innerText && innerText === el) {
      lst.push({
        ...boundingBox,
        text: innerText,
        fontSize: parseInt(computed.fontSize.replace('px', '')),
        fontWeight: convertWeightToText(computed.fontWeight),
        fontFamily: computed.fontFamily,
        fontStyle: computed.fontStyle,
        textAlign: computed.textAlign,
        fontColor: colorToHex(computed.color).hex,
        textDecoration: computed.textDecoration,
      });
    }
  }

  await browser.close();

  return lst;
};

const convertWeightToText = (weight: string) => {
  const w = parseInt(weight);
  switch (w) {
    case 100:
      return 'thin';
    case 200:
      return 'extralight';
    case 300:
      return 'light';
    case 400:
      return 'normal';
    case 500:
      return 'medium';
    case 600:
      return 'semibold';
    case 700:
      return 'bold';
    case 800:
      return 'ultrabold';
    case 900:
      return 'heavy';
    default:
      return 'normal';
  }
};
