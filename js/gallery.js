/**
 * OUR MEMORIES GALLERY & LIGHTBOX CONTROLLER
 * 
 * Features Polaroid-style romantic photo cards with tape/pin styling,
 * full-screen lightbox image viewer with keyboard navigation, swipe support,
 * and resilient image fallbacks.
 */

export class GalleryController {
  constructor(config) {
    this.config = config;
    this.photos = this.config.gallery || [];
    this.currentIndex = 0;

    this.galleryGrid = document.getElementById('gallery-grid');
    this.lightbox = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-image');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxDate = document.getElementById('lightbox-date');
    this.lightboxDesc = document.getElementById('lightbox-description');
    this.closeBtn = document.getElementById('lightbox-close');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');

    this.init();
  }

  init() {
    this.renderGalleryCards();
    this.bindEvents();
  }

  renderGalleryCards() {
    if (!this.galleryGrid) return;
    this.galleryGrid.innerHTML = '';

    const rotations = [-2.5, 1.8, -1.2, 2.8, -2.1, 1.5];

    this.photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      const rot = rotations[idx % rotations.length];
      card.style.setProperty('--card-rotation', `${rot}deg`);

      card.innerHTML = `
        <div class="polaroid-pin"></div>
        <div class="polaroid-photo-box">
          <img 
            src="${photo.src}" 
            alt="${photo.caption}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='assets/images/gallery/placeholder.svg'; this.classList.add('img-fallback');"
          />
          <div class="polaroid-overlay">
            <span>Click to View 🔍</span>
          </div>
        </div>
        <div class="polaroid-meta">
          <div class="polaroid-caption">${photo.caption}</div>
          <div class="polaroid-date">${photo.date}</div>
        </div>
      `;

      card.addEventListener('click', () => this.openLightbox(idx));
      this.galleryGrid.appendChild(card);
    });
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevPhoto();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextPhoto();
      });
    }

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || !this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    });
  }

  openLightbox(index) {
    if (index < 0 || index >= this.photos.length) return;
    this.currentIndex = index;
    this.updateLightboxContent();

    if (this.lightbox) {
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updateLightboxContent();
  }

  prevPhoto() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;

    if (this.lightboxImg) {
      this.lightboxImg.style.opacity = '0';
      this.lightboxImg.src = photo.src;
      this.lightboxImg.onload = () => {
        this.lightboxImg.style.opacity = '1';
      };
      this.lightboxImg.onerror = () => {
        this.lightboxImg.src = 'assets/images/gallery/placeholder.svg';
        this.lightboxImg.style.opacity = '1';
      };
    }

    if (this.lightboxCaption) this.lightboxCaption.textContent = photo.caption || '';
    if (this.lightboxDate) this.lightboxDate.textContent = photo.date || '';
    if (this.lightboxDesc) this.lightboxDesc.textContent = photo.description || '';
  }
}
