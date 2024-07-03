import rgb2hex from 'rgb2hex';
import Color from 'colorjs.io';

export const colorToHex = (color: string) => {
  if (color.includes('rgb')) {
    return rgb2hex(color);
  }

  const c = new Color(color);
  const sRgb = c.to('sRgb');
  const r = Math.round(sRgb.coords[0] * 255);
  const g = Math.round(sRgb.coords[1] * 255);
  const b = Math.round(sRgb.coords[2] * 255);
  const alpha = sRgb.alpha;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;

  return {
    hex: rgb2hex(rgbStr).hex,
    alpha: alpha,
  };
};
