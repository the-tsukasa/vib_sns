// ================================
// VIB splash animation (code-generated intro)
// ================================

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const overlay = document.querySelector(".splash__overlay");
  const codeLines = document.querySelectorAll(".splash__code .code-line");

  if (!splash || !overlay) return;

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

  // Fallback: ensure the splash exits even if something stalls mid-way.
  setTimeout(() => {
    if (!splash.classList.contains("fade-out")) {
      splash.classList.add("fade-out");
    }
  }, 6000);
});
