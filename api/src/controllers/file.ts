import fs from 'fs';
import os from 'os';
import path from 'path';
import send from 'send';

export default (req, res) => {
  try {
    let filePath = req.url.replace(/\/file\/?/, '');
    filePath = filePath.replace('~', os.homedir());
    send(req, filePath).pipe(res);
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
