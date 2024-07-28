import {
  getCurrentPageContext,
  PageContext,
  PageDimensions,
} from '@canva/design';
import { addBox, Element } from './elements';

const BACKEND_URL = `http://localhost:5000`;

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

  let elements: Element[] = [];

  for (const box of data) {
    addBox({
      bg: box?.bg,
      height: box?.height,
      left: box?.x,
      top: box?.y,
      width: box?.width,
      borderRadiusTopLeft: box?.borderTopLeftRadius,
      borderRadiusTopRight: box?.borderTopRightRadius,
      borderRadiusBottomLeft: box?.borderBottomLeftRadius,
      borderRadiusBottomRight: box?.borderBottomRightRadius,
    });
  }

  return elements;
};

export const fetchTexts = async (url: string, pageContext: PageContext) => {
  if (!pageContext.dimensions) throw new Error('No dimensions found');
  const { height, width } = pageContext.dimensions;

  const res = await fetch(`${BACKEND_URL}/api/v1/scrape/texts2`, {
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
