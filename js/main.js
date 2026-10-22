/**
 * MAIN ORCHESTRATION & SCENE CONTROLLER
 * 
 * Bridges all modular components:
 * - Countdown -> Celebration Transition
 * - Fireworks Engine
 * - Birthday Reveal & Confetti
 * - Birthday Cake & Candle Extinguishing
 * - Romantic 3D Love Letter
 * - Photo Gallery & Lightbox
 * - Music Controller
 * - Test Mode Toolbar
 */

import { config } from './config.js';
import { FireworksEngine } from './fireworks.js';
import { CountdownController } from './countdown.js';
import { CakeController } from './cake.js';
import { LetterController } from './letter.js';
import { GalleryController } from './gallery.js';
import { MusicController } from './music.js';

class AppController {
  constructor() {
    this.config = config;
    this.currentScene = 'countdown'; // 'countdown' | 'celebration'
    this.activeChapter = 'reveal'; // 'reveal' | 'cake' | 'letter' | 'gallery'

    // Engine instances
    this.fireworks = null;
    this.countdown = null;
    this.cake = null;
    this.letter = null;
    this.gallery = null;
    this.music = null;

    this.init();
  }

  init() {
    this.applyPersonalization();
    this.initFireworks();
    this.initMusic();
    this.initGallery();
    this.initCake();
    this.initLetter();
    this.initCountdown();
    this.bindNavigation();
    this.initTestModeToolbar();
  }

  applyPersonalization() {
    // Fill in recipient and sender names across the page
    document.querySelectorAll('.recipient-name').forEach(el => {
      el.textContent = this.config.recipientName;
    });

    document.querySelectorAll('.sender-name').forEach(el => {
      el.textContent = this.config.senderName;
    });

    const revealHeading = document.getElementById('reveal-main-heading');
    if (revealHeading && this.config.reveal?.heading) {
      revealHeading.textContent = this.config.reveal.heading;
    }

    const revealSub = document.getElementById('reveal-sub-heading');
    if (revealSub && this.config.reveal?.subheading) {
      revealSub.textContent = this.config.reveal.subheading;
    }
  }

  initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (canvas) {
      this.fireworks = new FireworksEngine(canvas, this.config.fireworks);
      this.fireworks.start();
    }
  }

  initMusic() {
    this.music = new MusicController(this.config);
  }

  initGallery() {
    this.gallery = new GalleryController(this.config);
  }

  initCake() {
    this.cake = new CakeController(this.config, () => {
      // Callback when candles are blown: trigger heart firework
      if (this.fireworks) {
        const x = window.innerWidth * 0.5;
        const y = window.innerHeight * 0.28;
        this.fireworks.triggerHeartBurst(x, y, '#ff2a6d');
        setTimeout(() => {
          this.fireworks.triggerGrandFinale();
        }, 1200);
      }
    });
  }

  initLetter() {
    this.letter = new LetterController(this.config, () => {
      // Callback when letter is opened
      if (this.fireworks) {
        this.fireworks.launchRocketTo(window.innerWidth * 0.25, window.innerHeight * 0.2);
        this.fireworks.launchRocketTo(window.innerWidth * 0.75, window.innerHeight * 0.2);
      }
    });
  }

  initCountdown() {
    this.countdown = new CountdownController(this.config, () => {
      this.triggerCelebration();
    });
  }

  triggerCelebration() {
    this.currentScene = 'celebration';

    // Transition DOM scenes smoothly
    const countdownSec = document.getElementById('countdown-section');
    const celebrationSec = document.getElementById('celebration-section');

    if (countdownSec) {
      countdownSec.classList.add('fade-out');
      setTimeout(() => {
        countdownSec.classList.add('hidden');
        countdownSec.classList.remove('fade-out');
      }, 700);
    }

    if (celebrationSec) {
      celebrationSec.classList.remove('hidden');
      celebrationSec.classList.add('fade-in');
    }

    // Launch celebratory grand finale
    if (this.fireworks) {
      this.fireworks.triggerGrandFinale();
    }

    // Try starting romantic music if user already interacted
    if (this.music && !this.music.isPlaying) {
      this.music.play();
    }
  }

  bindNavigation() {
    // Reveal CTA: "Open Your Surprise" -> Switch to Cake
    const openSurpriseBtn = document.getElementById('reveal-open-surprise-btn');
    if (openSurpriseBtn) {
      openSurpriseBtn.addEventListener('click', () => {
        this.switchChapter('cake');
      });
    }

    // Cake next button -> Switch to Letter
    const cakeToLetterBtn = document.getElementById('cake-to-letter-btn');
    if (cakeToLetterBtn) {
      cakeToLetterBtn.addEventListener('click', () => {
        this.switchChapter('letter');
      });
    }

    // Letter next button -> Switch to Gallery
    const letterToGalleryBtn = document.getElementById('letter-to-gallery-btn');
    if (letterToGalleryBtn) {
      letterToGalleryBtn.addEventListener('click', () => {
        this.switchChapter('gallery');
      });
    }

    // Navigation pills in celebration header
    document.querySelectorAll('[data-nav-chapter]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const targetChapter = e.currentTarget.getAttribute('data-nav-chapter');
        this.switchChapter(targetChapter);
      });
    });

    // Replay fireworks button in final card
    const replayFireworksBtn = document.getElementById('replay-fireworks-btn');
    if (replayFireworksBtn) {
      replayFireworksBtn.addEventListener('click', () => {
        if (this.fireworks) {
          this.fireworks.triggerGrandFinale();
        }
      });
    }

    // Central pulsing heart on countdown: click to launch heart firework & start music
    const centralHeart = document.querySelector('.central-heart-pulsar');
    if (centralHeart) {
      centralHeart.addEventListener('click', () => {
        if (this.music && !this.music.isPlaying) {
          this.music.play();
        }
        if (this.fireworks) {
          this.fireworks.triggerHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.35, '#ff2a6d');
        }
      });
    }

    // Welcome Gate: Guaranteed Autoplay on entrance
    const welcomeGate = document.getElementById('welcome-gate');
    const gateEnterBtn = document.getElementById('gate-enter-btn');

    const openGateAndPlay = () => {
      if (this.music) {
        this.music.play();
      }
      if (welcomeGate) {
        welcomeGate.classList.add('gate-closed');
      }
      if (this.fireworks) {
        this.fireworks.triggerHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.35, '#ff2a6d');
      }
    };

    if (gateEnterBtn) {
      gateEnterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openGateAndPlay();
      });
    }

    if (welcomeGate) {
      welcomeGate.addEventListener('click', openGateAndPlay);
    }

    if (this.music?.audioEl) {
      this.music.audioEl.addEventListener('play', () => {
        if (welcomeGate && !welcomeGate.classList.contains('gate-closed')) {
          welcomeGate.classList.add('gate-closed');
        }
      });
    }
  }

  switchChapter(chapterName) {
    this.activeChapter = chapterName;

    // Update nav pill states
    document.querySelectorAll('[data-nav-chapter]').forEach(pill => {
      if (pill.getAttribute('data-nav-chapter') === chapterName) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Show target section, hide other chapters
    const chapters = ['reveal', 'cake', 'letter', 'gallery'];
    chapters.forEach(ch => {
      const el = document.getElementById(`chapter-${ch}`);
      if (el) {
        if (ch === chapterName) {
          el.classList.remove('hidden');
          el.classList.add('fade-in');
          // Smooth scroll to top of chapter
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          el.classList.add('hidden');
          el.classList.remove('fade-in');
        }
      }
    });
  }

  initTestModeToolbar() {
    const toolbar = document.getElementById('test-mode-bar');
    if (!toolbar) return;

    // Show toolbar if testMode is enabled or for developer preview
    toolbar.classList.remove('hidden');

    const toggleSceneBtn = document.getElementById('test-toggle-scene');
    if (toggleSceneBtn) {
      toggleSceneBtn.addEventListener('click', () => {
        if (this.currentScene === 'countdown') {
          this.triggerCelebration();
          toggleSceneBtn.textContent = '⏱️ Back to Countdown';
        } else {
          // Switch back to countdown
          this.currentScene = 'countdown';
          const countdownSec = document.getElementById('countdown-section');
          const celebrationSec = document.getElementById('celebration-section');
          celebrationSec?.classList.add('hidden');
          countdownSec?.classList.remove('hidden');
          this.countdown?.resetCountdown();
          toggleSceneBtn.textContent = '🎉 Instant Midnight Reveal';
        }
      });
    }

    const testHeartFwBtn = document.getElementById('test-heart-fw');
    if (testHeartFwBtn) {
      testHeartFwBtn.addEventListener('click', () => {
        if (this.fireworks) {
          this.fireworks.triggerHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.35, '#ff2a6d');
        }
      });
    }

    const testBlowCakeBtn = document.getElementById('test-blow-cake');
    if (testBlowCakeBtn) {
      testBlowCakeBtn.addEventListener('click', () => {
        this.switchChapter('cake');
        this.cake?.blowCandles();
      });
    }
  }
}

// Bootstrap when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.birthdayApp = new AppController();
});
