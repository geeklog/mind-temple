import { resolvePath } from '../util/fileUtil';
import fs from 'fs-extra';
import path from 'path';
import cache from '../services/cache';

export default async (req, res) => {
  try {
    let resourcePath = req.path.replace('\/create\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const currPath = resolvePath(resourcePath);
    const {newName, type} = req.body;
    const newFile = path.join(currPath, newName);
    if (type === 'folder') {
      fs.mkdirSync(newFile);
      cache.purge(currPath);
      return res.json({
        ok: 1,
        newFile
      });
    } else if (type === 'file') {
      console.log('createFile', newFile);
      fs.createFileSync(newFile);
      cache.purge(currPath);
      return res.json({
        ok: 1,
        newFile
      });
    } else {
      return res.json({
        ok: 0,
        message: `Unsupport type: ${type}`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      ok: 0,
      message: error.message,
      files: []
    });
  }
};
