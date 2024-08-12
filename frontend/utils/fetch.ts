import { PageContext } from '@canva/design';
import { Element, getBoxJson } from './elements';

const BACKEND_URL = 'https://mimic.kushk.me';

const boxDataToElements = (data: any) => {
  let elements: Element[] = [];

  for (const box of data) {
    elements.push(
      getBoxJson({
        bg: box?.bg,
        height: box?.height,
        left: box?.x,
        top: box?.y,
        width: box?.width,
        borderRadiusTopLeft: box?.borderTopLeftRadius,
        borderRadiusTopRight: box?.borderTopRightRadius,
        borderRadiusBottomLeft: box?.borderBottomLeftRadius,
        borderRadiusBottomRight: box?.borderBottomRightRadius,
        borderColor: box?.borderColor,
        borderWidth: box?.borderWidth,
      })
    );
  }

  return elements;
};

const textDataToElements = (data: any) => {
  let elements: Element[] = [];

  for (const text of data) {
    elements.push({
      type: 'TEXT',
      children: [text?.text],
      width: text?.width,
      top: text?.y,
      left: text?.x,
      color: text?.fontColor,
      fontSize: text?.fontSize,
      fontWeight: text?.fontWeight,
      textAlign: text?.textAlign,
      //@ts-ignore
      fontRef: 'YAFcfoaHu-s:0',
    });
  }

  return elements;
};

export const fetchBoxes = async (url: string, pageContext: PageContext) => {
  if (!pageContext.dimensions) throw new Error('No dimensions found');
  const { height, width } = pageContext.dimensions;

  const res = await fetch(`${BACKEND_URL}/api/v1/scrape/boxes`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      height,
      width,
      url,
    }),
  });

  const data = await res.json();
  return boxDataToElements(data);
};

export const fetchTexts = async (url: string, pageContext: PageContext) => {
  if (!pageContext.dimensions) throw new Error('No dimensions found');
  const { height, width } = pageContext.dimensions;

  const res = await fetch(`${BACKEND_URL}/api/v1/scrape/texts`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      height,
      width,
      url,
    }),
  });

  const data = await res.json();
  return textDataToElements(data);
};

export const scrapeAll = async (
  url: string,
  pageContext: PageContext,
  include: {
    boxes: boolean;
    texts: boolean;
  }
) => {
  if (!include.boxes && !include.texts)
    throw new Error('No elements to scrape');
  if (!pageContext.dimensions) throw new Error('No dimensions found');

  const { boxes: includeBoxes, texts: includeTexts } = include;
  const { height, width } = pageContext.dimensions;

  const queryParams = new URLSearchParams({
    includeBoxes: includeBoxes.toString(),
    includeTexts: includeTexts.toString(),
  }).toString();

  const res = await fetch(`${BACKEND_URL}/api/v1/scrape/?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      height,
      width,
      url,
    }),
  });

  const data = await res.json();

  const boxes = includeBoxes ? boxDataToElements(data.boxes) : [];
  const texts = includeTexts ? textDataToElements(data.texts) : [];

  return [...boxes, ...texts];
};
