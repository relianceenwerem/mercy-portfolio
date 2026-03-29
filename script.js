/* ============================================================
   MERCY ATOLAGBE — GIS & ENVIRONMENTAL PORTFOLIO
   script.js
   ============================================================ */

// ---- Navbar: scroll shadow + active link ----
const navHeader = document.getElementById('nav-header');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function updateNav() {
  // Scrolled class for blur/shadow
  navHeader.classList.toggle('scrolled', window.scrollY > 20);

  // Active link highlighting
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);

  // Animate hamburger into X
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ---- Project filter tabs ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach((card, i) => {
      const categories = card.dataset.category || '';
      const show = filter === 'all' || categories.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        // Stagger animation
        card.style.animationDelay = `${i * 0.07}s`;
        card.style.animation = 'none';
        void card.offsetWidth; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add reveal class to key elements
const revealTargets = [
  '.section-header',
  '.about-text',
  '.about-edu',
  '.edu-card',
  '.project-card',
  '.skill-group',
  '.timeline-item',
  '.extras-card',
  '.contact-card',
  '.stat',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.05}s`;
    revealObserver.observe(el);
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
