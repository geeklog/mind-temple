import { endsWith } from 'mikov/fn/op';
import path from 'path';
import os from 'os';
import fs from 'fs';
import sharp from 'sharp';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
const TXT_EXTS = ['txt'];
const MD_EXTS = ['md', 'mdx'];

export const isImage = (filePath: string) =>
  endsWith(IMAGE_EXTS)(path.extname(filePath.toLowerCase()));

export const isPlainText = (filePath: string) =>
  endsWith(TXT_EXTS)(path.extname(filePath.toLowerCase()));

export const isMarkdown = (filePath: string) =>
  endsWith(MD_EXTS)(path.extname(filePath.toLowerCase()));

export const resolvePath = (fpath: string) =>
  fpath.replace('~', os.homedir());

export async function describeFile(fpath: string, deep = 2) {
  const name = path.basename(fpath);
  const ext = path.extname(name);

  let width: number;
  let height: number;
  let type: string = 'file';
  let subs;
  let stats;
  let size;
  let ctime;
  let atime;
  let mtime;
  let broken: boolean = false;
  try {
    stats = fs.statSync(fpath);
    atime = stats.atime;
    ctime = stats.ctime;
    mtime = stats.mtime;
    size  = stats.size;
    // console.log(stats);
  } catch (error) {
    console.log('Error when load file stat:', fpath, error);
    return {
      path: fpath,
      name,
      ext,
      type,
      broken: true
    };
  }

  if (stats.isDirectory()) {
    type = 'folder';
    if (deep > 0) {
      subs = await Promise.all(fs.readdirSync(fpath).map(subFname => {
        const subFile = describeFile(path.join(fpath, subFname), deep - 1);
        return subFile;
      }));
    }
  }

  if (isImage(fpath)) {
    type = 'image';
    try {
      const image = sharp(fpath, { failOnError: false });
      const meta = await image.metadata();
      width = meta.width;
      height = meta.height;
      broken = true;
    } catch (error) {
      console.log('Error when load image meta:', fpath, error);
    }
  }

  if (isPlainText(fpath)) {
    type = 'text';
  }

  if (isMarkdown(fpath)) {
    type = 'markdown';
  }

  return {
    path: fpath,
    name,
    ext,
    type,
    broken,
    width,
    height,
    atime,
    ctime,
    mtime,
    size,
    subs
  };
}
