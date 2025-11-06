// ================================
// VIB 入場アニメーション（视频完后显示 LOGO）
// ================================

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const video = document.getElementById("splashVideo");
  const overlay = document.querySelector(".splash__overlay");

  if (!splash || !video || !overlay) return;

  // 当视频播放完毕时
  video.addEventListener("ended", () => {
    // 显示 LOGO 与文字
    overlay.classList.add("show");

    // 再等 2 秒后淡出整个入场画面
    setTimeout(() => {
      splash.classList.add("fade-out");
    }, 2000);
  });

  // 保险机制：如果视频无法播放，则直接显示并淡出
  setTimeout(() => {
    if (!overlay.classList.contains("show")) {
      overlay.classList.add("show");
      setTimeout(() => splash.classList.add("fade-out"), 2000);
    }
  }, 23000); // 视频最长时间 + 缓冲
});
