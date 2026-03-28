// ======================== MENU TOGGLE ========================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ======================== NAVBAR SCROLL EFFECT ========================
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  let scrollTop = window.scrollY;
  if (scrollTop > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollTop = scrollTop;
});

// ======================== TYPEWRITER EFFECT ========================
const texts = [
  'Backend Engineer',
  'Cyber Security Specialist',
  'DevOps Enthusiast',
  'Full Stack Developer',
  'Cloud Architect'
];

let count = 0;
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

function typeWriter() {
  if (count === texts.length) {
    count = 0;
  }
  currentText = texts[count];

  if (isDeleting) {
    letter = currentText.slice(0, --index);
  } else {
    letter = currentText.slice(0, ++index);
  }

  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    typewriterEl.textContent = letter;
  }

  let typeSpeed = 80;

  if (isDeleting) {
    typeSpeed /= 2;
  }

  if (!isDeleting && letter.length === currentText.length) {
    typeSpeed = 2000; // Pause at the end of word
    isDeleting = true;
  } else if (isDeleting && letter.length === 0) {
    isDeleting = false;
    count++;
    typeSpeed = 500; // Pause before typing next word
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', typeWriter);

// ======================== PARTICLE BACKGROUND ========================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
  }

  // Initialize particles
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  // Animal loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].draw();
      particlesArray[i].update();

      // Draw connecting lines
      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ======================== SMOOTH SCROLLING ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// ======================== INITIALIZE AOS ========================
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 100,
    delay: 0
  });
});

// ======================== GITHUB API - FETCH PROJECTS ========================
async function fetchGitHubProjects() {
  const username = 'danishansari-dev'; // Replace with your GitHub username
  const projectsContainer = document.getElementById('projectsContainer');

  if (!projectsContainer) return;

  try {
    // Fetch repositories from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No repositories found. Update the GitHub username in the script.</p>';
      return;
    }

    projectsContainer.innerHTML = '';

    repos.forEach(repo => {
      const projectCard = createProjectCard(repo);
      projectsContainer.appendChild(projectCard);
    });

    // Refresh AOS
    AOS.refresh();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Unable to load projects. Please try again later.</p>';
  }
}

function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-aos', 'fade-up');

  const languages = [
    repo.language || 'JavaScript',
    repo.topics?.[0] || 'Web'
  ].filter(Boolean);

  const stars = repo.stargazers_count > 0 ? `${repo.stargazers_count} ⭐` : 'Repository';

  card.innerHTML = `
    <h3>${repo.name}</h3>
    <p>${repo.description || 'No description available'}</p>
    <div class="project-meta">
      <span class="project-date">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
      <span class="project-stars">${stars}</span>
    </div>
    <div class="tags">
      ${repo.language ? `<span>${repo.language}</span>` : ''}
      ${repo.topics?.slice(0, 2).map(topic => `<span>${topic}</span>`).join('') || '<span>Open Source</span>'}
    </div>
    <div class="project-links">
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> View Code
      </a>
    </div>
  `;

  return card;
}

// Fetch projects when page loads
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// ======================== CONTACT FORM ========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Validate
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Create mailto link
    const mailtoLink = `mailto:danish@example.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    // Reset form
    this.reset();
  });
}

// ======================== FORM INPUT FOCUS EFFECT ========================
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    if (!this.value.trim()) {
      this.parentElement.classList.remove('focused');
    }
  });
});

// ======================== SCROLL TO TOP BUTTON ========================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border: none;
  border-radius: 50%;
  color: var(--bg-dark);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
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

// ======================== LOADING SCREEN TIMEOUT ========================
window.addEventListener('load', () => {
  // Remove loading screen after 2 seconds
  const loadingScreen = document.getElementById('loading');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 2500);
  }
});

// ======================== CURSOR EFFECTS (OPTIONAL) ========================
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Create subtle glow effect on hover of interactive elements
  document.querySelectorAll('a, button, .project-card, .skill-badge').forEach(el => {
    const rect = el.getBoundingClientRect();
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;

    const distance = Math.sqrt(Math.pow(mouseX - elX, 2) + Math.pow(mouseY - elY, 2));

    if (distance < 100) {
      el.style.transform = `scale(${1 + (100 - distance) / 1000})`;
    } else {
      el.style.transform = 'scale(1)';
    }
  });
});

// ======================== CONSOLE MESSAGE ========================
console.log('%c Welcome to my Portfolio!', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
console.log('%c Built with HTML, CSS, and Vanilla JavaScript', 'font-size: 14px; color: #9d4edd;');
console.log('%c Let\\'s connect! 🚀', 'font-size: 14px; color: #00d4ff;');

