import childProcess from 'child_process';
import { dirname } from 'path';
import cache from '../services/cache';
import { resolvePath } from '../util/fileUtil';

function exec(cmd: string) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (error, stdout, stderr) => {
      error ? reject(error) : resolve();
    });
  });
}

export default async (req, res) => {
  try {
    let resourcePath: string = req.path.replace('\/cmd\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const filePath = resolvePath(resourcePath);
    const command = req.query.cmd;

    if (!command) {
      return res.json({ ok: 0, message: 'No command' });
    }

    if (command === 'open') {
      await exec(`open '${filePath}'`);
      return res.json({ ok: 1 });
    }

    if (command === 'open-folder') {
      await exec(`open '${dirname(filePath)}'`);
      return res.json({ ok: 1 });
    }

    if (command === 'open-console') {
      await exec(`open -a "iTerm.app" '${dirname(filePath)}'`);
      return res.json({ ok: 1 });
    }

    if (command === 'trash') {
      await exec(`trash '${filePath}'`);
      cache.purge(filePath);
      return res.json({ ok: 1 });
    }

    return res.json({
      ok: 0,
      message: `Unknown command: ${command}`
    });

  } catch (error) {

    console.error(error);
    res.json({
      ok: 0,
      message: 'Folder not found',
      files: []
    });
  }
};
