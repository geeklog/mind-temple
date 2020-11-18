import { resolvePath } from '../util/fileUtil';
import fs from 'fs-extra';
import path from 'path';
import cache from '../services/cache';

export default async (req, res) => {
  try {
    let resourcePath = req.path.replace('\/rename\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const oldPath = resolvePath(resourcePath);
    const newPath = path.join(path.dirname(oldPath), req.body.newName);
    if (oldPath === newPath) {
      return res.json({
        ok: 1
      });
    }
    fs.renameSync(oldPath, newPath);
    cache.purge(oldPath);
    res.json({
      ok: 1
    });
  } catch (error) {
    console.log(error);
    res.status(404);
    res.json({
      ok: 0,
      message: 'File not exist',
      files: []
    });
  }
};
