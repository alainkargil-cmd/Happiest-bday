import fs from 'fs';
import path from 'path';

const dir = path.resolve('public', 'images', 'vyomini');

const mapping = [
  { src: 'WhatsApp Image 2026-09-20 at 09.15.58.jpeg', dest: 'photo01.jpg' },
  { src: 'WhatsApp Image 2026-09-20 at 09.15.58 (1).jpeg', dest: 'photo02.jpg' },
  { src: 'WhatsApp Image 2026-09-20 at 09.15.59.jpeg', dest: 'photo03.jpg' },
  { src: 'WhatsApp Image 2026-09-20 at 09.15.59 (1).jpeg', dest: 'photo04.jpg' },
  { src: 'WhatsApp Image 2026-09-20 at 09.15.59 (2).jpeg', dest: 'photo05.jpg' }
];

mapping.forEach(({ src, dest }) => {
  const srcPath = path.join(dir, src);
  const destPath = path.join(dir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.error(`Source file missing: ${srcPath}`);
  }
});

console.log('All real photos replaced successfully!');
