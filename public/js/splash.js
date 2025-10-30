// 入場スプラッシュの制御（メディア無し版）
// ※ ここでは intro-mode を外さない（最初のスクロールで外す設計）
(function () {
  const splash = document.getElementById('splash');
  const skip   = document.getElementById('skipBtn');

  // 入場中はスクロールをロック
  const root = document.documentElement;
  const prevOverflow = root.style.overflow;
  root.style.overflow = 'hidden';

  let ended = false;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = REDUCED ? 600 : 2600; // ms

  const timer = setTimeout(finish, DURATION);
  skip?.addEventListener('click', finish);

  function finish() {
    if (ended) return;
    ended = true;
    clearTimeout(timer);

    // スプラッシュをフェードアウト
    if (splash) {
      splash.classList.add('hide');
      splash.setAttribute('aria-hidden', 'true');
      setTimeout(() => splash.remove(), 720);
    }

    // スクロール解放（ただし intro-mode はそのまま）
    root.style.overflow = prevOverflow || '';
    // アクセシビリティ：Hero 先頭へフォーカス移動
    const top = document.getElementById('top');
    if (top) top.setAttribute('tabindex', '-1');
    top?.focus({ preventScroll: true });
  }
})();
