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
      column.style.setProperty("--delay", `${index * 0.35}s`);
      column.style.setProperty("--duration", `${6 + index * 0.4}s`);

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

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const overlay = document.querySelector(".splash__overlay");

  if (!splash || !overlay) return;

  const codeLines = ensureCodeRain(splash, overlay);

  const playCodeRain = () => {
    codeLines.forEach((line) => {
      line.style.animationPlayState = "running";
    });
  };

  // Play the code-rain animation on the next frame for smoother start.
  requestAnimationFrame(playCodeRain);

  setTimeout(() => {
    overlay.classList.add("show");
  }, 500);

  setTimeout(() => {
    splash.classList.add("fade-out");
  }, 3200);

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
  }, 6000);
});
