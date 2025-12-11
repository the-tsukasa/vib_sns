/* =========================================================
   Welcome Test Version 1.0 JavaScript
   作成者：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

(function () {
  'use strict';

  // DOM要素
  const transitionOverlay = document.getElementById('transitionOverlay');
  const testContainer = document.getElementById('testContainer');

  // メインサイトへの遷移効果
  function enterMainSite() {
    // コンテナのフェードアウト効果を追加
    if (testContainer) {
      testContainer.classList.add('fade-out');
    }

    // トランジションマスクを表示
    if (transitionOverlay) {
      transitionOverlay.classList.add('active');
    }

    // 遷移を遅延させ、アニメーションを完了させる
    setTimeout(() => {
      window.location.href = './index.html';
    }, 1000);
  }

  // ページ読み込み完了後5秒で自動遷移
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      enterMainSite();
    }, 5000); // 5秒 = 5000ミリ秒
  });

})();

