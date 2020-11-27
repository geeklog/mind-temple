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
        errors.push('Folder contains file that has same name: ' + path.basename(file));
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
