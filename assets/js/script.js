const root = document.documentElement;

const navbar = document.querySelector(".glass-nav");
const navLinks = document.querySelectorAll(".nav-link");
const navSections = document.querySelectorAll("section[id]");
const heroSection = document.querySelector(".hero-section");
const sections = document.querySelectorAll(".section, .section-muted");
const skillsSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".progress-bar");
const themeToggle = document.getElementById("themeToggle");
const topBtn = document.getElementById("topBtn");
const errorContent = document.querySelector(".error-content");

const savedTheme = localStorage.getItem("theme");

let scrollingToTop = false;

if (savedTheme) {
  root.setAttribute("data-bs-theme", savedTheme);
}

function updateThemeIcon() {
  if (!themeToggle) return;

  themeToggle.innerHTML =
    root.getAttribute("data-bs-theme") === "dark"
      ? '<i class="bi bi-moon-stars-fill"></i>'
      : '<i class="bi bi-sun-fill"></i>';
}

updateThemeIcon();

// Theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);

    updateThemeIcon();
  });
}

// Navigation
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("nav");

    if (nav && nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });
});

function updateActiveNav() {
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

// Btn top
if (topBtn && skillsSection) {
  const topBtnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (scrollingToTop) {
        return;
      }

      if (entry.isIntersecting) {
        topBtn.classList.add("show");
      } else if (window.scrollY < skillsSection.offsetTop) {
        topBtn.classList.remove("show");
      }
    });
  }, {
    threshold: 0.3
  });

  topBtnObserver.observe(skillsSection);

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
    }, 100);
  });
}

// Hero section
if (heroSection) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      heroSection.classList.add("show");
    }, 50);
  });
}

// Fade in
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

// Progressbar animation
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
  window.addEventListener("load", () => {
    setTimeout(() => {
      errorContent.classList.add("show");
    }, 100);
  });
}
