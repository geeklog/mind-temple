import fs from 'fs';
import os from 'os';
import path from 'path';
import { endsWith } from 'mikov/fn/op';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif'];
const isImage = (s: string) => endsWith(IMAGE_EXTS)(s.toLowerCase());

export default (req, res) => {
  try {
    let resourcePath: string = req.url.replace(/\/browse\/?/, '');
    resourcePath = decodeURIComponent(resourcePath);
    const folderPath = resourcePath.replace('~', os.homedir());
    const files =
      fs.readdirSync(folderPath)
        .filter(isImage)
        .map(fileName => ({
          path: path.join(resourcePath, fileName),
          name: fileName
        }))
      ;
    res.json({
      ok: 1,
      files
    });
  } catch (error) {
    res.json({
      ok: 0,
      message: 'Folder not found',
      files: []
    });
  }
};
