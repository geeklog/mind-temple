import { endsWith } from 'mikov/fn/op';
import path from 'path';
import os from 'os';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];

export const isImage = (filePath: string) =>
  endsWith(IMAGE_EXTS)(path.extname(filePath.toLowerCase()));

export const resolvePath = (fpath: string) =>
  fpath.replace('~', os.homedir());
