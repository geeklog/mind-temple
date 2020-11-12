import { endsWith } from 'mikov/fn/op';
import { apiServer } from '../config';
import { FileDesc } from '../models/file';
import { dirname, joinPath } from '../utils/pathUtils';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif'];
const supportExtensions = new Set([
  '7z', 'aac', 'ai', 'archive', 'arj', 'audio', 'avi', 'css', 'csv', 'dbf', 'doc', 'dwg', 'exe', 'fla', 'flac', 'gif', 'html', 'iso', 'jpg', 'js', 'json', 'mdf', 'mp2', 'mp3', 'mp4', 'mxf', 'nrg', 'pdf', 'png', 'ppt', 'psd', 'rar', 'rtf', 'svg', 'text', 'tiff', 'txt', 'video', 'wav', 'wma', 'xls', 'xml', 'zip'
]);

export const isImage = (s: string) => endsWith(IMAGE_EXTS)(s.toLowerCase());

export function resolveExtension(ext: string) {
  if (!ext) {
    ext = 'unknown';
  }
  if (ext.startsWith('.')) {
    ext = ext.replace('.', '');
  }
  if (ext === 'jpeg') {
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

export interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

export async function browse(currPath: string): Promise<BrowseResponse> {
  try {
    const res = await fetch(`${apiServer}/browse/${encodeURIComponent(currPath)}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      ok: 1,
      message: error.message,
      files: []
    };
  }
}

export function file(filePath: string): string {
  return `${apiServer}/file/${filePath}`;
}

export function resolveRelativePath(parentPath: string, relativePath: string): string {
  return `${apiServer}/file/${encodeURIComponent(joinPath(dirname(parentPath), relativePath))}`;
}

export async function text(filePath: string) {
  const res = await fetch(`${apiServer}/file/${encodeURIComponent(filePath)}`);
  return await res.text();
}

export function thumb(file: FileDesc, size?: {w?: number, h?: number}): string {
  let postfix = '';
  if (size) {
    postfix += '?';
    let {w, h} = size;
    if (w) {
      postfix += 'w=' + w;
    }
    if (h) {
      postfix += 'h=' + h;
    }
  }
  return `${apiServer}/thumb/${encodeURIComponent(file.path)}${postfix}`;
}

export async function command(cmd: string, filePath: string) {
  try {
    const res = await fetch(`${apiServer}/cmd/${encodeURIComponent(filePath)}?cmd=${cmd}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      ok: 1,
      message: error.message,
    };
  }
}

export async function save(filePath: string, file: string) {
  await fetch(`${apiServer}/save/${encodeURIComponent(filePath)}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({file})
  });
}
