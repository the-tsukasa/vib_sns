// ===== サイドバー開閉 =====
const sidebar = document.querySelector('.sidebar');
const hamburger = document.getElementById('hamburger');

if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => {
    // 切換開閉
    sidebar.classList.toggle('closed');
    sidebar.classList.toggle('open');
  });

  // スマホ時に自動閉じる（リンクを押したら）
  document.querySelectorAll('.side-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
      }
    });
  });
}
