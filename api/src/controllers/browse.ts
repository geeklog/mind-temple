import fs from 'fs';
import { describeFile, resolvePath } from '../util/fileUtil';

let caches = {};

let watcher;

export default async (req, res) => {
  let resourcePath: string = req.path.replace('\/browse\/', '');
  resourcePath = decodeURIComponent(resourcePath);
  const currPath = resolvePath(resourcePath);

  if (watcher) {
    watcher.close();
  }

  watcher = fs.watch(currPath, { recursive: true}, (event, name) => {
    if (name.startsWith('/Users/livestar/Library/Application Support')) {
      return;
    }
    if (name.startsWith('/Users/livestar/Library/')) {
      return;
    }
    console.log('fileChanged-------', event, name);
    caches = {};
  });

  if (caches[currPath]) {
    return res.json({
      ok: 1,
      file: caches[currPath]
    });
  }

  try {
    console.log('gettingFile', currPath);
    const file = await describeFile(currPath);
    caches[currPath] = file;
    res.json({
      ok: 1,
      file
    });
  } catch (error) {
    console.error('Error when browse:', currPath, error);
    res.json({
      ok: 0,
      message: 'Folder not found',
      file: null
    });
  }
};
