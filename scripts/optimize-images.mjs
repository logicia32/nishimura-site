// Image optimization: resize + WebP conversion using sharp
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const SRC = 'public/img';
const OUT = 'public/img';

async function run() {
  await mkdir(OUT, { recursive: true });

  // Lab hero variants
  for (const [name, w] of [['lab', 1600], ['lab2', 1600]]) {
    const inPath = `${SRC}/${name}.png`;
    await sharp(inPath).resize({ width: w }).webp({ quality: 82 }).toFile(`${OUT}/${name}-1600.webp`);
    await sharp(inPath).resize({ width: w }).jpeg({ quality: 86, mozjpeg: true }).toFile(`${OUT}/${name}-1600.jpg`);
    // mobile size
    await sharp(inPath).resize({ width: 800 }).webp({ quality: 80 }).toFile(`${OUT}/${name}-800.webp`);
  }

  // OG image: 1200x630 crop from lab2 (best engineering desk shot)
  await sharp(`${SRC}/lab2.png`)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/og.jpg');
  // Keep PNG too for legacy
  await sharp(`${SRC}/lab2.png`)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9 })
    .toFile('public/og.png');

  console.log('done.');
}

run().catch(e => { console.error(e); process.exit(1); });
