// ============================================
// Jo Loforte Gallery — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');
  const observer = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('nav--scrolled', !entry.isIntersecting),
    { threshold: 0.85 }
  );
  observer.observe(document.getElementById('hero'));

  // --- Mobile nav ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Build gallery grid ---
  const grid = document.getElementById('galleryGrid');

  ARTWORK.forEach((piece, index) => {
    const item = document.createElement('div');
    item.className = 'gallery__item reveal';
    item.dataset.index = index;
    item.dataset.category = piece.category;

    item.innerHTML = `
      <div class="gallery__item-img-wrap">
        <img data-src="${piece.thumb}" alt="${piece.title}" loading="lazy">
        <div class="gallery__item-overlay">
          <div class="gallery__item-info">
            <h3>${piece.title}</h3>
            <p>${[piece.medium, piece.dimensions].filter(Boolean).join(' — ')}</p>
          </div>
        </div>
        ${piece.available ? '<div class="gallery__item-badge">Available</div>' : ''}
      </div>
    `;

    grid.appendChild(item);
  });

  // --- Lazy load images ---
  const lazyImages = document.querySelectorAll('.gallery__item-img-wrap img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
        img.onerror = () => {
          // Hide card gracefully if image not found
          img.closest('.gallery__item').style.display = 'none';
        };
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => imageObserver.observe(img));

  // --- Scroll reveal ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxInfo = document.getElementById('lightboxInfo');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const piece = ARTWORK[currentIndex];
    lightboxImg.src = piece.image;
    lightboxImg.alt = piece.title;
    lightboxInfo.querySelector('.lightbox__title').textContent = piece.title;

    const details = [piece.medium, piece.dimensions, piece.year, piece.price]
      .filter(Boolean).join('  ·  ');
    lightboxInfo.querySelector('.lightbox__details').textContent = details;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % ARTWORK.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + ARTWORK.length) % ARTWORK.length;
    updateLightbox();
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (item) openLightbox(parseInt(item.dataset.index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // --- Filter buttons ---
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      document.querySelectorAll('.gallery__item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

});
