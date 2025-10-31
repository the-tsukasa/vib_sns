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
  // ハンバーガーボタン押下
  hamburger.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("open");
    sidebar.classList.toggle("open", !isOpen);
    sidebar.classList.toggle("closed", isOpen);
    overlay.classList.toggle("active", !isOpen);
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
      sidebar.classList.add("open");
      overlay.classList.remove("active");
    } else {
      sidebar.classList.remove("open");
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


/* =========================================================
   4. スクロールトップボタン（オプション）
   ========================================================= */
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.remove("hide");
    } else {
      scrollTopBtn.classList.add("hide");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
