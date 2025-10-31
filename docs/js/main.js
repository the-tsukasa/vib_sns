
// ===== 退出 Intro 模式（用户滑过首屏一定阈值时） =====
(function(){
  const root = document.documentElement;
  const body = document.body;
  const hero = document.getElementById('top');
  if (!hero) return;

  // 使用 IntersectionObserver 更稳：当 Hero 还剩不到 60% 在屏内时退出 Intro
  const io = new IntersectionObserver((entries)=>{
    const e = entries[0];
    if (!e.isIntersecting || e.intersectionRatio < 0.4) {
      exitIntro();
    }
  }, { threshold: [0, .4, 1] });

  io.observe(hero);

  // 兜底：用户有任何滚动也尝试退出（避免某些设备 IO 触发不及时）
  let tried = false;
  window.addEventListener('scroll', ()=>{
    if (tried) return;
    if (window.scrollY > window.innerHeight * 0.15) {
      tried = true;
      exitIntro();
    }
  }, { passive: true });

  function exitIntro(){
    if (!body.classList.contains('intro-mode')) return;
    body.classList.remove('intro-mode');

    // 展开其它区块：把 max-height 复位到自然高度（触发过渡）
    document.querySelectorAll('.content > .section:not(#top)').forEach(sec=>{
      // 先测量真实高度
      sec.style.maxHeight = sec.scrollHeight + 'px';
      // 恢复内边距（与原 section 的 padding 一致）
      sec.style.paddingTop = '';
      sec.style.paddingBottom = '';
      // 过渡结束后清理内联样式
      sec.addEventListener('transitionend', ()=>{
        sec.style.maxHeight = '';
      }, { once:true });
      // 同时淡入
      sec.style.opacity = '1';
      sec.style.pointerEvents = '';
    });

    // 侧边栏淡入
    const sidebar = document.querySelector('.sidebar');
    if (sidebar){
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'none';
      sidebar.style.pointerEvents = '';
    }
  }
})();


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
