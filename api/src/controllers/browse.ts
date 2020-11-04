import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { isImage, resolvePath } from '../util/fileUtil';

export default async (req, res) => {
  try {
    let resourcePath: string = req.url.replace(/\/browse\/?/, '');
    resourcePath = decodeURIComponent(resourcePath);
    const folderPath = resolvePath(resourcePath);
    let files =
      fs.readdirSync(folderPath)
        .map(fileName => ({
          path: path.join(resourcePath, fileName),
          name: fileName,
          ext: path.extname(fileName)
        }));
    files = await Promise.all(files.map(async file => {
      if (isImage(file.path)) {
        const fpath = resolvePath(file.path);
        const image = sharp(fpath, { failOnError: false });
        const { width, height } = await image.metadata();
        return {...file, width, height};
      } else {
        return file;
      }
    }));
    res.json({
      ok: 1,
      files
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: 0,
      message: 'Folder not found',
      files: []
    });
  }
};
