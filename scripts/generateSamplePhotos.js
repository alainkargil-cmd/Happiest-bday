import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public', 'images', 'vyomini');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate SVG images with dreamy artistic illustrations & gradients, then write as photo files
const photoStyles = [
  {
    name: 'photo01.jpg',
    title: 'Vyomini ✨',
    subtitle: 'A Radiant Smile',
    colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
    icon: '✨'
  },
  {
    name: 'photo02.jpg',
    title: 'Dreaming Among Stars',
    subtitle: 'Pure Grace & Wonder',
    colors: ['#a855f7', '#6366f1', '#ec4899'],
    icon: '🌸'
  },
  {
    name: 'photo03.jpg',
    title: 'Joy & Magic',
    subtitle: 'Starry Laughter',
    colors: ['#06b6d4', '#3b82f6', '#8b5cf6'],
    icon: '💫'
  },
  {
    name: 'photo04.jpg',
    title: 'Sunlight & Joy',
    subtitle: 'Golden Hour Glow',
    colors: ['#f59e0b', '#ec4899', '#8b5cf6'],
    icon: '☀️'
  },
  {
    name: 'photo05.jpg',
    title: 'A Beautiful Soul',
    subtitle: 'Magical Adventures',
    colors: ['#ec4899', '#f43f5e', '#a855f7'],
    icon: '💖'
  }
];

photoStyles.forEach((p, idx) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs>
      <linearGradient id="bg${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.colors[0]}" />
        <stop offset="50%" stop-color="${p.colors[1]}" />
        <stop offset="100%" stop-color="${p.colors[2]}" />
      </linearGradient>
      <radialGradient id="glow${idx}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.2" />
      </radialGradient>
      <filter id="blurFilter">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>
    
    <!-- Background Gradient -->
    <rect width="600" height="800" fill="url(#bg${idx})" />
    <rect width="600" height="800" fill="url(#glow${idx})" />
    
    <!-- Decorative magical rings -->
    <circle cx="300" cy="380" r="180" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="8,6" />
    <circle cx="300" cy="380" r="140" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" stroke-width="3" />
    <circle cx="300" cy="380" r="110" fill="rgba(255,255,255,0.2)" filter="url(#blurFilter)" />
    
    <!-- Magical Stardust Stars -->
    <circle cx="120" cy="180" r="4" fill="#ffffff" opacity="0.8" />
    <circle cx="480" cy="220" r="3" fill="#fef08a" opacity="0.9" />
    <circle cx="150" cy="620" r="5" fill="#fbcfe8" opacity="0.7" />
    <circle cx="460" cy="580" r="4" fill="#ffffff" opacity="0.8" />
    <circle cx="280" cy="120" r="3" fill="#ffffff" opacity="0.9" />
    
    <!-- Center Icon Avatar -->
    <text x="300" y="420" font-size="90" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', sans-serif">${p.icon}</text>
    
    <!-- Elegant Card Border -->
    <rect x="25" y="25" width="550" height="750" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    <rect x="35" y="35" width="530" height="730" rx="16" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
    
    <!-- Text -->
    <text x="300" y="600" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ${p.title}
    </text>
    <text x="300" y="650" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.85)" text-anchor="middle" letter-spacing="2">
      ${p.subtitle.toUpperCase()}
    </text>
    <text x="300" y="700" font-family="Georgia, serif" font-size="16" font-style="italic" fill="rgba(254, 240, 138, 0.9)" text-anchor="middle">
      ✨ Memory #${idx + 1} ✨
    </text>
  </svg>`;

  fs.writeFileSync(path.join(outDir, p.name), svg);
});

console.log('Sample memory photos generated successfully in public/images/vyomini/');
