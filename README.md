# Vyomini's Magical Dream World 🎁✨

A cinematic, fully interactive 3D birthday wishing experience created for **Vyomini**.

Built with **React**, **Three.js**, **React Three Fiber**, **GSAP**, **Framer Motion**, **Tailwind CSS**, and **Howler.js / Web Audio API**.

---

## 🌟 Features & Journey

1. **Scene 1: The Invitation**
   - Deep starry night sky with a floating, glowing 3D envelope.
   - Elegant text reveals and interactive "Enter Your Dream ✨" trigger.
   - Flap unfolds, magical butterfly burst, and camera zooms through the portal.

2. **Scene 2: The Dream World**
   - Panoramic fantasy environment featuring floating islands, glowing fairytale castle, moon, fireflies, and orbiting butterflies.
   - Smooth cinematic camera motion.

3. **Scene 3: The Birthday Celebration Island**
   - Detailed 3-tier 3D birthday cake with flickering candles.
   - "Make a Wish" interaction and "Blow Out Candles" (supports button click and optional microphone blowing detection).
   - Candle flames extinguish with realistic smoke puff and stardust explosion.

4. **Scene 4: The Gifts of Memories**
   - Floating 3D presents with customizable ribbon colors and hover glowing effects.
   - Clicking a gift unties the ribbon, lifts the lid, and **physically elevates a 3D photo frame** out of the gift box into the camera view.
   - Displays memory title and personal caption.
   - Sending memory to sky adds it to a floating celestial constellation.

5. **Scene 5: The Final Mysterious Gift**
   - Giant glowing present at center stage.
   - 3..2..1.. countdown with tension and a massive magical reveal with confetti storm.

6. **Scene 6: Constellation Morph & Grand Finale**
   - Discovered memories and stardust arrange into a **glowing 3D Heart**, then morph into **"VYOMINI"** typography.
   - Festive celebratory fireworks erupt across the sky with sound effects.
   - Beautiful emotional birthday letter and replay option.

---

## 🎨 How to Personalize

All text, photos, captions, and colors are configured in a single file:

📁 **[`src/config/birthdayConfig.js`](src/config/birthdayConfig.js)**

### 1. Replacing Photographs:
Put Vyomini's photos in `public/images/vyomini/`:
- `public/images/vyomini/photo01.jpg`
- `public/images/vyomini/photo02.jpg`
- `public/images/vyomini/photo03.jpg`
- `...`

### 2. Updating Memories & Messages:
Open [`src/config/birthdayConfig.js`](src/config/birthdayConfig.js) and customize:
- `name`: Recipient's name
- `memories`: Array of photo objects with custom `title`, `caption`, `date`, `color`
- `senderName`: Your name / sign-off
- `narrative`: Any custom messages for each scene

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📦 Building for Production & GitHub Pages

```bash
# Build the project
npm run build
```

The output in `dist/` is completely static and ready to be hosted on **GitHub Pages**, **Vercel**, **Netlify**, or any static hosting service.

A GitHub Actions workflow is also included in `.github/workflows/deploy.yml` for automated GitHub Pages deployment on push to `main`.
