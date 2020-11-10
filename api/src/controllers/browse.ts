import fs from 'fs';
import path from 'path';
import { describeFile, resolvePath } from '../util/fileUtil';

export default async (req, res) => {
  let resourcePath: string = req.path.replace('\/browse\/', '');
  resourcePath = decodeURIComponent(resourcePath);
  const currPath = resolvePath(resourcePath);
  try {
    const files = await Promise.all(
      fs.readdirSync(currPath)
        .map(fileName => describeFile(path.join(currPath, fileName)))
    );
    res.json({
      ok: 1,
      files
    });
  } catch (error) {
    console.error('Error when browse:', currPath, error);
    res.json({
      ok: 0,
      message: 'Folder not found',
      files: []
    });
  }
};
