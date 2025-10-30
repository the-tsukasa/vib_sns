const splash = document.getElementById("splash");
const video = document.getElementById("introVideo");
const skip = document.getElementById("skipBtn");

function endSplash() {
  splash.classList.add("hidden");
  setTimeout(() => splash.remove(), 800);
}
video?.addEventListener("ended", endSplash);
skip?.addEventListener("click", endSplash);
setTimeout(endSplash, 6000);
