
export function splitAt(str: string, at: number) {
  const arr = [];
  let i = 0;
  let chunk = str.slice(i, at);
  arr.push(chunk);
  while (chunk) {
    i += at;
    chunk = str.slice(i, i + at);
    arr.push(chunk);
  }
  return arr;
}
