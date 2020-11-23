import { resolvePath } from '../util/fileUtil';
import cache from '../services/cache';
import { executeCommand } from '../services/process';

export default async (req, res) => {
  const filePaths = req.body.files;
  const executes = await Promise.all(filePaths.map(async (filePath: string) => {
    try {
      filePath = resolvePath(filePath);
      await executeCommand(`trash '${filePath}'`);
      cache.purge(filePath);
      return {ok: 1, path: filePath};
    } catch (err) {
      return {ok: 0, path: filePath, error: err.message};
    }
  }));
  console.log('trash', executes);
  res.json({
    ok: 1,
    executes
  });
};
