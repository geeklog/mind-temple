import { endsWith } from 'mikov/fn/op';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
const SRCCODE_EXTS = ['c', 'cpp', 'java', 'scala', 'py', 'json', 'yml', 'html', 'js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'php', 'lua', 'sql', 'go', 'swift', 'rb', 'rust', 'dart', 'lisp', 'perl', 'sh'];
const OTHER_EXTS = ['7z', 'aac', 'ai', 'archive', 'arj', 'audio', 'avi', 'css', 'csv', 'dbf', 'doc', 'dwg', 'exe', 'fla', 'flac', 'gif', 'html', 'iso', 'jpg', 'js', 'json', 'mdf', 'mp2', 'mp3', 'mp4', 'mxf', 'nrg', 'pdf', 'png', 'ppt', 'psd', 'rar', 'rtf', 'svg', 'webp', 'text', 'tiff', 'txt', 'video', 'wav', 'wma', 'xls', 'xml', 'zip'];

const supportExtensions = new Set([
  // ...IMAGE_EXTS,
  // ...SRCCODE_EXTS,
  ...OTHER_EXTS
]);

export const isImageExt = (s: string) => {
  s = s.startsWith('.') ? s.replace('.', '') : s;
  return endsWith(IMAGE_EXTS)((s).toLowerCase());
};

export const isSourceCode = (s: string) => {
  s = s.startsWith('.') ? s.replace('.', '') : s;
  return endsWith(SRCCODE_EXTS)(s.toLowerCase());
};

export const languageType = (ext: string) => {
  ext = ext.replace('.', '');
  if (ext === 'ts' || ext === 'tsx') {
    return 'typescript';
  }
  if (ext === 'js' || ext === 'jsx') {
    return 'javascript';
  }
  if (ext === 'sh') {
    return 'shell';
  }
  if (ext === 'yml') {
    return 'yaml';
  }
  if (ext === 'py') {
    return 'python';
  }
  return ext;
};

export function resolveExtensionForThumb(ext: string) {
  if (!ext) {
    ext = 'unknown';
  }
  if (ext.startsWith('.')) {
    ext = ext.replace('.', '');
  }
  if (ext === 'webp' || ext === 'svg' || ext === 'jpeg') {
    ext = 'jpg';
  }
  if (ext === 'md') {
    ext = 'txt';
  }
  if (ext === 'apk') {
    ext = 'zip';
  }
  if (ext === 'dmg') {
    ext = 'doc';
  }
  if (ext === 'docx') {
    ext = 'doc';
  }
  if (ext === 'xlsx') {
    ext = 'xls';
  }
  if (ext === 'br') {
    ext = 'zip';
  }
  if (!supportExtensions.has(ext)) {
    ext = 'unknown';
  }
  return ext;
}
