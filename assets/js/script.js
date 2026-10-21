
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


/* =========================================================
   Music Player
   ========================================================= */

const musicTrigger = document.getElementById("musicTrigger");
const musicOverlay = document.getElementById("musicOverlay");
const musicAudio = document.getElementById("musicAudio");

// Music Playlist
const musicPlaylist = [
  {
    title: "Paradise City",
    artist: "Guns N' Roses",
    src: "/assets/audio/downsampled 06. Paradise City_converted.mp3",
    cover: "/assets/images/uost3qdlw3jlb_600.jpg",
    lrc: "/assets/audio/paradise.lrc"
  },
];

if (musicTrigger && musicOverlay && musicAudio) {
  const panel = musicOverlay.querySelector(".music-panel");
  const playButton = document.getElementById("musicPlay");
  const previousButton = document.getElementById("musicPrevious");
  const nextButton = document.getElementById("musicNext");
  const closeButton = document.getElementById("musicClose");

  let trackIndex = 0;
  let lastFocus = null;

  /* =========================================================
     Music Progress Bar
     ========================================================= */

  const musicSeek = document.getElementById("musicSeek");
  const musicCurrentTime = document.getElementById("musicCurrentTime");
  const musicDuration = document.getElementById("musicDuration");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  function updateSeekProgress(value) {
    musicSeek.style.setProperty("--seek-progress", `${value}%`);
  }

  musicAudio.addEventListener("loadedmetadata", () => {
    musicDuration.textContent = formatTime(musicAudio.duration);
  });

  musicAudio.addEventListener("timeupdate", () => {
    const current = musicAudio.currentTime;
    const duration = musicAudio.duration;

    musicCurrentTime.textContent = formatTime(current);

    if (Number.isFinite(duration) && duration > 0) {
      const progress = (current / duration) * 100;

      musicSeek.value = progress;
      updateSeekProgress(progress);
    }
  });

  musicSeek.addEventListener("input", () => {
    const duration = musicAudio.duration;

    if (!Number.isFinite(duration) || duration <= 0) return;

    const progress = Number(musicSeek.value);

    musicAudio.currentTime = (progress / 100) * duration;

    musicCurrentTime.textContent = formatTime(musicAudio.currentTime);
    updateSeekProgress(progress);
  });

  musicAudio.addEventListener("emptied", () => {
    musicSeek.value = 0;
    musicCurrentTime.textContent = "0:00";
    musicDuration.textContent = "0:00";

    updateSeekProgress(0);
  });


  /* =========================================================
     Interactive Cover / Synced Lyrics
     ========================================================= */

  const musicDisplay = document.getElementById("musicDisplay");
  const musicDisplayLyrics = document.getElementById("musicDisplayLyrics");
  const lyricsContent = document.getElementById("musicLyricsContent");

  let lyrics = [];
  let activeLyricIndex = -1;
  let lyricsRequestId = 0;

  function parseLRC(content) {
    const result = [];

    const offsetMatch = content.match(/\[offset:([+-]?\d+)\]/i);
    const offset = offsetMatch ? Number(offsetMatch[1]) / 1000 : 0;

    content.split(/\r?\n/).forEach(line => {
      const timestamps = [
        ...line.matchAll(/\[(\d+):(\d{2})(?:[.:](\d{1,3}))?\]/g)
      ];

      if (!timestamps.length) return;

      const text = line
        .replace(/\[\d+:\d{2}(?:[.:]\d{1,3})?\]/g, "")
        .trim();

      timestamps.forEach(match => {
        const minutes = Number(match[1]);
        const seconds = Number(match[2]);

        const fraction = match[3]
          ? Number(match[3].padEnd(3, "0")) / 1000
          : 0;

        result.push({
          time: Math.max(0, minutes * 60 + seconds + fraction + offset),
          text
        });
      });
    });

    return result.sort((a, b) => a.time - b.time);
  }

  function resetLyrics() {
    lyrics = [];
    activeLyricIndex = -1;

    musicDisplay.classList.remove("show-lyrics");
    musicDisplay.setAttribute("aria-pressed", "false");
    musicDisplay.setAttribute("aria-label", "Show lyrics");

    lyricsContent.replaceChildren();
    musicDisplayLyrics.scrollTop = 0;
  }

  async function loadLyrics(track) {
    const requestId = ++lyricsRequestId;

    resetLyrics();

    if (!track.lrc) return;

    try {
      const response = await fetch(track.lrc);

      if (!response.ok) return;

      const content = await response.text();
      const parsed = parseLRC(content);

      if (requestId !== lyricsRequestId) return;
      if (!parsed.length) return;

      lyrics = parsed;

      const fragment = document.createDocumentFragment();

      lyrics.forEach(line => {
        const element = document.createElement("p");

        element.className = "lyric-line";
        element.textContent = line.text || "\u00A0";

        fragment.appendChild(element);
      });

      lyricsContent.appendChild(fragment);

      syncLyrics();

    } catch (error) {
      if (requestId === lyricsRequestId) resetLyrics();
    }
  }

  function syncLyrics() {
    if (!lyrics.length) return;

    const currentTime = musicAudio.currentTime;
    let index = -1;

    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }

    if (index === activeLyricIndex) return;

    activeLyricIndex = index;

    const lines = lyricsContent.querySelectorAll(".lyric-line");

    lines.forEach((line, i) => {
      line.classList.toggle("active", i === index);
    });

    if (index >= 0 && musicDisplay.classList.contains("show-lyrics")) {
      const activeLine = lines[index];

      musicDisplayLyrics.scrollTo({
        top: activeLine.offsetTop
          - lyricsContent.offsetTop
          - musicDisplayLyrics.clientHeight / 2
          + activeLine.clientHeight / 2,
        behavior: "smooth"
      });
    }
  }

  function toggleLyrics() {
    if (!lyrics.length) return;

    const visible = musicDisplay.classList.toggle("show-lyrics");

    musicDisplay.setAttribute("aria-pressed", String(visible));
    musicDisplay.setAttribute(
      "aria-label",
      visible ? "Show album artwork" : "Show lyrics"
    );

    if (visible) {
      activeLyricIndex = -1;
      syncLyrics();
    }
  }

  musicDisplay.addEventListener("click", toggleLyrics);

  musicDisplay.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLyrics();
    }
  });

  musicAudio.addEventListener("timeupdate", syncLyrics);
  musicAudio.addEventListener("seeked", syncLyrics);


  /* =========================================================
     Playback Controls
     ========================================================= */

  function updatePlayIcon() {
    const playing = !musicAudio.paused;

    playButton.innerHTML = playing
      ? '<i class="bi bi-pause-fill"></i>'
      : '<i class="bi bi-play-fill"></i>';

    playButton.setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function loadTrack(index) {
    if (!musicPlaylist.length) return;

    trackIndex = (index + musicPlaylist.length) % musicPlaylist.length;

    const track = musicPlaylist[trackIndex];

    musicAudio.src = track.src;

    document.getElementById("musicPlayerTitle").textContent = track.title;
    document.getElementById("musicArtist").textContent = track.artist;
    document.getElementById("musicCover").src = track.cover;

    panel.style.setProperty(
      "--music-bg",
      `url("${new URL(track.cover, document.baseURI).href}")`
    );

    loadLyrics(track);
    updatePlayIcon();
  }

  async function playTrack() {
    if (!musicPlaylist.length) return;

    try {
      await musicAudio.play();
    } catch (error) {
      console.warn("Audio playback failed. Check your audio file path:", error);
    }

    updatePlayIcon();
  }

  function changeTrack(step) {
    const wasPlaying = !musicAudio.paused;

    loadTrack(trackIndex + step);

    if (wasPlaying) playTrack();
  }

  function closePlayer() {
    musicOverlay.classList.remove("open");
    musicOverlay.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    musicAudio.pause();
    updatePlayIcon();

    if (lastFocus) lastFocus.focus();
  }

  musicTrigger.addEventListener("click", () => {
    lastFocus = document.activeElement;

    musicOverlay.classList.add("open");
    musicOverlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    panel.focus();
  });

  closeButton.addEventListener("click", closePlayer);

  musicOverlay
    .querySelector("[data-close-player]")
    .addEventListener("click", closePlayer);

  document.addEventListener("keydown", event => {
    if (!musicOverlay.classList.contains("open")) return;

    if (event.key === "Escape") {
      closePlayer();
    }

    if (event.key === "Tab") {
      const controls = [
        closeButton,
        musicDisplay,
        musicSeek,
        previousButton,
        playButton,
        nextButton
      ];

      const index = controls.indexOf(document.activeElement);

      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        nextButton.focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });

  playButton.addEventListener("click", () => {
    if (musicAudio.paused) {
      playTrack();
    } else {
      musicAudio.pause();
    }
  });

  previousButton.addEventListener("click", () => changeTrack(-1));
  nextButton.addEventListener("click", () => changeTrack(1));

  musicAudio.addEventListener("play", updatePlayIcon);
  musicAudio.addEventListener("pause", updatePlayIcon);

  musicAudio.addEventListener("ended", () => {
    loadTrack(trackIndex + 1);
    playTrack();
  });

  loadTrack(0);
}

musicDisplay.addEventListener("contextmenu", event => {
  event.preventDefault();
});

musicDisplay.addEventListener("dragstart", event => {
  event.preventDefault();
});


// 404
if (errorContent) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      errorContent.classList.add("show");
    }, 100);
  });
}
