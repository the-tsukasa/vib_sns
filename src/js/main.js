/* =========================================================
   ファイル名：main.js
   概要　　：VIB公式サイト 全体インタラクション制御
   作成者　：曹 小帥（SOU）
   最終更新：2025-11-02（安定版・統合済）
   ========================================================= */


/* =========================================================
   1. Sidebar（サイドバー開閉 + オーバーレイ制御）
   ========================================================= */
const sidebar = document.querySelector(".sidebar");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");

if (sidebar && hamburger && overlay) {
  // 初期状態設定（モバイルでは閉じる）
  if (window.innerWidth <= 900) {
    sidebar.classList.add("closed");
  }

  // ハンバーガーボタン押下
  hamburger.addEventListener("click", () => {
    const isClosed = sidebar.classList.contains("closed");
    sidebar.classList.toggle("closed", !isClosed);
    sidebar.classList.toggle("open", isClosed);
    overlay.classList.toggle("active", isClosed);
  });

  // オーバーレイ押下で閉じる
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebar.classList.add("closed");
    overlay.classList.remove("active");
  });

  // スマホでリンクを押したら自動で閉じる
  document.querySelectorAll(".side-nav .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove("open");
        sidebar.classList.add("closed");
        overlay.classList.remove("active");
      }
    });
  });

  // 画面サイズ変更時にリセット
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      sidebar.classList.remove("closed");
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    } else if (!sidebar.classList.contains("open")) {
      sidebar.classList.add("closed");
    }
  });
}


/* =========================================================
   2. 年号の自動更新
   ========================================================= */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* =========================================================
   3. スクロールアニメーション（セクションのフェードイン）
   ========================================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("on");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".observe").forEach(section => {
  observer.observe(section);
});

