// One-time + repeatable image optimization for public/images.
// - Caps width at 1600px (plenty: next/image resizes further per device at runtime)
// - Recompresses with mozjpeg (quality 80, progressive)
// - Strips EXIF metadata (some source photos are geotagged)
//
// Usage: npm run images:optimize

import { readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const QUALITY = 80;

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function optimizeFile(filePath) {
  const before = (await stat(filePath)).size;
  const tempPath = `${filePath}.tmp`;

  await sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tempPath);

  await rename(tempPath, filePath);
  const after = (await stat(filePath)).size;
  const saved = Math.round((1 - after / before) * 100);
  console.log(`${path.basename(filePath)}: ${kb(before)} -> ${kb(after)} (-${saved}%)`);
}

const files = (await readdir(IMAGES_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

if (files.length === 0) {
  console.log("No images found.");
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;
for (const file of files) {
  const filePath = path.join(IMAGES_DIR, file);
  totalBefore += (await stat(filePath)).size;
  await optimizeFile(filePath);
  totalAfter += (await stat(filePath)).size;
}

console.log(`\nTotal: ${kb(totalBefore)} -> ${kb(totalAfter)} (saved ${kb(totalBefore - totalAfter)})`);
