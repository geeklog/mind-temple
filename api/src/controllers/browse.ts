import fs from 'fs';
import path from 'path';
import { describeFile, resolvePath } from '../util/fileUtil';

export default async (req, res) => {
  try {
    let resourcePath: string = req.path.replace('\/browse\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const currPath = resolvePath(resourcePath);
    const files = await Promise.all(
      fs.readdirSync(currPath)
        .map(fileName => describeFile(path.join(resourcePath, fileName)))
    );
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
