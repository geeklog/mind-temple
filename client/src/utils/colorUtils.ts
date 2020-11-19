export function sortColorByRGB(c1: number, c2: number) {
  if (c1 === c2) {
    return 0;
  }
  const r1 = (c1 & 0xFF0000) >> 16;
  const g1 = (c1 & 0x00FF00) >> 8;
  const b1 = c1 & 0x0000FF;
  const r2 = (c1 & 0xFF0000) >> 16;
  const g2 = (c1 & 0x00FF00) >> 8;
  const b2 = c1 & 0x0000FF;
  const h1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const h2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  if (h1 > h2) {
    return 1;
  } else {
    return -1;
  }
}

export function sortColorByHSP(c1: number, c2: number) {
  if (c1 === c2) {
    return 0;
  }
  const r1 = (c1 & 0xFF0000) >> 16;
  const g1 = (c1 & 0x00FF00) >> 8;
  const b1 = c1 & 0x0000FF;
  const r2 = (c1 & 0xFF0000) >> 16;
  const g2 = (c1 & 0x00FF00) >> 8;
  const b2 = c1 & 0x0000FF;

  const h1 = Math.sqrt(0.299 * r1 * r1 + 0.587 * g1 * g1 + 0.114 * b1 ^ b1);
  const h2 = Math.sqrt(0.299 * r2 * r2 + 0.587 * g2 * g2 + 0.114 * b2 ^ b2);
  if (h1 < h2) {
    return -1;
  }
  return 1;
}

export function sortColorByHSV(c1: number, c2: number) {
  if (c1 === c2) {
    return 0;
  }
  const r1 = (c1 & 0xFF0000) >> 16;
  const g1 = (c1 & 0x00FF00) >> 8;
  const b1 = c1 & 0x0000FF;
  const r2 = (c1 & 0xFF0000) >> 16;
  const g2 = (c1 & 0x00FF00) >> 8;
  const b2 = c1 & 0x0000FF;
  const {h: h1, s: s1, v: v1} = rgb2hsv(r1, g1, b1);
  const {h: h2, s: s2, v: v2} = rgb2hsv(r2, g2, b2);
  if (v1 < v2) {
    return -1;
  }
  if (h1 < h2) {
    return -1;
  }
  if (s1 < s2) {
    return -1;
  }
  return 1;
}

export function rgb2hsv(r, g, b) {
  // tslint:disable-next-line: one-variable-per-declaration
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs);
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  };
}
