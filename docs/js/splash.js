/* ===============================
   splash.js
   功能：
   1. 控制入場動畫的播放與結束
   2. 播放完後隱藏 Splash，但不解除 intro-mode
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  const skipBtn = document.getElementById("skipBtn");

  // 手动跳过按钮
  if (skipBtn) {
    skipBtn.addEventListener("click", hideSplash);
  }

  // 自動結束（動畫播放完後自動消失）
  setTimeout(hideSplash, 3800); // 約3.8秒後消失，可按需調整

  function hideSplash() {
    if (!splash || splash.classList.contains("hide")) return;
    splash.classList.add("hide");

    // 防止重複操作
    setTimeout(() => {
      splash.remove();
    }, 800); // 與 CSS 過渡一致
  }
});
