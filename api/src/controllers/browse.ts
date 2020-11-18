import { describeFile, resolvePath } from '../util/fileUtil';
import cache from '../services/cache';

let watcher;

export default async (req, res) => {
  let resourcePath: string = req.path.replace('\/browse\/', '');
  resourcePath = decodeURIComponent(resourcePath);
  const currPath = resolvePath(resourcePath);

  const cahcedBrowse = cache.browse(currPath);
  if (cahcedBrowse) {
    return res.json({
      ok: 1,
      file: cahcedBrowse
    });
  }

  try {
    const file = await describeFile(currPath);
    cache.add(currPath, file);
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
