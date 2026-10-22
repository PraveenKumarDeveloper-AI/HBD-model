/**
 * ROMANTIC BACKGROUND MUSIC CONTROLLER
 * 
 * Specifically configured for playing "Kalla Nikkiriye (Anbil Avan)".
 * Handles instant autoplay on open, browser policy negotiation, and gesture triggers.
 */

export class MusicController {
  constructor(config) {
    this.config = config.music || {};
    this.isPlaying = false;
    this.usingSynthFallback = false;
    this.volume = this.config.defaultVolume ?? 0.8;

    // DOM Elements
    this.audioEl = document.getElementById('bg-audio');
    this.musicToggleBtn = document.getElementById('music-toggle-btn');
    this.musicStatusLabel = document.getElementById('music-status-text');
    this.volumeSlider = document.getElementById('music-volume-slider');
    this.equalizerBars = document.getElementById('music-equalizer');

    // Synth fallback state (only used if mp3 file is genuinely missing/corrupt)
    this.audioCtx = null;
    this.synthIntervalId = null;

    this.init();
  }

  init() {
    if (this.audioEl) {
      this.audioEl.src = this.config.filePath || 'assets/music/kalla-nikkiriye.mp3';
      this.audioEl.loop = this.config.loop !== false;
      this.audioEl.volume = this.volume;
      this.audioEl.muted = false;

      this.audioEl.addEventListener('error', (e) => {
        const err = this.audioEl.error;
        console.warn('Audio file error detected:', err ? `Code ${err.code} - ${err.message}` : e);
      });

      // Ensure seamless continuous looping across all browsers
      this.audioEl.addEventListener('ended', () => {
        this.audioEl.currentTime = 0;
        this.audioEl.play().catch(e => console.log('Seamless loop restart note:', e));
      });

      // Background playback resilience: resume when returning to tab
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isPlaying && this.audioEl && this.audioEl.paused && !this.usingSynthFallback) {
          this.audioEl.play().catch(() => {});
        }
      });

      this.audioEl.addEventListener('play', () => {
        this.isPlaying = true;
        this.usingSynthFallback = false;
        this.updateUI(true);
        this.dismissAutoplayToast();
      });

      this.audioEl.addEventListener('pause', () => {
        // Only mark paused if not caused by tab switching or synth
        if (!this.usingSynthFallback && this.audioEl.paused) {
          this.isPlaying = false;
          this.updateUI(false);
        }
      });
    }

    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume * 100;
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        this.setVolume(val);
      });
    }

    // Try autoplay right away
    this.attemptAutoplay();

    // Universal gesture trigger: the instant the user taps, clicks, scrolls, or presses any key, play the song!
    const triggerAudioOnFirstGesture = () => {
      if (!this.isPlaying) {
        this.play();
      }
      this.dismissAutoplayToast();
      ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'].forEach(evt => {
        window.removeEventListener(evt, triggerAudioOnFirstGesture);
      });
    };

    ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'].forEach(evt => {
      window.addEventListener(evt, triggerAudioOnFirstGesture, { once: true, passive: true });
    });
  }

  attemptAutoplay() {
    if (!this.audioEl) return;
    this.audioEl.volume = this.volume;
    this.audioEl.muted = false;

    this.play()
      .then(() => {
        console.log('Kalla Nikkiriye autoplayed successfully on load!');
        this.dismissAutoplayToast();
      })
      .catch((err) => {
        console.log('Autoplay policy requires user touch/gesture:', err?.message);
        this.showAutoplayToast();
      });
  }

  showAutoplayToast() {
    if (document.getElementById('music-autoplay-toast') || this.isPlaying) return;
    const toast = document.createElement('div');
    toast.id = 'music-autoplay-toast';
    toast.className = 'music-autoplay-toast fade-in';
    toast.innerHTML = `<span>🎵 Click anywhere to play Kalla Nikkiriye ❤️</span>`;
    toast.addEventListener('click', (e) => {
      e.stopPropagation();
      this.play();
      this.dismissAutoplayToast();
    });
    document.body.appendChild(toast);
  }

  dismissAutoplayToast() {
    const toast = document.getElementById('music-autoplay-toast');
    if (toast) {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 500);
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  async play() {
    if (!this.audioEl) return;

    try {
      this.audioEl.muted = false;
      await this.audioEl.play();
      this.isPlaying = true;
      this.usingSynthFallback = false;
      this.updateUI(true);
      this.dismissAutoplayToast();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        // Browser blocked autoplay before user interaction
        this.isPlaying = false;
        this.updateUI(false);
        throw err;
      }
      if (err.name === 'AbortError') {
        // Play was interrupted by rapid interaction; keep state ready
        return;
      }
      console.warn('Audio playback error:', err);
      // Only switch to synth if audio source really failed
      if (this.audioEl.error) {
        this.usingSynthFallback = true;
        this.startSynth();
        this.isPlaying = true;
        this.updateUI(true);
      }
    }
  }

  pause() {
    if (this.usingSynthFallback) {
      this.stopSynth();
    } else if (this.audioEl) {
      this.audioEl.pause();
    }
    this.isPlaying = false;
    this.updateUI(false);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    if (this.synthMasterGain) {
      this.synthMasterGain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx?.currentTime || 0);
    }
  }

  updateUI(playing) {
    if (this.musicToggleBtn) {
      this.musicToggleBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      this.musicToggleBtn.querySelector('.music-icon').textContent = playing ? '🔊' : '🔈';
    }

    if (this.musicStatusLabel) {
      this.musicStatusLabel.textContent = playing 
        ? `${this.config.title || 'Kalla Nikkiriye'} 🎵` 
        : 'Music Paused';
    }

    if (this.equalizerBars) {
      if (playing) {
        this.equalizerBars.classList.add('playing');
      } else {
        this.equalizerBars.classList.remove('playing');
      }
    }
  }

  // --- Web Audio API Fallback (only if MP3 file is completely missing) ---
  initSynth() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.audioCtx = new AudioContextClass();
    this.synthMasterGain = this.audioCtx.createGain();
    this.synthMasterGain.gain.setValueAtTime(this.volume * 0.14, this.audioCtx.currentTime);
    this.synthMasterGain.connect(this.audioCtx.destination);
  }

  playNote(frequency, duration = 2.2) {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') {
      this.audioCtx?.resume();
    }
    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.synthMasterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  startSynth() {
    this.initSynth();
    if (!this.audioCtx) return;

    const melodyChords = [
      [261.63, 329.63, 392.00, 493.88, 587.33],
      [220.00, 261.63, 329.63, 392.00, 493.88],
      [174.61, 261.63, 329.63, 349.23, 440.00],
      [196.00, 261.63, 293.66, 392.00, 523.25]
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playNext = () => {
      const chord = melodyChords[chordIdx];
      const freq = chord[noteIdx];
      this.playNote(freq, 2.5);

      noteIdx++;
      if (noteIdx >= chord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % melodyChords.length;
      }
    };

    playNext();
    this.synthIntervalId = setInterval(playNext, 620);
  }

  stopSynth() {
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }
}
