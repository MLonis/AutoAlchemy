// main.js — Core site functionality

// -- Navigation Menu Toggle --
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const backdrop = document.querySelector('.menu-backdrop');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  backdrop.classList.toggle('show');
});

navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
    backdrop.classList.remove('show');
  })
);

document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && e.target !== menuToggle && !e.target.closest('.menu-backdrop')) {
    navLinks.classList.remove('show');
    backdrop.classList.remove('show');
  }
});

// -- Hero Section Scroll Animation --
const heroContent = document.querySelector('.hero-content');
let allowHero = false, lastY = 0, ticking = false;

setTimeout(() => (allowHero = true), 1200);

function onScroll() {
  if (!allowHero) return;
  lastY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      heroContent.style.transform = `translateY(${lastY * 0.1}px)`;
      heroContent.style.opacity = `${Math.max(0.8, 1 - lastY / 800)}`;
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll);

// -- Estimate Form Submission --
document.getElementById("estimate-form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    makeModel: form.makeModel.value,
    vehicleType: form.vehicleType.value,
    location: form.location.value,
    preferredDate: form.preferredDate.value,
    service: form.service.value,
    message: form.message.value
  };
  try {
    const res = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert("✅ Estimate sent successfully!");
      form.reset();
    } else throw new Error();
  } catch {
    alert("🚨 Something went wrong. Try again.");
  }
});

// -- ScrollReveal Animations --
const sr = ScrollReveal({
  distance: '20px',
  duration: 600,
  easing: 'ease-out',
  cleanup: true,
  viewOffset: {top: 50, bottom: 50}
});

sr.reveal('.hero-content', { origin: 'bottom', delay: 200 });
sr.reveal('.about h2, .about p', { origin: 'bottom', delay: 300 });

// -- Card Fade-In Observer --
const cards = document.querySelectorAll('.card');
const cardObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

cards.forEach(card => cardObserver.observe(card));

// -- Smooth Scroll for Anchor Links --
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// -- Back to Top Button --
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// -- Adjust Form Placeholders on Mobile --
const originalTexts = {};

function adjustPlaceholders() {
  const mappings = {
    service: "Service",
    vehicleType: "Vehicle",
    makeModel: "Year/Make/Model",
    condition: "Condition",
    petHair: "Pet Hair",
    mattePaint: "Matte?",
    name: "Full Name",
    phone: "Phone",
    email: "Email",
    city: "City",
    preferredDate: "Date",
    appointmentTime: "Time",
    message: "Notes"
  };

  for (const id in mappings) {
    const field = document.getElementById(id);
    if (field) {
      if (!originalTexts[id]) {
        if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
          originalTexts[id] = field.placeholder;
        } else if (field.tagName === "SELECT") {
          const firstOption = field.querySelector('option');
          if (firstOption) originalTexts[id] = firstOption.textContent;
        }
      }

      if (window.innerWidth <= 768) {
        if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
          field.placeholder = mappings[id];
        } else if (field.tagName === "SELECT") {
          const firstOption = field.querySelector('option');
          if (firstOption) firstOption.textContent = mappings[id];
        }
      } else {
        if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
          field.placeholder = originalTexts[id];
        } else if (field.tagName === "SELECT") {
          const firstOption = field.querySelector('option');
          if (firstOption) firstOption.textContent = originalTexts[id];
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', adjustPlaceholders);
window.addEventListener('resize', adjustPlaceholders);

// JavaScript: Fix for 100vh jump and input focus jumping on iOS
function setRealVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}
window.addEventListener('resize', setRealVh);
window.addEventListener('orientationchange', setRealVh);
document.addEventListener('DOMContentLoaded', setRealVh);

// Optional: Prevent input focus jump glitch in Safari
document.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('focus', () => {
    setTimeout(() => {
      window.scrollTo(window.pageXOffset, window.pageYOffset);
    }, 50);
  });
});

// === Flatpickr Initialization ===
flatpickr("#preferredDate", {
  dateFormat: "Y-m-d",
  disableMobile: true  // Force custom calendar even on mobile
});
