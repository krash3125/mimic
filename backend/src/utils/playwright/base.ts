import { Browser, ElementHandle, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

type GetPageType = [Page, Browser];

export const getPlaywright = async ({
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
  chromium.use(StealthPlugin());
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

export const getStyles = async (
  el: ElementHandle<SVGElement | HTMLElement>
) => {
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

      // This checks if y is larger than page which we dont neccessarily want to do
      // if (
      //   elemCenter.y >
      //   (document.documentElement.clientHeight || window.innerHeight)
      // )
      //   return false;
      // ------

      // In turn for the next function to work we have to adjust the y check values
      const screenHeight =
        document.documentElement.clientHeight || window.innerHeight;
      let pointContainer;
      if (elemCenter.y > screenHeight) {
        //this readjusted the y value according to the new determined height of the box
        const elementTop = elem.getBoundingClientRect().top;
        const newY = elementTop + (screenHeight - elementTop) / 2;
        pointContainer = document.elementFromPoint(elemCenter.x, newY);
      } else {
        pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
      }

      do {
        if (pointContainer === elem) return true;
      } while ((pointContainer = pointContainer?.parentNode as Element));
      return false;
    };

    return { style, visible: isVisible() };
  });
};

export const convertWeightToText = (weight: string) => {
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

export const pxToInt = (px: string) => parseInt(px.replace('px', ''));
