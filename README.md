# ✨ Happy Birthday, My Love — Midnight Celebration Website

A romantic, cinematic, and interactive midnight birthday surprise website built with pure **HTML5, CSS3, and Vanilla JavaScript (ES Modules)** with an HTML Canvas 2D sky-shot fireworks engine.

---

## 🌟 Features

- **⏱️ Live Midnight Countdown:**
  - Timezone-aware countdown (default: `Asia/Kolkata`).
  - Seamless zero-refresh unlock at exactly 12:00 AM on the birthday date.
  - Automatically displays the celebration if opened after midnight.
  - Resilient against clock drift and browser tab sleep.

- **🎆 Realistic Sky-Shot Fireworks & Sky Simulation:**
  - Fullscreen Canvas 2D engine.
  - Accelerating rockets with glowing smoke/spark trails.
  - Multi-style bursts: Chrysanthemum, Willow golden brocade, Ring fireworks, and special **Heart-shaped fireworks**.
  - Dynamic night sky with shimmering stars, occasional shooting stars, and floating hearts.
  - Interactive: click or tap anywhere on the sky to launch fireworks!

- **🎂 Interactive Birthday Cake Surprise:**
  - Tiered birthday cake with glowing, flickering candle flames.
  - Interactive candle blowing action (button or tap on cake).
  - Smoke puff particle simulation when blown out.
  - Celebratory confetti shower and heartfelt wish message.
  - Triggers a heart-shaped firework burst in the sky.

- **💌 Romantic 3D Love Letter:**
  - 3D interactive envelope with heart wax seal.
  - Clicking seal opens envelope flap in 3D and glides out the parchment letter.
  - Staggered romantic paragraph reveal and floating love particles.
  - Fully customizable text in `js/config.js`.

- **📸 Our Memories Polaroid Gallery:**
  - Polaroid-style photo cards with pins, authentic angles, and hover zoom effects.
  - Fullscreen Lightbox viewer with Next, Previous, and keyboard navigation (Left/Right/Esc).
  - Includes 6 custom romantic vector memory illustrations out-of-the-box.
  - Seamless fallback if images are missing.

- **🎵 Ambient Background Music & Synthesizer Fallback:**
  - Autoplay-compliant floating music player with volume control and live visualizer bars.
  - Supports custom MP3 files (`assets/music/song.mp3`).
  - **Built-in Web Audio API synthesizer**: If no MP3 is found or offline, automatically plays a gentle, romantic arpeggiated ambient chime chord progression so music always works!

- **🛠️ Built-in Test Toolbar:**
  - Floating test bar at bottom-left to instantly preview midnight reveal, test heart fireworks, and test candle blowing without waiting for midnight.

---

## 📁 Project Structure

```text
hbd/
├── index.html                  # Main entry point
├── README.md                   # Setup and personalization documentation
├── css/
│   └── style.css               # Romantic design system & responsive styling
├── js/
│   ├── config.js               # Centralized personalization settings
│   ├── main.js                 # Scene orchestration & navigation
│   ├── countdown.js            # Timezone-aware midnight countdown
│   ├── fireworks.js            # Canvas 2D fireworks particle engine
│   ├── cake.js                 # Interactive cake & candle extinguishing
│   ├── letter.js               # 3D envelope & romantic letter reveal
│   ├── gallery.js              # Polaroid gallery & lightbox viewer
│   └── music.js                # Music player & Web Audio synthesizer
└── assets/
    ├── images/
    │   └── gallery/            # Polaroid photos & SVG illustrations
    │       ├── memory1.svg
    │       ├── memory2.svg
    │       ├── memory3.svg
    │       ├── memory4.svg
    │       ├── memory5.svg
    │       ├── memory6.svg
    │       └── placeholder.svg
    ├── music/                  # Place your background song.mp3 here
    └── fonts/                  # (Uses Google Fonts via CSS)
```

---

## 🎨 How to Personalize for Your Partner

All settings are centralized in [`js/config.js`](file:///c:/Users/HP/OneDrive/Desktop/hbd/js/config.js):

### 1. Names & Dates
Open [`js/config.js`](file:///c:/Users/HP/OneDrive/Desktop/hbd/js/config.js) and update:
```javascript
recipientName: "Sophia",        // Your partner's name
senderName: "Yours Forever",     // Your name or signature
birthdayDate: "2026-10-23",     // Target birthday (YYYY-MM-DD)
targetHour: 0,                  // 0 = 12:00 AM Midnight
targetMinute: 0,
timezone: "Asia/Kolkata",       // Your timezone (e.g. 'America/New_York', 'Asia/Kolkata', 'Europe/London')
```

### 2. Love Letter
In `config.letter`, customize the salutation, paragraphs, and sign-off:
```javascript
letter: {
  salutation: "My Dearest Sophia,",
  paragraphs: [
    "Your custom romantic paragraph 1...",
    "Your custom romantic paragraph 2...",
  ],
  closing: "Forever & Always With Love,",
  signature: "Your Name ❤️"
}
```

### 3. Personal Photos
1. Copy your photos into `assets/images/gallery/` (e.g. `pic1.jpg`, `pic2.jpg`).
2. In `js/config.js`, update `config.gallery`:
```javascript
gallery: [
  {
    src: "assets/images/gallery/pic1.jpg",
    caption: "Our First Trip Together 🌊",
    date: "July 2025",
    description: "Watching the waves crash while holding your hand."
  },
  // Add more memories...
]
```

### 4. Background Song
Place an MP3 file into `assets/music/song.mp3`.
*(Note: If no audio file is provided, the website automatically plays a soothing built-in romantic ambient chime synthesizer).*

---

## 🚀 How to Run Locally

Because the project uses ES Modules (`import`/`export`), open the project with a local HTTP server:

### Option A: VS Code Live Server
- Open this folder in VS Code or Antigravity IDE.
- Right click `index.html` and click **"Open with Live Server"**.

### Option B: Node.js (npx serve)
```bash
npx serve .
```
Then visit `http://localhost:3000`.

### Option C: Python
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🌐 Free Static Deployment

### 1. GitHub Pages
1. Push this folder to a GitHub repository.
2. In GitHub, go to **Settings > Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### 2. Netlify
1. Go to [netlify.com](https://www.netlify.com/) and drag-and-drop this project folder into the Netlify dashboard.
2. It will deploy instantly with a live URL.

### 3. Vercel
1. Install Vercel CLI: `npm i -g vercel` or link your GitHub repo in [vercel.com](https://vercel.com).
2. Run `vercel` in this directory to deploy in seconds.

---

## 🧪 Testing

Use the floating **TEST TOOLS** bar in the bottom-left corner:
- **Instant Midnight Reveal:** Toggles between the live countdown and the full birthday celebration.
- **Heart Firework:** Triggers the parametric heart-shaped sky burst.
- **Blow Candles:** Extinguishes the cake candles and fires confetti.
