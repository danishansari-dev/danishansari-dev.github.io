/**
 * Premium Portfolio - Refactored JavaScript
 * Uses Vanilla JS only - No heavy libraries
 * Intersection Observer for scroll animations
 */

// ======================== SCROLL REVEAL OBSERVER ========================
// Initialize Intersection Observer for scroll reveal animations
const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Get delay from data attribute
      const delay = entry.target.getAttribute('data-reveal-delay') || '0';
      
      // Apply delay if specified
      if (delay !== '0') {
        entry.target.style.transitionDelay = `${delay}ms`;
      }
      
      // Add revealed class to trigger animation
      entry.target.classList.add('revealed');
      
      // Stop observing this element after it's revealed (for performance)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15, // Trigger when 15% of element is visible
  rootMargin: '0px 0px -50px 0px' // Start revealing slightly before viewport
});

// Observe all reveal elements
revealElements.forEach(el => revealObserver.observe(el));

// ======================== MOBILE MENU TOGGLE ========================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ======================== NAVBAR SCROLL EFFECT (THROTTLED) ========================
const navbar = document.querySelector('.navbar');
let scrollTimeout;

// Throttle scroll events to every 100ms for better performance
function throttledScrollHandler() {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      throttledScrollHandler();
      scrollTimeout = null;
    }, 100);
  }
}, { passive: true });

// ======================== TYPEWRITER EFFECT ========================
const roles = [
  'Backend Engineer',
  'Cyber Security Specialist',
  'DevOps Enthusiast',
  'Full Stack Developer',
  'Cloud Architect'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  // Update text
  typewriterEl.textContent = currentRole.substring(0, charIndex);

  // Determine typing speed
  let speed = isDeleting ? 40 : 80;

  // If word is complete, prepare to delete
  if (!isDeleting && charIndex === currentRole.length) {
    speed = 2000; // Pause at end
    isDeleting = true;
  } 
  // If word is deleted, move to next word
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 500; // Pause before typing
  }

  setTimeout(typewriter, speed);
}

// Start typewriter on DOM ready
document.addEventListener('DOMContentLoaded', typewriter);

// ======================== SMOOTH SCROLLING ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ======================== GITHUB API - FETCH PROJECTS ========================
async function fetchGitHubProjects() {
  const username = 'danishansari-dev';
  const projectsContainer = document.getElementById('projectsContainer');

  if (!projectsContainer) return;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch repositories');

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No repositories found. Update the GitHub username in script.js to see your projects.</p>';
      return;
    }

    projectsContainer.innerHTML = '';

    repos.forEach((repo, index) => {
      const card = createProjectCard(repo, index);
      projectsContainer.appendChild(card);
    });

    // Re-observe new elements for scroll animation
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (!el.classList.contains('revealed')) {
        revealObserver.observe(el);
      }
    });

  } catch (error) {
    console.error('Error fetching repositories:', error);
    projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Unable to load projects. Please try again later.</p>';
  }
}

function createProjectCard(repo, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-reveal', 'fade-up');
  card.setAttribute('data-reveal-delay', (index * 50).toString());

  const stars = repo.stargazers_count > 0 ? `${repo.stargazers_count} ⭐` : 'Repository';

  card.innerHTML = `
    <h3>${escapeHtml(repo.name)}</h3>
    <p>${escapeHtml(repo.description || 'No description available')}</p>
    <div class="project-meta">
      <span class="project-date">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
      <span class="project-stars">${stars}</span>
    </div>
    <div class="tags">
      ${repo.language ? `<span>${escapeHtml(repo.language)}</span>` : ''}
      ${repo.topics?.slice(0, 2).map(topic => `<span>${escapeHtml(topic)}</span>`).join('') || '<span>Open Source</span>'}
    </div>
    <div class="project-links">
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> View Code
      </a>
    </div>
  `;

  return card;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fetch projects on load
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// ======================== CONTACT FORM ========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = this.querySelector('input[type="text"]');
    const emailInput = this.querySelector('input[type="email"]');
    const messageInput = this.querySelector('textarea');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    // Create mailto link
    const mailtoLink = `mailto:danish@example.com?subject=${encodeURIComponent(`Contact from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    // Show success message
    showNotification('Message sent! Opening your default email client...', 'success');

    // Reset form
    this.reset();
  });
}

// Show notifications
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    border: 1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ======================== SCROLL TO TOP BUTTON ========================
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
  if (window.scrollY > 500) {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.visibility = 'visible';
  } else {
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.visibility = 'hidden';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ======================== LOADING SCREEN ========================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 2500);
  }
});

// ======================== CONSOLE MESSAGE ========================
console.log('%c✨ Welcome to Danish Ansari\'s Premium Portfolio!', 'font-size: 18px; color: #00d4ff; font-weight: bold;');
console.log('%c🚀 Built with Vanilla HTML, CSS & JavaScript', 'font-size: 14px; color: #9d4edd;');
console.log('%c💡 No heavy libraries. Pure performance.', 'font-size: 14px; color: #00d4ff;');

