/* =========================================================
   splash.js（VIB｜入場アニメーション）
   機能：
   1. Splashアニメーションの自動再生とSkip対応
   2. アニメーション終了後に splashEnd イベントを発火
   3. intro-mode は main.js 側で解除される
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  const skipBtn = document.getElementById("skipBtn");

  // ===== Skipボタンで即スキップ =====
  if (skipBtn) skipBtn.addEventListener("click", hideSplash);

  // ===== 自動で消える（約3.8秒後）=====
  setTimeout(hideSplash, 3800);

  function hideSplash() {
    if (!splash || splash.dataset.hidden === "true") return;
    splash.dataset.hidden = "true";
    splash.classList.add("hide");

    // 遅延後に要素削除＆イベント送信
    setTimeout(() => {
      splash.remove();
      document.dispatchEvent(new Event("splashEnd")); // ✅ 通知メインJS
    }, 800); // CSS transition と合わせる
  }
});
