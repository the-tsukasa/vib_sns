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
const sidebarClose = document.getElementById("sidebarClose");

// サイドバーを閉じる共通関数
function closeSidebar() {
  sidebar.classList.remove("open");
  sidebar.classList.add("closed");
  overlay.classList.remove("active");
  hamburger.classList.remove("active");
}

// サイドバーを開く共通関数
function openSidebar() {
  sidebar.classList.remove("closed");
  sidebar.classList.add("open");
  overlay.classList.add("active");
  hamburger.classList.add("active");
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
   4. ナビゲーション自動ハイライト（スクロール連動）
   ========================================================= */
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

// スクロール時にアクティブなセクションを検出
function updateActiveNav() {
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // スクロール位置がセクションの上半分に達したらアクティブ
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  // ナビゲーションリンクのアクティブクラスを更新
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === current) {
      link.classList.add("active");
    }
  });
}

// スクロールイベントをスロットル処理（パフォーマンス最適化）
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    updateActiveNav();
  });
});

// 初期実行
updateActiveNav();

