// ================================
// VIB splash animation (code-generated intro)
// ================================

const CODE_STREAMS = [
  ["const vib = {", "  empathy: true,", "  privacy: 'local'", "};"],
  ["function resonate(heart) {", "  return heart.map(wave);", "}"],
  ["AI.sync(emotion).then((pulse) =>", "  console.log(pulse)", ");"],
  ["for (const link of network)", "  connect(link, 'safety');"],
  ["signal.on('meet', vibe =>", "  share(vibe.experience)", ");"],
  ["export default createBond(empathy);"]
];

const PARTICLE_COUNT = 36;

const ensureOverlay = (splash) => {
  let overlay = splash.querySelector(".splash__overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "splash__overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-label", "VIB イントロダクション");

    const logo = document.createElement("img");
    logo.src = "./assets/icons/logo.png";
    logo.alt = "VIB ロゴ";
    logo.className = "splash__logo";

    const title = document.createElement("p");
    title.className = "splash__title";
    title.textContent = "VIB";

    const tagline = document.createElement("p");
    tagline.className = "splash__tagline";
    tagline.textContent = "共感でつながる未来へ";

    overlay.append(logo, title, tagline);
    splash.appendChild(overlay);
  } else {
    if (!overlay.hasAttribute("role")) {
      overlay.setAttribute("role", "dialog");
    }
    if (!overlay.hasAttribute("aria-live")) {
      overlay.setAttribute("aria-live", "polite");
    }
  }

  return overlay;
};

const ensureCodeRain = (splash, overlay) => {
  let codeContainer = document.querySelector(".splash__code");

  if (!codeContainer) {
    codeContainer = document.createElement("div");
    codeContainer.className = "splash__code";
    splash.insertBefore(codeContainer, overlay);
  }

  if (!codeContainer.children.length) {
    CODE_STREAMS.forEach((stream, index) => {
      const column = document.createElement("div");
      column.className = "code-line";
      column.style.setProperty("--delay", `${index * 0.45}s`);
      column.style.setProperty("--duration", `${8 + index * 0.6}s`);

      stream.forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        column.appendChild(span);
      });

      codeContainer.appendChild(column);
    });
  }

  return codeContainer.querySelectorAll(".code-line");
};

const ensureParticleField = (splash, overlay) => {
  let particleContainer = document.querySelector(".splash__particles");

  if (!particleContainer) {
    particleContainer = document.createElement("div");
    particleContainer.className = "splash__particles";
    splash.insertBefore(particleContainer, overlay);
  }

  if (!particleContainer.children.length) {
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const particle = document.createElement("span");
      particle.className = "splash__particle";

      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = 6 + Math.random() * 18;
      const speed = 10 + Math.random() * 6;
      const delay = Math.random() * -8;
      const glowIntensity = 0.4 + Math.random() * 0.3;
      const haloIntensity = 0.45 + Math.random() * 0.25;

      particle.style.setProperty("--particle-core", `rgba(255, 240, 190, ${0.7 + Math.random() * 0.25})`);
      particle.style.setProperty("--particle-glow", `rgba(255, 204, 0, ${glowIntensity})`);
      particle.style.setProperty("--particle-halo", `rgba(255, 214, 51, ${haloIntensity})`);

      particle.style.setProperty("--top", `${top}%`);
      particle.style.setProperty("--left", `${left}%`);
      particle.style.setProperty("--size", `${size}px`);
      particle.style.setProperty("--speed", `${speed}s`);
      particle.style.setProperty("--delay", `${delay}s`);

      particleContainer.appendChild(particle);
    }
  }

  return particleContainer.querySelectorAll(".splash__particle");
};

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const overlay = ensureOverlay(splash);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!overlay) return;

  if (!prefersReducedMotion) {
    ensureParticleField(splash, overlay);
  }

  const codeLines = ensureCodeRain(splash, overlay);

  const playCodeRain = () => {
    codeLines.forEach((line) => {
      line.style.animationPlayState = "running";
    });
  };

  // Play the code-rain animation on the next frame for smoother start.
  if (!prefersReducedMotion) {
    requestAnimationFrame(playCodeRain);
  }

  setTimeout(() => {
    overlay.classList.add("show");
  }, 650);

  setTimeout(() => {
    splash.classList.add("fade-out");
  }, 6800);

  splash.addEventListener("transitionend", (event) => {
    if (event.propertyName === "opacity" && splash.classList.contains("fade-out")) {
      splash.remove();
    }
  });

  // Fallback: ensure the splash exits even if something stalls mid-way.
  setTimeout(() => {
    if (!splash.classList.contains("fade-out")) {
      splash.classList.add("fade-out");
    }
  }, 9000);
});
