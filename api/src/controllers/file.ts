import send from 'send';
import { resolvePath } from '../util/fileUtil';

export default async (req, res) => {
  try {
    const filePath = resolvePath(req.url.replace(/\/file\/?/, ''));
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
