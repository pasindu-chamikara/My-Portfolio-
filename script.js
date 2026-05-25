// ==========================================
// 1. Canvas Constellation Background
// ==========================================
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
    initParticles();
  });

  const mouse = { x: null, y: null, active: false };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  class Particle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.active && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 140;
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 2.2;
          this.y += Math.sin(angle) * force * 2.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let particles = [];
  const maxParticles = Math.min(80, Math.floor((width * height) / 16000));

  function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateConstellation() {
    ctx.clearRect(0, 0, width, height);

    const computedStyles = getComputedStyle(document.documentElement);
    const accentColor = computedStyles.getPropertyValue("--accent").trim() || "#00f0ff";
    
    ctx.fillStyle = accentColor;
    ctx.strokeStyle = accentColor;

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    ctx.lineWidth = 0.55;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 110;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = accentColor.startsWith("#") 
            ? `${accentColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` 
            : `rgba(255, 215, 0, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateConstellation);
  }
  animateConstellation();
}

// ==========================================
// 2. Custom Cursor Trailing Effect
// ==========================================
const cursorDot = document.getElementById("custom-cursor-dot");
const cursorGlow = document.getElementById("custom-cursor-glow");
const cursorMouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

if (cursorDot && cursorGlow) {
  window.addEventListener("mousemove", (e) => {
    cursorMouse.targetX = e.clientX;
    cursorMouse.targetY = e.clientY;
    
    if (!cursorMouse.active) {
      cursorMouse.active = true;
      cursorDot.style.opacity = "1";
      cursorGlow.style.opacity = "1";
      cursorMouse.x = cursorMouse.targetX;
      cursorMouse.y = cursorMouse.targetY;
    }
  });

  document.addEventListener("mouseleave", () => {
    cursorMouse.active = false;
    cursorDot.style.opacity = "0";
    cursorGlow.style.opacity = "0";
  });

  // Attach hover state triggers for custom cursor
  function setupCursorListeners() {
    const interactives = document.querySelectorAll(
      "a, button, select, input, textarea, .btn, .social-icon, .bento-card, .project-item, #theme-toggle"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorDot.classList.add("hovering");
        cursorGlow.classList.add("hovering");
      });
      el.addEventListener("mouseleave", () => {
        cursorDot.classList.remove("hovering");
        cursorGlow.classList.remove("hovering");
      });
    });
  }
  setupCursorListeners();

  function updateCursor() {
    if (cursorMouse.active) {
      cursorMouse.x += (cursorMouse.targetX - cursorMouse.x) * 0.15;
      cursorMouse.y += (cursorMouse.targetY - cursorMouse.y) * 0.15;

      cursorDot.style.transform = `translate3d(${cursorMouse.targetX}px, ${cursorMouse.targetY}px, 0) translate(-50%, -50%)`;
      cursorGlow.style.transform = `translate3d(${cursorMouse.x}px, ${cursorMouse.y}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
}

// ==========================================
// 3. Bento & Project Cards 3D Tilt Effect
// ==========================================
const tiltElements = document.querySelectorAll(".bento-card, .project-item");
tiltElements.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Rotate max 8 degrees on hover for neat micro-rotation
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    card.classList.remove("reset-tilt");
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.classList.add("reset-tilt");
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
});

// ==========================================
// 4. Magnetic Button Effects
// ==========================================
const magneticBtns = document.querySelectorAll(".magnetic-btn");
magneticBtns.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  });
  
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate3d(0px, 0px, 0px)";
  });
});

// ==========================================
// 5. Scroll Progress, Active Nav Link Highlight, & Scroll Dynamics
// ==========================================
const scrollProgress = document.getElementById("scroll-progress");
const navLinksList = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("header, section");
const navbar = document.querySelector(".navbar");
const scrollDownWrapper = document.querySelector(".scroll-down-wrapper");
const profilePhoto = document.querySelector(".profile-photo");

// Smooth scroll handler for the scroll down button
if (scrollDownWrapper) {
  const scrollDownBtn = scrollDownWrapper.querySelector(".scroll-down-btn");
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = scrollDownBtn.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }
}

window.addEventListener("scroll", () => {
  const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
  
  // Update scroll bar progress
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + "%";
  }

  // Dynamic Navbar Styling
  if (navbar) {
    if (windowScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Fade out Scroll Down Indicator
  if (scrollDownWrapper) {
    if (windowScroll > 80) {
      scrollDownWrapper.classList.add("fade-out");
    } else {
      scrollDownWrapper.classList.remove("fade-out");
    }
  }

  // Profile Photo Parallax (Desktop Only)
  if (profilePhoto && window.innerWidth > 768) {
    if (windowScroll < window.innerHeight) {
      profilePhoto.style.transform = `translateY(${windowScroll * 0.15}px)`;
    }
  }

  // Section highlighting
  let currentSectionId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (windowScroll >= sectionTop - 200 && windowScroll < sectionTop + sectionHeight - 200) {
      currentSectionId = section.getAttribute("id");
    }
  });

  if (currentSectionId) {
    navLinksList.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }
});

// ==========================================
// 6. Scroll Reveal Animation using Intersection Observer
// ==========================================
const revealElements = document.querySelectorAll("[data-reveal]");
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute("data-delay")) || 0;
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -60px 0px"
    }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
}

// ==========================================
// 7. Live Clock for Colombo, Sri Lanka
// ==========================================
const clockElement = document.getElementById("local-clock");
if (clockElement) {
  function updateClock() {
    const options = {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat([], options);
    clockElement.textContent = formatter.format(new Date());
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ==========================================
// 8. Theme Toggle & Storage Persistence
// ==========================================
const toggleBtn = document.getElementById("theme-toggle");
const html = document.documentElement;

if (toggleBtn) {
  const storedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", storedTheme);
  updateToggleIcon(storedTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateToggleIcon(newTheme);
  });
}

function updateToggleIcon(theme) {
  if (theme === "light") {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// ==========================================
// 9. Cyber Text Scrambler Effect (Roles)
// ==========================================
class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30);
      this.queue.push({ from, to, start, end, char: "" });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = "";
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char" style="color: var(--accent); opacity: 0.85; font-weight: 700;">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const roles = [
  "I'm Building the Future",
  "I'm a Problem Solver",
  "I'm a Continuous Learner",
  "I'm Turning Ideas into Reality",
  "I'm a Web Developer"
];

const roleElement = document.getElementById("roleText");
if (roleElement) {
  const scrambler = new TextScrambler(roleElement);
  let roleIndex = 0;
  
  function cycle() {
    scrambler.setText(roles[roleIndex]).then(() => {
      setTimeout(cycle, 3500);
    });
    roleIndex = (roleIndex + 1) % roles.length;
  }
  
  cycle();
}

// ==========================================
// 10. Profile Emoji Rotation
// ==========================================
const emojiElement = document.getElementById("profile-emoji");
if (emojiElement) {
  const emojis = ['🚀', '💻', '💡', '🔥', '✨', '🎓', '🎨', '🧠'];
  let emojiIndex = 0;
  setInterval(() => {
    emojiIndex = (emojiIndex + 1) % emojis.length;
    emojiElement.style.opacity = '0';
    emojiElement.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      emojiElement.textContent = emojis[emojiIndex];
      emojiElement.style.opacity = '1';
    }, 300);
  }, 5000);
}

// ==========================================
// 11. Mobile Menu Toggling Logic
// ==========================================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const bodyElement = document.body;

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    bodyElement.classList.toggle("no-scroll", isOpen);
  });

  // Auto-close menu when clicking a link
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");
      bodyElement.classList.remove("no-scroll");
    });
  });
}