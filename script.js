// Typewriter Effect
const texts = [
  "Backend Engineer", 
  "Cyber Security Student", 
  "Laravel & Docker Expert",
  "DevOps Enthusiast"
];

let count = 0;
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

function type() {
  if (count === texts.length) {
    count = 0;
  }
  currentText = texts[count];

  if (isDeleting) {
    letter = currentText.slice(0, --index);
  } else {
    letter = currentText.slice(0, ++index);
  }

  document.getElementById('typewriter').textContent = letter;

  let typeSpeed = 100;

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

  setTimeout(type, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', type);

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

