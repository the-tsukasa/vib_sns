/* =========================================================
   Welcome Page JavaScript - 入口页面交互逻辑
   作成者：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

(function() {
  'use strict';

  // DOM 元素
  const enterBtn = document.getElementById('enterBtn');
  const transitionOverlay = document.getElementById('transitionOverlay');
  const welcomeContainer = document.getElementById('welcomeContainer');
  const phoneImage = document.getElementById('phoneImage');

  // 图片轮播（可选：让手机 mockup 显示不同的应用画面）
  const appImages = [
    './assets/images/demo/Group1.png',
    './assets/images/demo/Group2.png',
    './assets/images/demo/Group3.png',
    './assets/images/demo/Group4.png'
  ];

  let currentImageIndex = 0;

  // 图片轮播功能（每5秒切换一次）
  function rotatePhoneImage() {
    if (appImages.length <= 1) return;
    
    setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % appImages.length;
      phoneImage.style.opacity = '0';
      
      setTimeout(() => {
        phoneImage.src = appImages[currentImageIndex];
        phoneImage.style.opacity = '1';
      }, 300);
    }, 5000);
  }

  // 进入主网站的动画和跳转
  function enterMainSite() {
    // 禁用按钮，防止重复点击
    enterBtn.disabled = true;
    enterBtn.style.pointerEvents = 'none';
    enterBtn.style.opacity = '0.7';

    // 添加过渡动画
    transitionOverlay.classList.add('active');

    // 可选：添加容器淡出效果
    welcomeContainer.style.opacity = '0';
    welcomeContainer.style.transform = 'scale(0.95)';
    welcomeContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

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

  // 页面加载完成后启动图片轮播
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rotatePhoneImage);
  } else {
    rotatePhoneImage();
  }

  // 添加图片淡入淡出过渡
  if (phoneImage) {
    phoneImage.style.transition = 'opacity 0.3s ease';
  }

})();

