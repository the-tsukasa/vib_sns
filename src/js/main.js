/* =========================================================
   ファイル名：main.js
   概要　　：VIB公式サイト 基本インタラクション制御（簡易版）
   作成者　：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

/* =========================================================
   1. Sidebar（サイドバー開閉 + オーバーレイ制御）
   ========================================================= */
const sidebar = document.querySelector(".sidebar");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");
const sidebarClose = document.getElementById("sidebarClose");

// サイドバーを閉じる共通関数
function closeSidebar() {
  if (sidebar) sidebar.classList.remove("open");
  if (sidebar) sidebar.classList.add("closed");
  if (overlay) overlay.classList.remove("active");
  if (hamburger) hamburger.classList.remove("active");
}

// サイドバーを開く共通関数
function openSidebar() {
  if (sidebar) sidebar.classList.remove("closed");
  if (sidebar) sidebar.classList.add("open");
  if (overlay) overlay.classList.add("active");
  if (hamburger) hamburger.classList.add("active");
}

if (sidebar && hamburger && overlay) {
  // 初期状態設定（モバイルでは閉じる）
  if (window.innerWidth <= 900) {
    sidebar.classList.add("closed");
  }

  // ハンバーガーボタン押下
  hamburger.addEventListener("click", () => {
    const isClosed = sidebar.classList.contains("closed");
    if (isClosed) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  // サイドバー閉じるボタン押下
  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  // オーバーレイ押下で閉じる
  overlay.addEventListener("click", closeSidebar);

  // スマホでリンクを押したら自動で閉じる
  document.querySelectorAll(".side-nav .nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  // 画面サイズ変更時にリセット
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      sidebar.classList.remove("closed");
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      hamburger.classList.remove("active");
    } else if (!sidebar.classList.contains("open")) {
      sidebar.classList.add("closed");
      hamburger.classList.remove("active");
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
