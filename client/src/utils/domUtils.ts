import { XmlEntities } from 'html-entities';

export function withinBounds(
  { x, y }: { x: number; y: number },
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
    if (
      withinBounds(
        { x: event.clientX, y: event.clientY },
        ref()?.getBoundingClientRect()
      )
    ) {
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

export function boundsInScreen(
  element: HTMLElement,
  { x, y, padding }: { x?: number; y?: number; padding?: number } = {}
) {
  const elRect = element.getBoundingClientRect();
  x = x || elRect.x;
  y = y || elRect.y;
  padding = padding || 50;
  const w = elRect.width;
  const h = elRect.height;
  if (x < padding) {
    x = padding;
  }
  if (x + w > window.innerWidth - padding) {
    x = window.innerWidth - padding - w;
  }
  if (y < padding) {
    y = padding;
  }
  if (y + w > window.innerHeight - padding) {
    y = window.innerHeight - padding - h;
  }
  return { x, y };
}

export function isClickOnElement(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  className: string
) {
  let el = event.target;
  while (el) {
    if ((el as HTMLElement).classList.contains(className)) {
      return true;
    }
    el = (el as HTMLElement).parentElement;
  }
  return false;
}

export function moveCaretToEnd(div: HTMLDivElement) {
  const range = document.createRange();
  range.selectNodeContents(div);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export async function loadImageData(src: string): Promise<ImageData> {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  const imgData: ImageData = await new Promise((resolve) => {
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.src = src;
  });
  return imgData;
}

export function bubbleIframeMouseMove(iframe) {
  // Save any previous onmousemove handler
  let existingOnMouseMove = iframe.contentWindow.onmousemove;

  // Attach a new onmousemove listener
  iframe.contentWindow.onmousemove = function(e) {
    // Fire any existing onmousemove listener
    if (existingOnMouseMove) {
      existingOnMouseMove(e);
    }

    // Create a new event for the this window
    let evt = document.createEvent('MouseEvents');

    // We'll need this to offset the mouse move appropriately
    let boundingClientRect = iframe.getBoundingClientRect();

    // Initialize the event, copying exiting event values
    // for the most part
    evt.initMouseEvent(
      'mousemove',
      true, // bubbles
      false, // not cancelable
      window,
      e.detail,
      e.screenX,
      e.screenY,
      e.clientX + boundingClientRect.left,
      e.clientY + boundingClientRect.top,
      e.ctrlKey,
      e.altKey,
      e.shiftKey,
      e.metaKey,
      e.button,
      null // no related element
    );

    // Dispatch the mousemove event on the iframe element
    iframe.dispatchEvent(evt);
  };
}
