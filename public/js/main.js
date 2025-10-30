// 年号
document.getElementById('year')?.append(new Date().getFullYear());

// 平滑スクロール
const links = document.querySelectorAll('.side-nav .nav-link');
links.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    t?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// 現在セクションのハイライト
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
function highlight(){
  const y = window.scrollY + window.innerHeight * 0.35;
  let idx = 0;
  sections.forEach((sec,i)=>{ if(sec && sec.offsetTop <= y) idx = i; });
  links.forEach(l=>l.classList.remove('active'));
  links[idx]?.classList.add('active');
}
addEventListener('scroll', highlight);
addEventListener('load', highlight);

// 交差監視でフェードイン（.observe に .on を付与）
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
  });
},{ threshold: 0.14 });
document.querySelectorAll('.observe').forEach(el=>io.observe(el));

// モバイル：ハンバーガーでサイド開閉
document.getElementById('hamburger')?.addEventListener('click', ()=>{
  document.querySelector('.sidebar')?.classList.toggle('open');
});

/* ===== ここがキモ：スクロールで Intro モードを解除 ===== */
// ===== 只有当 Hero 的【第一个模块】滑到底才退出 Intro =====
(function(){
  const body = document.body;
  const firstModEnd = document.getElementById('hero-mod-1-end');
  if (!firstModEnd) return;

  let exited = false;
  function exitIntro(){
    if (exited || !body.classList.contains('intro-mode')) return;
    exited = true;
    body.classList.remove('intro-mode');

    // 展开其它区块
    document.querySelectorAll('.content > .section:not(#top)').forEach(sec=>{
      sec.style.maxHeight = sec.scrollHeight + 'px';
      sec.style.opacity = '1';
      sec.style.pointerEvents = '';
      sec.addEventListener('transitionend', ()=>{ sec.style.maxHeight = ''; }, { once:true });
    });

    // 侧边栏淡入
    const sidebar = document.querySelector('.sidebar');
    if (sidebar){
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'none';
      sidebar.style.pointerEvents = '';
    }
  }

  // 哨兵进入视口（几乎完全可见）就解锁
  const o = new IntersectionObserver((entries)=>{
    const e = entries[0];
    if (e.isIntersecting && e.intersectionRatio >= 0.98) exitIntro();
  }, { threshold: [0.98] });
  o.observe(firstModEnd);

  // 兜底：以“滚动到底”的几何判断再确认一次（解决某些移动端地址栏收缩导致的 IO 抖动）
  function checkAtBottom(){
    const rect = firstModEnd.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      exitIntro();
    }
  }
  window.addEventListener('scroll', checkAtBottom, { passive:true });
})();
