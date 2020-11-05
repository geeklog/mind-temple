import { endsWith } from 'mikov/fn/op';
import path from 'path';
import os from 'os';
import fs, { stat } from 'fs';
import sharp from 'sharp';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

export const isImage = (filePath: string) =>
  endsWith(IMAGE_EXTS)(path.extname(filePath.toLowerCase()));

export const resolvePath = (fpath: string) =>
  fpath.replace('~', os.homedir());

export async function describeFile(fpath: string) {
  fpath = resolvePath(fpath);
  const name = path.basename(fpath);
  const ext = path.extname(name);
  let width: number;
  let height: number;
  let type: string = 'file';

  let stats;
  try {
    stats = fs.statSync(fpath);
  } catch (error) {
    console.log(error);
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
  }

  if (isImage(fpath)) {
    type = 'image';
    const image = sharp(fpath, { failOnError: false });
    const meta = await image.metadata();
    width = meta.width;
    height = meta.height;
  }

  return {
    path: fpath,
    name,
    ext,
    type,
    width,
    height
  };
}
