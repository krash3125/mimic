import {
  Browser,
  ElementHandle,
  Page,
  chromium,
  firefox,
  webkit,
} from 'playwright';
import rgb2hex from 'rgb2hex';
import { colorToHex } from './color';

type GetPageType = [Page, Browser];

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
}): Promise<GetPageType> => {
  const browser = await chromium.launch({
    headless,
  });
  const page = await browser.newPage();

  await page.setViewportSize({
    height: height,
    width: width,
  });

  await page.goto(url);

  return [page, browser];
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

      const styles = await getStyles(div);

      if (!styles.visible) {
        continue;
      }

      const computed = styles.style;

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

    const boundingBox = await text.boundingBox();

    if (!boundingBox) {
      continue;
    }

    const styles = await getStyles(text);

    // if (!styles.visible) {
    //   continue;
    // }

    const computed = styles.style;

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

const getStyles = async (el: ElementHandle<SVGElement | HTMLElement>) => {
  return await el.evaluate((elem) => {
    const style = getComputedStyle(elem);
    const isVisible = () => {
      if (elem instanceof SVGElement) return true;
      if (style.display === 'none') return false;
      if (style.visibility !== 'visible') return false;
      if (parseFloat(style.opacity) < 0.1) return false;
      const elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
      };
      // Maybe remove for divs
      if (
        elem.offsetWidth +
          elem.offsetHeight +
          elem.getBoundingClientRect().height +
          elem.getBoundingClientRect().width ===
        0
      ) {
        return false;
      }

      if (elemCenter.x < 0) return false;
      if (
        elemCenter.x >
        (document.documentElement.clientWidth || window.innerWidth)
      )
        return false;
      if (elemCenter.y < 0) return false;
      if (
        elemCenter.y >
        (document.documentElement.clientHeight || window.innerHeight)
      )
        return false;
      // ------

      let pointContainer = document.elementFromPoint(
        elemCenter.x,
        elemCenter.y
      );
      do {
        if (pointContainer === elem) return true;
      } while ((pointContainer = pointContainer?.parentNode as Element));
      return false;
    };

    return { style, visible: isVisible() };
    // return { style, visible: true };
  });
};

export const getDivs2 = async ({
  page,
  height,
  width,
}: {
  page: Page;
  height: number;
  width: number;
  url: string;
  headless?: boolean;
}) => {
  const divs = await page.$$('div, section, main, nav, button, a, body, html');
  let lst: any[] = [];

  for (const div of divs) {
    if (await div.isVisible()) {
      const box = await div.boundingBox();

      if (!box) {
        continue;
      }

      const styles = await getStyles(div);

      if (!styles.visible) {
        continue;
      }

      const computed = styles.style;

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
      });
    }
  }

  return lst;
};
