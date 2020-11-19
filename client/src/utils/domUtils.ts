import {XmlEntities} from 'html-entities';

export function withinBounds(
  {x, y}: {x: number, y: number},
  bounds?: DOMRect
) {
  if (!bounds) {
    return false;
  }
  if (x < bounds.left) {
    return false;
  }
  if (y < bounds.top) {
    return false;
  }
  if (x > bounds.right) {
    return false;
  }
  if (y > bounds.bottom) {
    return false;
  }
  return true;
}

export function blockWheelWithin(ref: () => HTMLElement | null) {
  return (event: React.WheelEvent<HTMLDivElement>) => {
    if (withinBounds({x: event.clientX, y: event.clientY}, ref()?.getBoundingClientRect())) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
}

const entities = new (XmlEntities as any)();

export function encodeHTMLEntities(text: string) {
  return entities.encode(text);
}

export function decodeHTMLEntities(text: string) {
  return entities.decode(text).replace(/<br>/g, '\n');
}

export function moveCaretToEnd(div: HTMLDivElement) {
  const range = document.createRange();
  range.selectNodeContents(div);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export async function loadImageData(src: string) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  const imgData: any = await new Promise((resolve) => {
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.src = src;
  });
  return imgData;
}
