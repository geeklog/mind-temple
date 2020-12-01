import { resolvePath } from '../util/fileUtil';
import fs from 'fs-extra';
import path from 'path';
import cache from '../services/cache';

export default async (req, res) => {
  const errors = [];
  try {
    const files = req.body.files.map(f => resolvePath(f));
    const currFolder = path.dirname(files[0]);
    const targetPath = resolvePath(req.body.targetPath);
    for (const file of files) {
      const dest = path.join(targetPath, path.basename(file));
      try {
        fs.moveSync(file, dest);
      } catch (error) {
        if (error.message.startsWith('EACCES: permission denied')) {
          errors.push('Permission denied');
        } else {
          console.log('error', error);
          errors.push('File name duplicated: ' + path.basename(file));
        }
      }
    }
    cache.purge(currFolder);
    cache.purge(targetPath);
    res.json({
      ok: 1,
      error: errors
    });
  } catch (error) {
    res.json({
      ok: 0,
      error: [error.message]
    });
  }
};
