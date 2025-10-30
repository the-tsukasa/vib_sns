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
