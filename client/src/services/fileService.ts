import { apiServer } from '../config';
import { BrowseResponse, FileDesc } from '../models/file';
import { post } from '../utils/fetchUtils';
import { dirname, joinPath } from '../utils/pathUtils';

export { apiServer } from '../config';

export async function browse(currPath: string): Promise<BrowseResponse> {
  try {
    const res = await fetch(`${apiServer}/browse/${encodeURIComponent(currPath)}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      ok: 1,
      message: error.message,
      file: null
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

export function getSSRBookSrc(filePath: string): string {
  return `${apiServer}/book/${encodeURIComponent(filePath)}`;
}

export async function loadSSRBookContent(filePath: string) {
  return await (await fetch(`${apiServer}/book/${encodeURIComponent(filePath)}`)).text();
}

export async function trash(filePaths: string[]) {
  return await post(`${apiServer}/trash`, {
    files: filePaths
  });
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

export async function create(filePath: string, newName: string, type: string) {
  const data = await post(`${apiServer}/create/${encodeURIComponent(filePath)}`, {
    newName,
    type
  });
  if (data.ok) {
    return data.newFile;
  }
}

export async function rename(filePath: string, newName: string) {
  return await post(`${apiServer}/rename/${encodeURIComponent(filePath)}`, { newName });
}

export async function moveFiles(files: FileDesc[], targetPath: string) {
  return await post(`${apiServer}/move/`, {
    files: files.map(f => f.path),
    targetPath
  });
}

export async function save(filePath: string, file: string) {
  await post(`${apiServer}/save/${encodeURIComponent(filePath)}`, {file});
}
