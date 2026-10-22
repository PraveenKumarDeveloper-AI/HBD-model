/**
 * MIDNIGHT COUNTDOWN CONTROLLER
 * 
 * Accurately tracks the time remaining until midnight on the configured birthday date,
 * strictly respecting the specified timezone (e.g. Asia/Kolkata).
 * 
 * Automatically triggers the celebration transition when target time arrives,
 * or immediately if the target time has already passed.
 */

export class CountdownController {
  constructor(config, onUnlock) {
    this.config = config;
    this.onUnlock = onUnlock;
    this.timerId = null;
    this.isUnlocked = false;

    // DOM Elements
    this.daysEl = document.getElementById('count-days');
    this.hoursEl = document.getElementById('count-hours');
    this.minutesEl = document.getElementById('count-minutes');
    this.secondsEl = document.getElementById('count-seconds');
    this.targetDateLabel = document.getElementById('target-date-label');
    this.countdownContainer = document.getElementById('countdown-section');

    this.targetTimestamp = this.calculateTargetTimestamp();
    this.init();
  }

  /**
   * Calculates the exact UTC timestamp for target date + time in the specified timezone
   */
  calculateTargetTimestamp() {
    const [year, month, day] = this.config.birthdayDate.split('-').map(Number);
    const hour = this.config.targetHour || 0;
    const minute = this.config.targetMinute || 0;
    const timeZone = this.config.timezone || 'Asia/Kolkata';

    // Initial UTC guess assuming UTC
    const guessUtc = Date.UTC(year, month - 1, day, hour, minute, 0);

    // Measure timezone offset at that time using Intl.DateTimeFormat
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23'
      });

      const parts = formatter.formatToParts(new Date(guessUtc));
      const partMap = {};
      parts.forEach(p => { partMap[p.type] = parseInt(p.value, 10); });

      const dateInZoneAsUtc = Date.UTC(
        partMap.year,
        partMap.month - 1,
        partMap.day,
        partMap.hour,
        partMap.minute,
        partMap.second
      );

      const offsetMs = dateInZoneAsUtc - guessUtc;
      return guessUtc - offsetMs;
    } catch (e) {
      console.warn('Fallback to local timezone calculation:', e);
      return new Date(year, month - 1, day, hour, minute, 0).getTime();
    }
  }

  init() {
    if (this.targetDateLabel) {
      try {
        const d = new Date(this.targetTimestamp);
        const options = {
          timeZone: this.config.timezone,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        };
        this.targetDateLabel.textContent = new Intl.DateTimeFormat('en-US', options).format(d);
      } catch (e) {
        this.targetDateLabel.textContent = `${this.config.birthdayDate} Midnight`;
      }
    }

    // Tab visibility listener to prevent clock drift during sleep
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isUnlocked) {
        this.tick();
      }
    });

    this.start();
  }

  start() {
    this.tick();
    if (!this.isUnlocked) {
      this.timerId = setInterval(() => this.tick(), 1000);
    }
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  tick() {
    if (this.isUnlocked) return;

    // In testMode, we allow manual trigger or instant unlock
    if (this.config.testMode) {
      this.triggerUnlock();
      return;
    }

    const now = Date.now();
    const remainingMs = this.targetTimestamp - now;

    if (remainingMs <= 0) {
      this.updateDisplay(0, 0, 0, 0);
      this.triggerUnlock();
      return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.updateDisplay(days, hours, minutes, seconds);
  }

  updateDisplay(days, hours, minutes, seconds) {
    if (this.daysEl) this.setDigit(this.daysEl, String(days).padStart(2, '0'));
    if (this.hoursEl) this.setDigit(this.hoursEl, String(hours).padStart(2, '0'));
    if (this.minutesEl) this.setDigit(this.minutesEl, String(minutes).padStart(2, '0'));
    if (this.secondsEl) this.setDigit(this.secondsEl, String(seconds).padStart(2, '0'));
  }

  setDigit(element, value) {
    if (element.textContent !== value) {
      element.textContent = value;
      element.classList.remove('pulse-digit');
      void element.offsetWidth; // trigger reflow for css animation
      element.classList.add('pulse-digit');
    }
  }

  triggerUnlock() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.stop();
    if (typeof this.onUnlock === 'function') {
      this.onUnlock();
    }
  }

  forceUnlock() {
    this.triggerUnlock();
  }

  resetCountdown() {
    this.isUnlocked = false;
    this.targetTimestamp = Date.now() + 60000; // 60 seconds from now for demo
    this.start();
  }
}
