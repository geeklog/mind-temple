import fs from 'fs';
import path from 'path';
import cachez from 'cachez';
import { describeFile, resolvePath } from '../util/fileUtil';
import fswatch from 'node-watch';

let caches = {};

fswatch('/', { recursive: true}, (event, name) => {
  if (name.startsWith('/Users/livestar/Library/Application Support')) {
    return;
  }
  if (name.startsWith('/Users/livestar/Library/')) {
    return;
  }
  console.log('fileChanged-------', event, name);
  caches = {};
});

export default async (req, res) => {
  let resourcePath: string = req.path.replace('\/browse\/', '');
  resourcePath = decodeURIComponent(resourcePath);
  const currPath = resolvePath(resourcePath);

  if (caches[currPath]) {
    return res.json({
      ok: 1,
      files: caches[currPath]
    });
  }

  try {
    console.log('gettingFolder', currPath);
    const files = await Promise.all(
      fs.readdirSync(currPath)
        .map(fileName => describeFile(path.join(currPath, fileName)))
    );
    caches[currPath] = files;
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
