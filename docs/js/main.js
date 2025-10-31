/* ===============================
   main.js
   功能：
   1. 控制 intro-mode 解锁时机
   2. 负责 section 淡入 (IntersectionObserver)
   3. 移动端汉堡菜单逻辑
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.querySelector(".sidebar");
  const splash = document.getElementById("splash");
  const heroEnd = document.getElementById("hero-mod-1-end");

  /* ========= ① 淡入动画 (IO触发) ========= */
  const observerFade = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("on");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".observe").forEach(el => observerFade.observe(el));

  /* ========= ② Hero解锁逻辑 ========= */
  if (heroEnd) {
    const unlockObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 1) {
        exitIntro();
      }
    }, { threshold: [1] });
    unlockObserver.observe(heroEnd);

    // 兜底：防止浏览器地址栏收起造成IO不触发
    const checkScroll = () => {
      const rect = heroEnd.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight) exitIntro();
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
  }

  /* ========= ③ 退出 Intro Mode ========= */
  function exitIntro() {
    if (!body.classList.contains("intro-mode")) return;
    body.classList.remove("intro-mode");

    // 淡入 sidebar
    sidebar.style.opacity = 1;
    sidebar.style.transform = "none";

    // 给内容区恢复动画
    setTimeout(() => {
      document.querySelectorAll(".section").forEach(sec => {
        sec.style.opacity = 1;
        sec.style.pointerEvents = "auto";
        sec.style.maxHeight = "";
      });
    }, 100);
  }

  /* ========= ④ 移动端汉堡菜单 ========= */
  const hamburger = document.getElementById("hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  /* ========= ⑤ 年份自动更新 ========= */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
