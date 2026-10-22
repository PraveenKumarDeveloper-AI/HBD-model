/**
 * ROMANTIC LOVE LETTER CONTROLLER
 * 
 * Interactive 3D envelope with custom wax seal, smooth unfolding animation,
 * typewriter text reveal, and floating emotional heart particles.
 */

export class LetterController {
  constructor(config, onLetterOpened) {
    this.config = config;
    this.onLetterOpened = onLetterOpened;
    this.isOpen = false;
    this.isTyping = false;

    this.envelopeWrapper = document.getElementById('envelope-wrapper');
    this.waxSeal = document.getElementById('wax-seal');
    this.openLetterBtn = document.getElementById('open-letter-btn');
    this.letterPaper = document.getElementById('letter-paper');
    this.letterBody = document.getElementById('letter-text-content');
    this.letterSalutation = document.getElementById('letter-salutation');
    this.letterClosing = document.getElementById('letter-closing');
    this.letterSignature = document.getElementById('letter-signature');
    this.nextToGalleryBtn = document.getElementById('letter-to-gallery-btn');

    this.init();
  }

  init() {
    if (this.waxSeal) {
      this.waxSeal.addEventListener('click', () => this.toggleLetter());
    }

    if (this.openLetterBtn) {
      this.openLetterBtn.addEventListener('click', () => this.toggleLetter());
    }

    // Populate static text from config
    const letterData = this.config.letter || {};
    if (this.letterSalutation) {
      this.letterSalutation.textContent = letterData.salutation || `My Dearest ${this.config.recipientName},`;
    }
    if (this.letterClosing) {
      this.letterClosing.textContent = letterData.closing || "Forever & Always With Love,";
    }
    if (this.letterSignature) {
      this.letterSignature.textContent = letterData.signature || `${this.config.senderName} ❤️`;
    }
  }

  toggleLetter() {
    if (!this.isOpen) {
      this.openLetter();
    } else {
      this.closeLetter();
    }
  }

  openLetter() {
    if (this.isOpen) return;
    this.isOpen = true;

    if (this.envelopeWrapper) {
      this.envelopeWrapper.classList.add('open');
    }

    if (this.openLetterBtn) {
      this.openLetterBtn.textContent = "Fold Letter Back ✉️";
    }

    // Spawn gentle hearts around envelope
    this.spawnRomanticHearts();

    // Start text typewriter effect after envelope flap unfolds
    setTimeout(() => {
      this.typewriteText();
    }, 600);

    if (this.nextToGalleryBtn) {
      setTimeout(() => {
        this.nextToGalleryBtn.classList.remove('hidden');
        this.nextToGalleryBtn.classList.add('fade-in-bounce');
      }, 2000);
    }

    if (typeof this.onLetterOpened === 'function') {
      this.onLetterOpened();
    }
  }

  closeLetter() {
    this.isOpen = false;
    if (this.envelopeWrapper) {
      this.envelopeWrapper.classList.remove('open');
    }
    if (this.openLetterBtn) {
      this.openLetterBtn.textContent = "Open My Letter 💌";
    }
  }

  typewriteText() {
    if (!this.letterBody) return;
    const paragraphs = this.config.letter?.paragraphs || [
      "Happy Birthday to the most special person in my life. You bring happiness, warmth, and beautiful memories into my world.",
      "I hope your special day is filled with love, laughter, and endless reasons to smile.",
      "No matter how many birthdays come and go, I hope we continue creating beautiful memories together.",
      "You are truly special to me. ❤️"
    ];

    this.letterBody.innerHTML = '';
    
    // Render paragraphs with staggered romantic fade-in
    paragraphs.forEach((pText, pIndex) => {
      const p = document.createElement('p');
      p.className = 'letter-paragraph';
      p.style.opacity = '0';
      p.style.transform = 'translateY(8px)';
      p.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      p.textContent = pText;
      this.letterBody.appendChild(p);

      setTimeout(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, pIndex * 500 + 100);
    });
  }

  spawnRomanticHearts() {
    const container = document.getElementById('letter-section');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-letter-heart';
        heart.textContent = ['❤️', '💖', '✨', '💕', '🌸'][Math.floor(Math.random() * 5)];
        heart.style.left = `${Math.random() * 80 + 10}%`;
        heart.style.bottom = '20%';
        heart.style.fontSize = `${Math.random() * 16 + 14}px`;
        heart.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
      }, i * 150);
    }
  }
}
