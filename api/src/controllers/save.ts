import { resolvePath } from '../util/fileUtil';
import fs from 'fs';

export default async (req, res) => {
  try {
    let resourcePath = req.path.replace('\/save\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const filePath = resolvePath(resourcePath);
    console.log('save', filePath);
    fs.writeFileSync(filePath, req.body.file);
    res.json({
      ok: 1
    });

  } catch (error) {
    console.log(error);
    res.status(404);
    res.json({
      ok: 1,
      message: 'File not exist',
      files: []
    });
  }
};
