/* =========================================================
   Welcome Page JavaScript - 入口页面交互逻辑
   作成者：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

(function() {
  'use strict';

  // DOM 元素
  const transitionOverlay = document.getElementById('transitionOverlay');
  const welcomeContainer = document.getElementById('welcomeContainer');
  const logoWrapper = document.querySelector('.logo-wrapper');
  const brandName = document.querySelector('.brand-name');

  // 进入主网站的转换效果
  function enterMainSite() {
    // 添加容器淡出效果
    if (welcomeContainer) {
      welcomeContainer.classList.add('fade-out');
    }

    // Logo 和品牌名淡出动画
    if (logoWrapper) {
      logoWrapper.style.animation = 'logoFadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }

    // 显示过渡遮罩
    if (transitionOverlay) {
      transitionOverlay.classList.add('active');
    }

    // 延迟跳转，让动画完成
    setTimeout(() => {
      window.location.href = './index.html';
    }, 1000);
  }

  // 页面加载后5秒自动跳转
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      enterMainSite();
    }, 5000); // 5秒 = 5000毫秒
  });

})();
