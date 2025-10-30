/* ===== 年份填充 ===== */
const yearEl = document.getElementById('year');
if (yearEl && !yearEl.textContent) yearEl.textContent = String(new Date().getFullYear());

/* ===== 侧栏导航平滑滚动 ===== */
const links = document.querySelectorAll('.side-nav .nav-link');
links.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    t?.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

/* ===== 当前区块高亮 ===== */
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
function highlight(){
  const y = window.scrollY + window.innerHeight * 0.35;
  let idx = 0; sections.forEach((sec,i)=>{ if(sec && sec.offsetTop <= y) idx = i; });
  links.forEach(l=>l.classList.remove('active')); links[idx]?.classList.add('active');
}
addEventListener('scroll', highlight); addEventListener('load', highlight);

/* ===== 视口淡入（.observe） ===== */
const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('on');
      io.unobserve(e.target);
    }
  });
},{ threshold:0.14 });
document.querySelectorAll('.observe').forEach(el=>io.observe(el));

/* ===== 移动端：侧栏开合 ===== */
document.getElementById('hamburger')?.addEventListener('click', ()=>{
  document.querySelector('.sidebar')?.classList.toggle('open');
});

/* ===== 重点：只有当 Hero 的“第一个模块”滑到最底部才解锁 ===== */
(function(){
  const body = document.body;
  const firstModEnd = document.getElementById('hero-mod-1-end');
  if (!firstModEnd) return;

  let exited = false;
  function exitIntro(){
    if (exited || !body.classList.contains('intro-mode')) return;
    exited = true;
    body.classList.remove('intro-mode');

    // 展开其它区块（从 0 高度过渡为自然高度）
    document.querySelectorAll('.content > .section:not(#top)').forEach(sec=>{
      sec.style.maxHeight = sec.scrollHeight + 'px';
      sec.style.opacity = '1';
      sec.style.pointerEvents = '';
      sec.addEventListener('transitionend', ()=>{ sec.style.maxHeight = ''; }, { once:true });
    });

    // 侧栏淡入
    const sidebar = document.querySelector('.sidebar');
    if (sidebar){
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'none';
      sidebar.style.pointerEvents = '';
    }

    // 清理兜底监听
    window.removeEventListener('scroll', checkBottom, { passive:true });
  }

  // 使用 IO：当 1px 哨兵“完全可见”时才解锁（阈值 = 1.0）
  const o = new IntersectionObserver((entries)=>{
    const e = entries[0];
    if (e.isIntersecting && e.intersectionRatio >= 1) exitIntro();
  }, { threshold: [1] });
  o.observe(firstModEnd);

  // 兜底（移动端地址栏伸缩可能影响 IO）：几何判断完全可见
  function checkBottom(){
    const rect = firstModEnd.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (fullyVisible) exitIntro();
  }
  window.addEventListener('scroll', checkBottom, { passive:true });
})();
