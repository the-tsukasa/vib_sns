// 年份
document.getElementById('year').textContent = new Date().getFullYear();

// 平滑滚动 + 当前菜单高亮
const links = document.querySelectorAll('.side-nav .nav-link');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));

links.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// 监听滚动：高亮当前区块
const highlight = () => {
  const y = window.scrollY + window.innerHeight * 0.35;
  let idx = 0;
  sections.forEach((sec, i) => {
    if (sec && sec.offsetTop <= y) idx = i;
  });
  links.forEach(l => l.classList.remove('active'));
  links[idx]?.classList.add('active');
};
window.addEventListener('scroll', highlight);
window.addEventListener('load', highlight);

// 进入视口淡入
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
  });
},{ threshold: 0.14 });
document.querySelectorAll('.observe').forEach(el=>io.observe(el));

// 移动端汉堡菜单
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
hamburger?.addEventListener('click', ()=> sidebar.classList.toggle('open'));
