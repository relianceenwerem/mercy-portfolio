/* ============================================================
   MERCY ATOLAGBE — GIS & ENVIRONMENTAL PORTFOLIO
   script.js
   ============================================================ */

// ---- Navbar: scroll shadow + active link ----
const navHeader = document.getElementById('nav-header');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function updateNav() {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---- Mobile nav toggle ----
const navToggle  = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');

function closeNav() {
  navLinksEl.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity   = '';
  spans[2].style.transform = '';
}

navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else { closeNav(); }
});

navLinksEl.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeNav));

// ---- Project filter tabs ----
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card, i) => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animationDelay = `${i * 0.06}s`;
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
      }
    });
  });
});

// ---- Project Modal ----
const overlay     = document.getElementById('modal-overlay');
const modalImg    = document.getElementById('modal-img');
const modalCaption= document.getElementById('modal-caption');
const modalThumbs = document.getElementById('modal-thumbs');
const modalBadge  = document.getElementById('modal-badge-wrap');
const modalMeta   = document.getElementById('modal-meta-text');
const modalTitle  = document.getElementById('modal-title');
const modalDesc   = document.getElementById('modal-desc');
const modalFinding= document.getElementById('modal-finding');
const modalTools  = document.getElementById('modal-tools');
const btnClose    = document.getElementById('modal-close');
const btnPrev     = document.getElementById('gallery-prev');
const btnNext     = document.getElementById('gallery-next');

let galleryImages   = [];
let galleryCaptions = [];
let galleryIndex    = 0;

function openModal(card) {
  galleryImages   = (card.dataset.images   || '').split(',').map(s => s.trim()).filter(Boolean);
  galleryCaptions = (card.dataset.captions || '').split(',').map(s => s.trim());
  galleryIndex    = 0;

  // Populate info pane
  const badge   = card.querySelector('.project-badge');
  const meta    = card.querySelector('.project-meta');
  const title   = card.querySelector('.project-title');
  const desc    = card.querySelector('.project-desc');
  const finding = card.querySelector('.project-finding');
  const tools   = card.querySelector('.project-tools');

  modalBadge.innerHTML  = badge   ? badge.outerHTML   : '';
  modalMeta.textContent = meta    ? meta.textContent  : '';
  modalTitle.textContent= title   ? title.textContent : '';
  modalDesc.textContent = desc    ? desc.textContent  : '';
  modalFinding.innerHTML= finding ? `<span class="finding-label">Key Finding</span>${finding.querySelector('p') ? finding.querySelector('p').outerHTML : ''}` : '';
  modalTools.innerHTML  = tools   ? tools.innerHTML   : '';

  if (!finding) modalFinding.style.display = 'none';
  else modalFinding.style.display = '';

  // Build thumbnails
  modalThumbs.innerHTML = '';
  if (galleryImages.length > 1) {
    galleryImages.forEach((src, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'modal-thumb' + (i === 0 ? ' active' : '');
      thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${i+1}" loading="lazy" />`;
      thumb.addEventListener('click', () => setGalleryIndex(i));
      modalThumbs.appendChild(thumb);
    });
  }

  renderGalleryImage();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function setGalleryIndex(i) {
  galleryIndex = i;
  renderGalleryImage();
  // Update thumb highlights
  modalThumbs.querySelectorAll('.modal-thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === i);
  });
}

function renderGalleryImage() {
  const src = galleryImages[galleryIndex] || '';
  const cap = galleryCaptions[galleryIndex] || '';
  modalImg.src = src;
  modalImg.alt = cap;
  modalCaption.textContent = cap;
  btnPrev.classList.toggle('hidden', galleryIndex === 0);
  btnNext.classList.toggle('hidden', galleryIndex === galleryImages.length - 1);
}

// Open modal on card click
projectCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

btnClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

btnPrev.addEventListener('click', e => { e.stopPropagation(); setGalleryIndex(galleryIndex - 1); });
btnNext.addEventListener('click', e => { e.stopPropagation(); setGalleryIndex(galleryIndex + 1); });

// Keyboard nav
document.addEventListener('keydown', e => {
  if (!overlay.classList.contains('open')) return;
  if (e.key === 'Escape')      closeModal();
  if (e.key === 'ArrowLeft'  && galleryIndex > 0)                     setGalleryIndex(galleryIndex - 1);
  if (e.key === 'ArrowRight' && galleryIndex < galleryImages.length - 1) setGalleryIndex(galleryIndex + 1);
});

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

['.section-header', '.about-left', '.about-right', '.edu-card',
 '.project-card', '.skill-group', '.timeline-item', '.extras-card',
 '.contact-card', '.stat'].forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.05}s`;
    revealObserver.observe(el);
  });
});

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
