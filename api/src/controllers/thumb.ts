import sharp from 'sharp';
import { resolvePath } from '../util/fileUtil';

export default async (req, res) => {
  try {
    const w = Number(req.query.w) || 100;
    let resourcePath = req.path.replace('\/thumb\/', '');
    resourcePath = decodeURIComponent(resourcePath);
    const filePath = resolvePath(resourcePath);
    const image = sharp(filePath, { failOnError: false });
    const { width, height } = await image.metadata();
    const thumbWidth = Math.round(w * width / height);
    image
      .jpeg({ quality: 100, progressive: true })
      .resize(thumbWidth)
      .pipe(res);
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
