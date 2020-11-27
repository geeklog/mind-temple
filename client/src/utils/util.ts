import {uniq, flatten} from 'lodash';

export function range(start: number, end: number) {
  if (end < start) {
    [start, end] = [end, start];
  }
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

export function interlace(arr: any[], brr: any[]) {
  arr = [...arr];
  brr = [...brr];
  const crr = [];
  while (arr.length || brr.length) {
    const a = arr.shift();
    const b = brr.shift();
    if (a !== undefined) { crr.push(a); }
    if (b !== undefined) { crr.push(b); }
  }
  return crr;
}

export function filenameInCurrPath() {
  return window.location.href.split('/').pop();
}

export function escapeRegex(str: string) {
  const escapeChars = '$[](){}|.*+?'.split('');
  for (const c of escapeChars) {
  str = str.replace(new RegExp('\\' + c, 'g'), '\\' + c);
  }
  str = str.replace(new RegExp('\\n', 'g'), '\\n');
  return str;
}

export function regex(str: string, flags: any) {
  const escapeChars = '$[](){}.*+?'.split('');
  for (const c of escapeChars) {
  str = str.replace(new RegExp('\\' + c, 'g'), '\\' + c);
  }
  return new RegExp(str, flags);
}

export function splitOnce(str: string, t: string) {
  const [first, ...rest] = str.split(t);
  return [first, rest.join(t)];
}

export function trims(arr: string[]) {
  return arr.map(s => s.trim()).filter(s => !!s);
}

export function trimLines(str: string) {
  return str.split('\n').map(s => s.trim()).join('\n');
}

export function splitChunk(text: string) {
  const lines = text.split('\n');
  const chunks = [];
  let chunk = '';
  for (const line of lines) {
    const trimedLine = line.trim();
    if (trimedLine) {
      chunk += line + '\n';
    } else {
      if (chunk) {
        chunks.push(chunk);
      }
      chunk = '';
    }
  }

  if (chunk) {
  chunks.push(chunk);
  }
  chunk = '';

  return chunks;
}

export function defaults(...values: any[]) {
  for (const v of Object.values(values)) {
    if (v) {
      return v;
    }
  }
}

export function defaultAttributes(...objs: any[]) {
  objs = objs.filter(Boolean);
  const keys = uniq(flatten(objs.map(Object.keys)));
  const res = {};
  for (const obj of objs) {
    for (const k of keys) {
      if (res[k] !== undefined) {
        continue;
      }
      res[k] = obj[k];
    }
  }
  return res;
}
