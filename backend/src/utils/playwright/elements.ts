import { Page } from 'playwright';
import { colorToHex } from '../color';
import {
  convertTextAlign,
  convertWeightToText,
  getStyles,
  pxToInt,
} from './base';

export const getBoxes = async ({
  page,
  height,
  width,
}: {
  page: Page;
  height: number;
  width: number;
}) => {
  const boxes = await page.$$(
    'div, section, main, nav, button, a, body, html, li, td, th, label, img, span, input, select, h1, h2, h3, h4, h5, h6, p, aside'
  );

  let return_list: any[] = [];

  for (const box of boxes) {
    // Check if is image
    const tag = await box.evaluate((element) => element.tagName.toLowerCase());

    const isImage = await box.evaluate(
      (element) => element.tagName.toLowerCase() === 'img'
    );

    // Root check for visibility
    const isVisibleRoot = await box.isVisible();

    if (!isVisibleRoot) {
      continue;
    }

    // Check available bounding box
    const bb = await box.boundingBox();

    if (!bb) {
      continue;
    }

    // Get advanced styles and check for visibility
    const { style, visible } = await getStyles(box);

    if (isImage) {
      const parentBox = await box.evaluateHandle(
        (element) => element.parentElement
      );
      const parentBB = await parentBox.asElement()?.boundingBox();
      const tagName = await parentBox
        .asElement()
        ?.evaluate((element) => element.tagName.toLowerCase());

      if (tagName === 'div') {
        if (parentBB && bb.width > parentBB.width) {
          bb.width = parentBB.width;
          bb.x = parentBB.x;
        }

        if (parentBB && bb.height > parentBB.height) {
          bb.height = parentBB.height;
          bb.y = parentBB.y;
        }
      }
    }

    if (!visible) {
      continue;
    }

    const {
      backgroundColor,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
      borderColor,
    } = style;

    // Parse color
    let { hex, alpha } = colorToHex(backgroundColor);
    let { hex: borderHex, alpha: alphaHex } = colorToHex(borderColor);

    if (isImage) {
      hex = 'img';
      alpha = 1;
      alphaHex = 0;
    }

    // TODO: See if border color matches up an all 4 sides

    const newBorderWidth =
      alphaHex === 0
        ? 0
        : Math.max(
            pxToInt(borderLeftWidth),
            pxToInt(borderRightWidth),
            pxToInt(borderTopWidth),
            pxToInt(borderBottomWidth)
          );

    // TODO: For divs i think it is removing background color elements that are over the height so we need to fix that amazon example id="pageContent"

    // Fill element data
    let el_data = {
      ...bb,
      bg: hex,
      alpha: alpha,
      borderTopLeftRadius: pxToInt(borderTopLeftRadius),
      borderTopRightRadius: pxToInt(borderTopRightRadius),
      borderBottomLeftRadius: pxToInt(borderBottomLeftRadius),
      borderBottomRightRadius: pxToInt(borderBottomRightRadius),
      borderWidth: newBorderWidth,
      borderColor: borderHex,
    };

    // Run fixes on elements

    if (alpha === 0 && newBorderWidth === 0) {
      continue;
    } else if (alpha === 0) {
      el_data.bg = 'transparent';
    }

    if (
      bb.x < 0 ||
      bb.y < 0 ||
      bb.x > width ||
      bb.y > height ||
      bb.width === 0 ||
      bb.height === 0
    ) {
      continue;
    }

    // Fix width and height if off screen
    if (bb.width + bb.x > width) {
      el_data.width = width - bb.x;
    }

    if (bb.height + bb.y > height) {
      el_data.height = height - bb.y;
    }

    // SOME TESTING

    return_list.push(el_data);
  }

  return return_list;
};

const TEXT_CONVERSION_FACTOR = 0.9;

export const getTexts = async ({
  page,
  height,
  width,
}: {
  page: Page;
  height: number;
  width: number;
}) => {
  const texts = await page.$$(
    'div, h1, h2, h3, h4, h5, h6, p, pre, span, a, li, td, th, label, button, strong, u, bold, input, select, legend'
  );

  let return_list: any[] = [];

  for (const text of texts) {
    // Check if text is blank
    const innerText = await text.innerText();
    if (!innerText || innerText.trim() === '') {
      continue;
    }

    // Root check for visibility
    const isVisibleRoot = await text.isVisible();

    if (!isVisibleRoot) {
      continue;
    }

    // Check available bounding box
    const bb = await text.boundingBox();

    if (!bb) {
      continue;
    }

    // Get advanced styles and check for visibility
    const { style, visible } = await getStyles(text);

    if (!visible) {
      continue;
    }

    if (
      bb.x < 0 ||
      bb.y < 0 ||
      bb.x > width ||
      bb.y > height ||
      bb.y + bb.height > height ||
      bb.x + bb.width > width
      // || bb.width === 0 ||
      // bb.height === 0
    ) {
      continue;
    }

    // HERE CHECK INNER TEXT AND PARENT INNER TEXT AND IF THEY ARE BOTH THE SAME THEN ADD TO LIST

    const el = (await text.innerHTML()).replaceAll(/<\!--.*?-->/g, '');

    const {
      fontSize,
      fontWeight,
      fontFamily,
      fontStyle,
      textAlign,
      color,
      textDecoration,
      alignItems,
    } = style;

    const newTextAlign = convertTextAlign(textAlign, alignItems);

    const fontsizeNum = pxToInt(fontSize);

    // Calculate conversions for accurte sizing and positioning
    const newFontSize = fontsizeNum * TEXT_CONVERSION_FACTOR;
    const containerHeight = bb?.height;
    const y_shift = (containerHeight - newFontSize) / 2;
    const top = bb.y + y_shift;

    if (innerText && innerText.toLowerCase() === el.toLowerCase()) {
      return_list.push({
        x: bb.x,
        y: top,
        width: bb.width,
        text: innerText,
        fontSize: newFontSize,
        fontWeight: convertWeightToText(fontWeight),
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        textAlign: newTextAlign,
        fontColor: colorToHex(color).hex,
        textDecoration: textDecoration,
      });
    }
  }

  return return_list;
};
