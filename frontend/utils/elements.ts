import {
  addNativeElement,
  getCurrentPageContext,
  NativeElement,
  NativeElementWithBox,
} from '@canva/design';

export const getBoxJson = ({
  left,
  top,
  width,
  height,
  bg,
  borderRadiusBottomLeft,
  borderRadiusBottomRight,
  borderRadiusTopLeft,
  borderRadiusTopRight,
  borderColor,
  borderWidth,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
  borderRadiusBottomLeft: number;
  borderRadiusBottomRight: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderColor: string;
  borderWidth: number;
}): Element => {
  return {
    type: 'SHAPE',
    paths: [
      {
        d: getBoxPath({
          left,
          top,
          width,
          height,
          borderRadiusBottomLeft,
          borderRadiusBottomRight,
          borderRadiusTopLeft,
          borderRadiusTopRight,
        }),
        fill: {
          color: bg === 'transparent' || bg === 'img' ? undefined : bg,
          dropTarget: bg === 'img',
        },
        stroke: {
          weight: borderWidth,
          color: borderColor,
          strokeAlign: 'inset',
        },
      },
    ],
    viewBox: {
      height: height,
      width: width,
      top: top,
      left: left,
    },
    height: height,
    width: width,
    top: top,
    left: left,
  };
};

export const addBox = ({
  left,
  top,
  width,
  height,
  bg,
  borderRadiusBottomLeft,
  borderRadiusBottomRight,
  borderRadiusTopLeft,
  borderRadiusTopRight,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
  borderRadiusBottomLeft: number;
  borderRadiusBottomRight: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
}) => {
  addNativeElement({
    type: 'SHAPE',
    paths: [
      {
        d: getBoxPath({
          left,
          top,
          width,
          height,
          borderRadiusBottomLeft,
          borderRadiusBottomRight,
          borderRadiusTopLeft,
          borderRadiusTopRight,
        }),
        fill: {
          color: bg,
        },
      },
    ],
    viewBox: {
      height: height,
      width: width,
      top: top,
      left: left,
    },
    height: height,
    width: width,
    top: top,
    left: left,
  });
};

export const getBoxPath = ({
  left = 0,
  top = 0,
  width = 100,
  height = 100,
  borderRadiusTopLeft = 0,
  borderRadiusTopRight = 0,
  borderRadiusBottomRight = 0,
  borderRadiusBottomLeft = 0,
}: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  borderRadiusTopLeft?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomRight?: number;
  borderRadiusBottomLeft?: number;
}) => {
  if (borderRadiusTopLeft > height / 2) borderRadiusTopLeft = height / 2;
  if (borderRadiusTopRight > height / 2) borderRadiusTopRight = height / 2;
  if (borderRadiusBottomRight > height / 2)
    borderRadiusBottomRight = height / 2;
  if (borderRadiusBottomLeft > height / 2) borderRadiusBottomLeft = height / 2;

  const right = left + width;
  const bottom = top + height;

  return `
    M ${left + borderRadiusTopLeft} ${top}
    H ${right - borderRadiusTopRight}
    A ${borderRadiusTopRight} ${borderRadiusTopRight} 0 0 1 ${right} ${
    top + borderRadiusTopRight
  }
    V ${bottom - borderRadiusBottomRight}
    A ${borderRadiusBottomRight} ${borderRadiusBottomRight} 0 0 1 ${
    right - borderRadiusBottomRight
  } ${bottom}
    H ${left + borderRadiusBottomLeft}
    A ${borderRadiusBottomLeft} ${borderRadiusBottomLeft} 0 0 1 ${left} ${
    bottom - borderRadiusBottomLeft
  }
    V ${top + borderRadiusTopLeft}
    A ${borderRadiusTopLeft} ${borderRadiusTopLeft} 0 0 1 ${
    left + borderRadiusTopLeft
  } ${top}
  `
    .replace(/\s+/g, ' ')
    .trim();
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type Element = NativeElement | NativeElementWithBox;

export const delayAddElements = async (elements: Element[]) => {
  const BATCH_SIZE = 20;
  const DELAY_MS = 10000;

  for (let i = 0; i < elements.length; i += BATCH_SIZE) {
    const batch = elements.slice(i, i + BATCH_SIZE);

    batch.forEach((element) => {
      addNativeElement(element);
    });

    if (i + BATCH_SIZE < elements.length) {
      await delay(DELAY_MS);
    }
  }
};
