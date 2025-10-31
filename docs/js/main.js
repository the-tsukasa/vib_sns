/* =========================================================
   main.js（VIB｜サイト共通スクリプト）
   機能：
   1. Introモードの解除制御（Splash終了後・スクロール後）
   2. 各セクションのフェードイン制御（IntersectionObserver）
   3. ハンバーガーメニュー開閉（モバイル）
   4. コピーライトの自動年更新
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.querySelector(".sidebar");

  /* ========= ① Intro Mode解除 ========= */
  window.exitIntro = () => {
    // Splash未结束时，不执行任何操作
    if (document.getElementById("splash")) return;

    if (!body.classList.contains("intro-mode")) return;
    body.classList.remove("intro-mode");

    // サイドバー表示
    if (sidebar) {
      sidebar.style.opacity = 1;
      sidebar.style.transform = "none";
      sidebar.style.pointerEvents = "auto";
    }

    // 全セクション解放（CSSにより自然にフェードイン）
    document.querySelectorAll(".section").forEach(sec => {
      sec.style.opacity = 1;
      sec.style.pointerEvents = "auto";
      sec.style.maxHeight = "";
    });
  };

  /* ========= ② Splash終了イベントを監視 ========= */
  document.addEventListener("splashEnd", () => {
    setTimeout(window.exitIntro, 900);
  });

  /* ========= ③ IntersectionObserver：セクションのフェードイン ========= */
  const ioFade = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("on");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".observe").forEach(el => ioFade.observe(el));

  /* ========= ④ Hero スクロール検知 ========= */
  const hero = document.getElementById("top");
  if (hero) {
    const ioHero = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.4) window.exitIntro();
    }, { threshold: [0.4] });
    ioHero.observe(hero);

    let scrolled = false;
    window.addEventListener("scroll", () => {
      if (scrolled) return;
      if (window.scrollY > window.innerHeight * 0.15) {
        scrolled = true;
        window.exitIntro();
      }
    }, { passive: true });
  }

  /* ========= ⑤ ハンバーガーメニュー開閉 ========= */
  const hamburger = document.getElementById("hamburger");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // ナビリンククリック時に自動で閉じる（モバイルのみ）
    document.querySelectorAll(".side-nav .nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove("open");
        }
      });
    });
  }

  /* ========= ⑥ ロゴクリックでトップへ戻る ========= */
  const logoLink = document.querySelector(".brand__link");
  if (logoLink) {
    logoLink.addEventListener("click", e => {
      const isHome = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
      if (isHome) {
        e.preventDefault();
        const topSection = document.getElementById("top");
        if (topSection) topSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* ========= ⑦ 年度更新 ========= */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ========= ⑧ 現在のセクションに応じてナビリンクをハイライト ========= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".side-nav .nav-link");

  const ioNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 全てのリンクからactiveを除去
        navLinks.forEach(link => link.classList.remove("active"));

        // 対応するリンクをactiveに
        const id = entry.target.getAttribute("id");
        const current = document.querySelector(`.side-nav a[href="#${id}"]`);
        if (current) current.classList.add("active");
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => ioNav.observe(sec));
});
