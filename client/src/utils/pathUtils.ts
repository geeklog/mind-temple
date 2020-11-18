export const joinPath = (...parts: string[]) => {
  return parts.map((p, i) => {
    if (p.endsWith('/')) {
      p = p.substring(0, p.length - 1);
    }
    if (i !== 0 && p.startsWith('/')) {
      p = p.substring(1);
    }
    if (p.startsWith('./')) {
      p = p.substring(2);
    }
    return p;
  }).join('/');
};

export const dirname = (path: string) => {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/');
};

export const fname = (path: string) => {
  const parts = path.split('/');
  return parts.pop();
};
