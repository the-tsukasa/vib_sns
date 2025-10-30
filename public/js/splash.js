(function(){
  const splash = document.getElementById('splash');
  const video  = document.getElementById('introVideo');
  const skip   = document.getElementById('skipBtn');

  // スクロールを一時ロック
  const root = document.documentElement;
  const prevOverflow = root.style.overflow;
  root.style.overflow = 'hidden';

  let ended = false;
  const MAX_MS = 6500;                 // 動画が無い/再生不可でも確実に抜ける
  const timer = setTimeout(finish, MAX_MS);

  // 再生終了 or クリックで終了
  if (video){
    video.addEventListener('ended', finish);
    window.addEventListener('load', async () => {
      try { await video.play(); } catch(_) { /* autoplay 失敗でもタイマーで抜ける */ }
    });
  }
  if (skip) skip.addEventListener('click', finish);

  // Reduce motion → 即終了
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();

  function finish(){
    if (ended) return;
    ended = true;
    clearTimeout(timer);
    if (splash){
      splash.classList.add('hidden');
      setTimeout(()=> splash.remove(), 720);
    }
    root.style.overflow = prevOverflow || '';
  }
})();
