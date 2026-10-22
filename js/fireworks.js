/**
 * REALISTIC SKY-SHOT FIREWORKS & ATMOSPHERE ENGINE
 * 
 * High-performance HTML Canvas 2D particle simulation featuring:
 * - Rocket launch trails with sparks and acceleration
 * - Multiple explosion styles: Chrysanthemum, Willow (golden brocade), Ring, Heart-shaped
 * - Dynamic particle physics: gravity, friction/air damping, fade, glow, and smoke
 * - Living night sky: twinkling starry background and shooting stars
 * - Interactive burst-on-click and celebratory grand finales
 */

export class FireworksEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.options = {
      maxParticles: options.maxParticles || 450,
      rocketSpawnInterval: options.rocketSpawnInterval || 900,
      heartProbability: options.heartProbability || 0.35,
      colors: options.colors || [
        '#ff2a6d', '#ff6ac1', '#ff70a6', '#ffd166', '#05d9e8',
        '#ffb703', '#e0aaff', '#ffffff', '#ff4d6d', '#f72585'
      ],
      ...options
    };

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.rockets = [];
    this.particles = [];
    this.stars = [];
    this.shootingStars = [];
    this.floatingHearts = [];
    
    this.isRunning = false;
    this.animationId = null;
    this.lastSpawnTime = 0;
    this.lastShootingStarTime = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initCanvas();
    this.initStars();
    this.bindEvents();
  }

  initCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initStars() {
    const starCount = Math.floor((this.width * this.height) / 5000);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.03 + 0.008) * (Math.random() > 0.5 ? 1 : -1)
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.initStars();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isRunning) {
        this.resume();
      }
    });

    // Interactive launch on canvas click
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.launchRocketTo(clickX, clickY, true);
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastSpawnTime = performance.now();
    this.loop(this.lastSpawnTime);
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (this.isRunning && !this.animationId) {
      this.lastSpawnTime = performance.now();
      this.loop(this.lastSpawnTime);
    }
  }

  stop() {
    this.isRunning = false;
    this.pause();
    this.rockets = [];
    this.particles = [];
    this.floatingHearts = [];
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  launchRocketTo(targetX, targetY, isSpecial = false) {
    const startX = Math.random() * (this.width * 0.7) + (this.width * 0.15);
    const startY = this.height;
    
    // Calculate initial velocity to reach target
    const dx = targetX - startX;
    const dy = targetY - startY;
    const flightTime = Math.max(35, Math.min(55, Math.abs(dy) / 12));
    
    const vx = dx / flightTime;
    const vy = dy / flightTime - 0.5 * 0.18 * flightTime; // compensate gravity

    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    const isHeart = isSpecial || (Math.random() < this.options.heartProbability);

    this.rockets.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx,
      vy,
      prevPoints: [],
      color,
      isHeart,
      sparkColor: '#ffd166',
      age: 0,
      maxAge: flightTime + 5
    });
  }

  spawnRandomRocket() {
    const targetX = Math.random() * (this.width * 0.8) + (this.width * 0.1);
    const targetY = Math.random() * (this.height * 0.45) + (this.height * 0.12);
    this.launchRocketTo(targetX, targetY);
  }

  triggerHeartBurst(x, y, color = '#ff2a6d') {
    const particleCount = this.reducedMotion ? 40 : 85;
    // Parametric heart formula
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2;
      // Heart parametric curve
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const speed = Math.random() * 0.18 + 0.22;
      const vx = hx * speed + (Math.random() - 0.5) * 0.3;
      const vy = hy * speed + (Math.random() - 0.5) * 0.3;

      this.particles.push({
        x,
        y,
        vx,
        vy,
        prevPoints: [],
        color: Math.random() > 0.3 ? color : '#ffd166',
        alpha: 1,
        decay: Math.random() * 0.012 + 0.01,
        gravity: 0.04,
        friction: 0.985,
        radius: Math.random() * 2.2 + 1.2,
        sparkle: Math.random() > 0.4,
        isHeartShaped: true
      });
    }

    // Spawn gentle floating heart icons
    for (let h = 0; h < 3; h++) {
      this.floatingHearts.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vy: -(Math.random() * 1.2 + 0.8),
        vx: (Math.random() - 0.5) * 0.8,
        scale: Math.random() * 0.8 + 0.6,
        alpha: 1,
        decay: 0.008,
        color: '#ff4d6d'
      });
    }
  }

  explodeRocket(rocket) {
    const { x, y, color, isHeart } = rocket;

    if (isHeart) {
      this.triggerHeartBurst(x, y, color);
      return;
    }

    // Select burst type: Chrysanthemum (standard), Willow (golden droop), or Ring
    const burstTypes = ['chrysanthemum', 'willow', 'ring'];
    const chosenType = burstTypes[Math.floor(Math.random() * burstTypes.length)];
    const particleCount = this.reducedMotion ? 35 : (chosenType === 'willow' ? 90 : 75);

    if (chosenType === 'ring') {
      const ringColor = color;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = Math.random() * 0.8 + 3.2;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          prevPoints: [],
          color: ringColor,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          gravity: 0.06,
          friction: 0.97,
          radius: Math.random() * 2 + 1,
          sparkle: true
        });
      }
    } else if (chosenType === 'willow') {
      // Willow: golden glittering long trails with slow gravity drop
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.8 + 0.8;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          prevPoints: [],
          color: '#ffd700',
          secondaryColor: '#fff176',
          alpha: 1,
          decay: Math.random() * 0.008 + 0.006, // long lasting
          gravity: 0.08,
          friction: 0.965,
          radius: Math.random() * 1.8 + 1,
          sparkle: true
        });
      }
    } else {
      // Chrysanthemum: vivid spherical burst
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.2 + 0.6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          prevPoints: [],
          color: Math.random() > 0.2 ? color : '#ffffff',
          alpha: 1,
          decay: Math.random() * 0.02 + 0.014,
          gravity: 0.07,
          friction: 0.972,
          radius: Math.random() * 2.4 + 1.2,
          sparkle: Math.random() > 0.5
        });
      }
    }

    // Add soft explosion flash/smoke puff
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      prevPoints: [],
      color: '#ffffff',
      alpha: 0.6,
      decay: 0.08,
      gravity: 0,
      friction: 1,
      radius: 28,
      isPuff: true
    });
  }

  triggerGrandFinale() {
    // Rapid succession of colorful bursts and heart fireworks
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const x = Math.random() * (this.width * 0.8) + (this.width * 0.1);
        const y = Math.random() * (this.height * 0.4) + (this.height * 0.12);
        if (i % 2 === 0) {
          this.triggerHeartBurst(x, y, '#ff2a6d');
        } else {
          this.launchRocketTo(x, y);
        }
      }, i * 220);
    }
  }

  updateAndDrawStars() {
    this.ctx.save();
    for (const star of this.stars) {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.95) {
        star.alpha = 0.95;
        star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
      } else if (star.alpha < 0.2) {
        star.alpha = 0.2;
        star.twinkleSpeed = Math.abs(star.twinkleSpeed);
      }

      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  updateAndDrawShootingStars(now) {
    // Trigger shooting star every 7-14 seconds
    if (now - this.lastShootingStarTime > 8000 + Math.random() * 6000) {
      this.lastShootingStarTime = now;
      const startX = Math.random() * (this.width * 0.7);
      const startY = Math.random() * (this.height * 0.3);
      const length = Math.random() * 120 + 80;
      this.shootingStars.push({
        x: startX,
        y: startY,
        vx: 8 + Math.random() * 4,
        vy: 4 + Math.random() * 2,
        length,
        alpha: 1,
        decay: 0.02
      });
    }

    this.ctx.save();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createLinearGradient(
        s.x, s.y,
        s.x - (s.vx * 10), s.y - (s.vy * 10)
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.6;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - (s.vx * 10), s.y - (s.vy * 10));
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  updateAndDrawFloatingHearts() {
    this.ctx.save();
    for (let i = this.floatingHearts.length - 1; i >= 0; i--) {
      const h = this.floatingHearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.alpha -= h.decay;

      if (h.alpha <= 0) {
        this.floatingHearts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(h.x, h.y);
      this.ctx.scale(h.scale, h.scale);
      this.ctx.globalAlpha = h.alpha;
      this.ctx.fillStyle = h.color;
      
      // Draw small heart shape
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(-5, -6, -10, 0, 0, 10);
      this.ctx.bezierCurveTo(10, 0, 5, -6, 0, 0);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    // Translucent clear gives realistic light trail persistence
    this.ctx.fillStyle = 'rgba(4, 7, 18, 0.24)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.updateAndDrawStars();
    this.updateAndDrawShootingStars(timestamp);

    // Automatic rocket spawning
    if (timestamp - this.lastSpawnTime > this.options.rocketSpawnInterval) {
      if (this.rockets.length < this.options.maxRockets) {
        this.spawnRandomRocket();
      }
      this.lastSpawnTime = timestamp;
    }

    // Update & draw rockets
    this.ctx.save();
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.prevPoints.push({ x: r.x, y: r.y });
      if (r.prevPoints.length > 8) r.prevPoints.shift();

      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.18; // gravity
      r.age++;

      // Draw rocket trail
      if (r.prevPoints.length > 1) {
        this.ctx.strokeStyle = r.sparkColor;
        this.ctx.lineWidth = 2.2;
        this.ctx.beginPath();
        this.ctx.moveTo(r.prevPoints[0].x, r.prevPoints[0].y);
        for (let p = 1; p < r.prevPoints.length; p++) {
          this.ctx.lineTo(r.prevPoints[p].x, r.prevPoints[p].y);
        }
        this.ctx.stroke();
      }

      // Draw rocket head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Check detonation condition (apex or age reached)
      const reachedApex = r.vy >= -0.5;
      const reachedTarget = r.y <= r.targetY;
      if (reachedApex || reachedTarget || r.age >= r.maxAge) {
        this.explodeRocket(r);
        this.rockets.splice(i, 1);
      }
    }
    this.ctx.restore();

    // Use additive blending for dazzling glowing explosion particles
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.isPuff) {
        p.alpha -= p.decay;
        p.radius += 1.2;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        this.ctx.fillStyle = `rgba(255, 230, 240, ${p.alpha * 0.25})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        continue;
      }

      p.prevPoints.push({ x: p.x, y: p.y });
      if (p.prevPoints.length > 5) p.prevPoints.shift();

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw spark trail
      if (p.prevPoints.length > 1) {
        this.ctx.strokeStyle = p.color;
        this.ctx.globalAlpha = p.alpha * 0.7;
        this.ctx.lineWidth = p.radius * 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(p.prevPoints[0].x, p.prevPoints[0].y);
        for (let pt = 1; pt < p.prevPoints.length; pt++) {
          this.ctx.lineTo(p.prevPoints[pt].x, p.prevPoints[pt].y);
        }
        this.ctx.stroke();
      }

      // Draw particle center
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.sparkle && Math.random() > 0.5 ? '#ffffff' : p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();

    this.updateAndDrawFloatingHearts();

    this.animationId = requestAnimationFrame((ts) => this.loop(ts));
  }
}
