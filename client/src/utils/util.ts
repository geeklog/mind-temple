
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
