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
(function(){
  const body = document.body;
  const hero = document.getElementById('top');
  if (!hero) return;

  let exited = false;
  function exitIntro(){
    if (exited || !body.classList.contains('intro-mode')) return;
    exited = true;
    body.classList.remove('intro-mode');

    // 折り畳み解除（max-height を自然高さへ → その後クリア）
    const rest = document.querySelectorAll('.content > .section:not(#top)');
    rest.forEach(sec=>{
      sec.style.maxHeight = sec.scrollHeight + 'px';
      sec.style.opacity = '1';
      sec.style.pointerEvents = '';
      // 過渡終了後に inline を外して自然状態へ
      sec.addEventListener('transitionend', ()=>{
        sec.style.maxHeight = '';
      }, { once:true });
    });

    // サイドバーも可視化
    const sidebar = document.querySelector('.sidebar');
    if (sidebar){
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'none';
      sidebar.style.pointerEvents = '';
    }
  }

  // Hero の可視率が 40% 未満になったら解除
  const o = new IntersectionObserver((es)=>{
    const e = es[0];
    if (!e.isIntersecting || e.intersectionRatio < 0.4) exitIntro();
  }, { threshold: [0, .4, 1] });
  o.observe(hero);

  // 念のためのスクロール閾値（15%）でも解除
  let tried = false;
  addEventListener('scroll', ()=>{
    if (tried) return;
    if (window.scrollY > window.innerHeight * 0.15) {
      tried = true;
      exitIntro();
    }
  }, { passive: true });
})();
