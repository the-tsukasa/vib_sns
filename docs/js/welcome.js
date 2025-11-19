/* =========================================================
   Welcome Page JavaScript - 入口页面交互逻辑（简化版）
   作成者：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

(function() {
  'use strict';

  // DOM 元素
  const enterBtn = document.getElementById('enterBtn');
  const transitionOverlay = document.getElementById('transitionOverlay');
  const welcomeContainer = document.getElementById('welcomeContainer');

  // 进入主网站的简单转换效果
  function enterMainSite() {
    // 禁用按钮，防止重复点击
    if (enterBtn) {
      enterBtn.disabled = true;
      enterBtn.style.pointerEvents = 'none';
    }

    // 添加容器淡出效果
    if (welcomeContainer) {
      welcomeContainer.classList.add('fade-out');
    }

    // 显示过渡遮罩
    if (transitionOverlay) {
      transitionOverlay.classList.add('active');
    }

    // 延迟跳转，让动画完成
    setTimeout(() => {
      window.location.href = './index.html';
    }, 800);
  }

  // 事件监听
  if (enterBtn) {
    enterBtn.addEventListener('click', enterMainSite);
    
    // 键盘支持（Enter 键）
    enterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterMainSite();
      }
    });
  }

})();
