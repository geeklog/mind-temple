import fs from 'fs';
import os from 'os';
import path from 'path';
import { endsWith } from 'mikov/fn/op';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif'];
const isImage = endsWith(IMAGE_EXTS);

export default (req, res) => {
  try {
    const resourcePath: string = req.url.replace(/\/browse\/?/, '');
    const folderPath = resourcePath.replace('~', os.homedir());
    const files =
      fs.readdirSync(folderPath)
        .filter(isImage)
        .map(fileName => ({
          path: path.join('/file/', resourcePath, fileName),
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
