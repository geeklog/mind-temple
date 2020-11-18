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
    if (fs.existsSync(newPath)) {
      return res.json({
        ok: 0,
        error: 'Name duplicated'
      });
    }
    fs.renameSync(oldPath, newPath);
    cache.purge(oldPath);
    res.json({
      ok: 1
    });
  } catch (error) {
    res.json({
      ok: 0,
      error: error.message
    });
  }
};
