// Web-optimizes the hero pair from assets-src/ (high-quality JPEG masters, in git) into
// public/images/. Re-run after replacing the sources (same filenames = zero code change).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/images', { recursive: true });
const jobs = [];
for (const name of ['griddle-raw', 'griddle-cooked']) {
  for (const [suffix, width] of [['', 1920], ['-1280', 1280]]) {
    jobs.push(
      sharp(`assets-src/${name}.jpg`)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(`public/images/${name}${suffix}.webp`)
        .then((i) => console.log(`${name}${suffix}.webp ${i.width}x${i.height} ${(i.size / 1024).toFixed(0)} KB`))
    );
  }
}
// Icons from the logo.
for (const [file, size] of [['icon.png', 192], ['apple-icon.png', 180], ['icon-512.png', 512]]) {
  jobs.push(sharp('public/photos/logo.png').resize(size, size).png().toFile(`public/${file}`));
}
await Promise.all(jobs);
