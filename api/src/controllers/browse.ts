import fs from 'fs';
import { describeFile, resolvePath } from '../util/fileUtil';
import { addBrowseCache, getBrowseCache, purgeBrowseCache } from '../services/cache';

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
    purgeBrowseCache();
  });

  const cahcedBrowse = getBrowseCache(currPath);
  if (cahcedBrowse) {
    return res.json({
      ok: 1,
      file: cahcedBrowse
    });
  }

  try {
    console.log('gettingFile', currPath);
    const file = await describeFile(currPath);
    addBrowseCache(currPath, file);
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
