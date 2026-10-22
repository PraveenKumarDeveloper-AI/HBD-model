/**
 * BIRTHDAY CAKE & WISH CONTROLLER
 * 
 * Interactive tiered birthday cake with flickering candle flames.
 * Allows blowing out candles, triggers celebratory confetti and a
 * heart-shaped firework burst in the sky.
 */

export class CakeController {
  constructor(config, onCandlesBlown) {
    this.config = config;
    this.onCandlesBlown = onCandlesBlown;
    this.areCandlesBlown = false;

    this.cakeContainer = document.getElementById('cake-interactive-box');
    this.blowBtn = document.getElementById('blow-candles-btn');
    this.flames = document.querySelectorAll('.candle-flame');
    this.cakeMessage = document.getElementById('cake-wish-message');
    this.cakeSubtitle = document.getElementById('cake-wish-subtitle');
    this.nextToLetterBtn = document.getElementById('cake-to-letter-btn');

    this.init();
  }

  init() {
    if (this.blowBtn) {
      this.blowBtn.addEventListener('click', () => this.blowCandles());
    }

    if (this.cakeContainer) {
      this.cakeContainer.addEventListener('click', (e) => {
        if (!this.areCandlesBlown) {
          this.blowCandles();
        }
      });
    }

    // Set initial text from config
    if (this.cakeMessage && this.config.cake) {
      this.cakeMessage.textContent = this.config.cake.title || "Make a Birthday Wish 🎂";
    }
    if (this.cakeSubtitle && this.config.cake) {
      this.cakeSubtitle.textContent = this.config.cake.subtitle || "Close your eyes, make a wish, and blow out the candles!";
    }
  }

  blowCandles() {
    if (this.areCandlesBlown) return;
    this.areCandlesBlown = true;

    // Extinguish each flame with a puff of smoke
    this.flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add('extinguished');
        this.createSmokePuff(flame);
      }, index * 80);
    });

    // Update text with romantic wish message
    if (this.cakeMessage) {
      this.cakeMessage.textContent = this.config.cake?.wishGrantedTitle || "Make a wish, my love! ✨";
      this.cakeMessage.classList.add('wish-revealed');
    }

    if (this.cakeSubtitle) {
      this.cakeSubtitle.textContent = this.config.cake?.wishGrantedSubtitle || "May all your sweetest dreams and deepest prayers come true today and always! 💖";
    }

    if (this.blowBtn) {
      this.blowBtn.style.display = 'none';
    }

    if (this.nextToLetterBtn) {
      this.nextToLetterBtn.classList.remove('hidden');
      this.nextToLetterBtn.classList.add('fade-in-bounce');
    }

    // Emit celebration confetti
    this.launchConfetti();

    // Trigger fireworks callback
    if (typeof this.onCandlesBlown === 'function') {
      this.onCandlesBlown();
    }
  }

  createSmokePuff(flameElement) {
    const rect = flameElement.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-particle';
      smoke.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 10}px`;
      smoke.style.top = `${rect.top}px`;
      document.body.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1200);
    }
  }

  launchConfetti() {
    const container = document.getElementById('confetti-container') || document.body;
    const colors = ['#ff2a6d', '#ffd166', '#ff70a6', '#05d9e8', '#ffd700', '#ffffff'];
    const count = 60;

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 8 + 6}px`;
      confetti.style.height = `${Math.random() * 12 + 8}px`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      // Some are heart-shaped confetti
      if (Math.random() > 0.6) {
        confetti.textContent = '❤️';
        confetti.style.backgroundColor = 'transparent';
        confetti.style.fontSize = `${Math.random() * 12 + 12}px`;
      }

      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4500);
    }
  }

  relightCandles() {
    this.areCandlesBlown = false;
    this.flames.forEach(flame => {
      flame.classList.remove('extinguished');
    });
    if (this.blowBtn) this.blowBtn.style.display = 'inline-block';
    if (this.nextToLetterBtn) this.nextToLetterBtn.classList.add('hidden');
    if (this.cakeMessage) {
      this.cakeMessage.textContent = this.config.cake?.title || "Make a Birthday Wish 🎂";
      this.cakeMessage.classList.remove('wish-revealed');
    }
    if (this.cakeSubtitle) {
      this.cakeSubtitle.textContent = this.config.cake?.subtitle || "Close your eyes, make a wish, and blow out the candles!";
    }
  }
}
