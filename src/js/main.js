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
   3. 返回顶部按钮
   ========================================================= */
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  // 滚动显示/隐藏按钮
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  // 点击返回顶部
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // 监听滚动事件（使用节流优化性能）
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初始检查
  toggleBackToTop();
}

/* =========================================================
   4. 导航栏当前页面高亮
   ========================================================= */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  // 获取当前滚动位置
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// 使用节流优化滚动事件
let navTicking = false;
window.addEventListener("scroll", () => {
  if (!navTicking) {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      navTicking = false;
    });
    navTicking = true;
  }
});

// 初始检查
updateActiveNav();

/* =========================================================
   5. IntersectionObserver によるスクロールアニメーション
   ========================================================= */
// アニメーション設定
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// アニメーションを無効化する設定を確認
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // 一度アニメーションが実行されたら監視を停止（パフォーマンス最適化）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // すべての .observe 要素を監視
  document.querySelectorAll('.observe').forEach(el => {
    observer.observe(el);
  });
} else {
  // アニメーションを無効化する場合は、すべての要素を即座に表示
  document.querySelectorAll('.observe').forEach(el => {
    el.classList.add('animate');
  });
}