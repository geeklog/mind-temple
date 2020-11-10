
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