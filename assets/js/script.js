
const root = document.documentElement;
const navbar = document.querySelector(".glass-nav");
const navLinks = document.querySelectorAll(".nav-link");
const navSections = document.querySelectorAll("section[id]");
const heroSection = document.querySelector(".hero-section");
const heroTitle = document.querySelector(".hero-section h1");
const sections = document.querySelectorAll(".section, .section-muted");
const skillsSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".progress-bar");
const themeToggle = document.getElementById("themeToggle");
const languageToggle = document.getElementById("languageToggle");
const topBtn = document.getElementById("topBtn");
const errorContent = document.querySelector(".error-content");
const savedTheme = localStorage.getItem("theme");

let scrollingToTop = false;
let currentLanguage = localStorage.getItem("language") || "en";

// Theme
if (savedTheme) {
  root.setAttribute("data-bs-theme", savedTheme);
}

function updateThemeIcon() {
  if (!themeToggle) return;

  themeToggle.innerHTML =
    root.getAttribute("data-bs-theme") === "dark"
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-stars-fill"></i>';
}

updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon();
  });
}

// Language
function updateLanguageButton() {
  if (!languageToggle) return;

  languageToggle.textContent = currentLanguage === "en" ? "ID" : "EN";
}

async function loadTranslations(language) {
  try {
    const response = await fetch(`/assets/translations/${language}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load ${language}.json`);
    }

    const translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;

      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    document.documentElement.lang = language;

    localStorage.setItem("language", language);
    currentLanguage = language;

    updateLanguageButton();
  } catch (error) {
    console.error("Translation error:", error);
  }
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const nextLanguage = currentLanguage === "en" ? "id" : "en";

    loadTranslations(nextLanguage);
  });
}

updateLanguageButton();
loadTranslations(currentLanguage);

// Navigation
function closeNavbar() {
  const nav = document.getElementById("nav");

  if (nav && nav.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }
}

window.addEventListener("scroll", () => {
  closeNavbar();
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    closeNavbar();
  });
});

// Active Navigation
function updateActiveNav() {
  if (!navbar || !navLinks.length || !navSections.length) return;

  const scrollPosition = window.scrollY + 150;
  const pageBottom = window.innerHeight + window.scrollY;
  const documentBottom = document.documentElement.scrollHeight;

  let currentSection = "";

  if (pageBottom >= documentBottom - 10) {
    currentSection = navSections[navSections.length - 1].id;
  } else {
    navSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionBottom
      ) {
        currentSection = section.id;
      }
    });
  }

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentSection}`
    );
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// Back to Top
if (topBtn && skillsSection) {
  function updateTopButton() {
    if (scrollingToTop) {
      return;
    }

    if (window.scrollY >= skillsSection.offsetTop) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateTopButton);
  window.addEventListener("load", updateTopButton);

  topBtn.addEventListener("click", () => {
    scrollingToTop = true;
    topBtn.classList.remove("show");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", () => {
    if (scrollingToTop && window.scrollY <= 0) {
      scrollingToTop = false;
    }
  });
}

// Navbar
if (navbar) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      navbar.classList.add("show");
    }, 120);
  });
}

// Hero Section
if (heroSection) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      heroSection.classList.add("show");
    }, 50);
  });
}

if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = "";

  [...text].forEach((char, index) => {
    const span = document.createElement("span");

    span.textContent = char === " " ? "\u00A0" : char;
    span.style.animationDelay = `${index * 0.1}s`;

    heroTitle.appendChild(span);
  });
}

// Fade In
if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// Progress Bar Animation
if (skillBars.length) {
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.dataset.progress;

        bar.style.width = `${progress}%`;
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.3
  });

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });
}

// 404
if (errorContent) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      errorContent.classList.add("show");
    });
  });
}
