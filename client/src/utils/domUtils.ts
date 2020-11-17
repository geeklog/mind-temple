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
