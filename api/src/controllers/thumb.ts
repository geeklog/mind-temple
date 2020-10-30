import os from 'os';
import sharp from 'sharp';

export default async (req, res) => {
  try {
    const w = Number(req.query.w) || 100;
    let filePath = req.path.replace(/\/thumb\/?/, '');
    filePath = filePath.replace('~', os.homedir());
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
      ok: 0,
      message: 'File not exist',
      files: []
    });
  }
};
