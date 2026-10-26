// Web-optimizes the hero griddle pairs from assets-src/ (high-quality JPEG masters, in git)
// into public/images/. One pair per dish in GRIDDLE (src/lib/site.ts):
//   assets-src/griddle-<slug>-{raw,cooked}.jpg → public/images/griddle-<slug>-{raw,cooked}[-1280].webp
// Re-run after replacing a master (same filenames = zero code change).
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';

const SLUGS = ['hash', 'potato', 'sweet', 'gyro', 'chorizo'];

mkdirSync('public/images', { recursive: true });
const jobs = [];
for (const slug of SLUGS) {
  for (const state of ['raw', 'cooked']) {
    const src = `assets-src/griddle-${slug}-${state}.jpg`;
    if (!existsSync(src)) { console.warn('missing', src); continue; }
    for (const [suffix, width] of [['', 1920], ['-1280', 1280]]) {
      const out = `public/images/griddle-${slug}-${state}${suffix}.webp`;
      jobs.push(
        sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(out)
          .then((i) => console.log(`${out} ${i.width}x${i.height} ${(i.size / 1024).toFixed(0)} KB`))
      );
    }
  }
}
// Icons from the logo.
for (const [file, size] of [['icon.png', 192], ['apple-icon.png', 180], ['icon-512.png', 512]]) {
  jobs.push(sharp('public/photos/logo.png').resize(size, size).png().toFile(`public/${file}`));
}
await Promise.all(jobs);
