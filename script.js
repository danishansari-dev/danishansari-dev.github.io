/**
 * AI/ML portfolio interactions.
 * The site stays dependency-free so it loads quickly on GitHub Pages.
 */

const PROFILE = {
  github: 'https://github.com/danishansari-dev',
  linkedin: 'https://linkedin.com/in/danishansari-dev',
  leetcode: 'https://leetcode.com/u/danishansari-dev/',
  portfolio: 'https://danishansari.dev',
  phone: '+917300969491'
};

const roles = [
  'AI/ML Engineer',
  'Machine Learning Developer',
  'Data Science Practitioner',
  'Python Automation Builder',
  'Model Deployment Learner'
];

const featuredProjects = [
  {
    name: 'Predictive Analytics Pipeline',
    description: 'End-to-end ML workflow concept for cleaning data, training baseline models, comparing metrics, and preparing predictions for dashboards or APIs.',
    tags: ['Python', 'Pandas', 'Scikit-learn'],
    link: PROFILE.github
  },
  {
    name: 'NLP Assistant Prototype',
    description: 'Text intelligence project direction for summarization, semantic search, document Q&A, and structured insights from unstructured content.',
    tags: ['NLP', 'Embeddings', 'LLMs'],
    link: PROFILE.github
  },
  {
    name: 'Computer Vision Starter',
    description: 'Image classification and object-detection learning track focused on dataset preparation, model evaluation, and practical inference demos.',
    tags: ['Vision', 'Deep Learning', 'Inference'],
    link: PROFILE.github
  },
  {
    name: 'AI Portfolio Deployment',
    description: 'Production-minded portfolio system with static performance, accessible links, GitHub Pages hosting, and a clear AI/ML career narrative.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: PROFILE.portfolio
  }
];

const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const delay = entry.target.getAttribute('data-reveal-delay') || '0';
    if (delay !== '0') {
      entry.target.style.transitionDelay = `${delay}ms`;
    }

    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.navbar');
let scrollTimeout;
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

/**
 * Keeps the fixed navigation readable once content scrolls under it.
 * @returns {void}
 */
function throttledScrollHandler() {
  if (!navbar) return;

  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  if (scrollTimeout) return;

  scrollTimeout = setTimeout(() => {
    throttledScrollHandler();
    scrollTimeout = null;
  }, 100);
}, { passive: true });

/**
 * Rotates AI/ML role labels so the hero communicates range without extra copy.
 * @returns {void}
 */
function typewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const currentRole = roles[roleIndex];
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  typewriterEl.textContent = currentRole.substring(0, charIndex);

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 450;
  }

  setTimeout(typewriter, speed);
}

/**
 * Enables anchor navigation that feels like a single-page portfolio.
 * @returns {void}
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

/**
 * Renders AI/ML portfolio cards so the page has relevant work even before GitHub API data loads.
 * @returns {void}
 */
function renderFeaturedProjects() {
  const projectsContainer = document.getElementById('projectsContainer');
  if (!projectsContainer) return;

  projectsContainer.innerHTML = '';

  featuredProjects.forEach((project, index) => {
    projectsContainer.appendChild(createProjectCard(project, index));
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (!el.classList.contains('revealed')) {
      revealObserver.observe(el);
    }
  });
}

/**
 * Builds one project card from trusted local project metadata.
 * @param {{name: string, description: string, tags: string[], link: string}} project - Portfolio project data.
 * @param {number} index - Position used to stagger reveal animation.
 * @returns {HTMLDivElement} Project card element.
 */
function createProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-reveal', 'fade-up');
  card.setAttribute('data-reveal-delay', (index * 75).toString());

  const tags = project.tags
    .map(tag => `<span>${escapeHtml(tag)}</span>`)
    .join('');

  card.innerHTML = `
    <h3>${escapeHtml(project.name)}</h3>
    <p>${escapeHtml(project.description)}</p>
    <div class="project-meta">
      <span class="project-date">AI/ML Portfolio</span>
      <span class="project-stars">Production Focus</span>
    </div>
    <div class="tags">${tags}</div>
    <div class="project-links">
      <a href="${project.link}" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> View Profile
      </a>
    </div>
  `;

  return card;
}

/**
 * Prevents project metadata from being interpreted as markup.
 * @param {string} unsafe - Text that may contain HTML-reserved characters.
 * @returns {string} Escaped text safe for insertion into card markup.
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  border: none;
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(122, 60, 237, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  const shouldShow = window.scrollY > 500;
  scrollToTopBtn.style.opacity = shouldShow ? '1' : '0';
  scrollToTopBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading');
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 2200);
});

document.addEventListener('DOMContentLoaded', () => {
  typewriter();
  setupSmoothScrolling();
  renderFeaturedProjects();
});

console.log('Welcome to Danish Ansari AI/ML Portfolio.');
console.log('Built with vanilla HTML, CSS, and JavaScript for GitHub Pages.');
