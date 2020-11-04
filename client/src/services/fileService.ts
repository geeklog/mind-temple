import { apiServer } from '../config';
import { FileDesc } from '../models/file';

export interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

export async function browse(folderPath: string): Promise<BrowseResponse> {
  try {
    const res = await fetch(`${apiServer}/browse/${encodeURIComponent(folderPath)}`);
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

export function thumb(filePath: string, size?: {w?: number, h?: number}): string {
  let postfix = '';
  if (size) {
    postfix += '?'
    let {w, h} = size;
    if (w) {
      postfix += 'w=' + w;
    }
    if (h) {
      postfix += 'h=' + h;
    }
  }
  return `${apiServer}/thumb/${encodeURIComponent(filePath)}${postfix}`;
}