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
  const bgParticles = document.querySelector('.bg-particles');

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

  // 创建过渡粒子效果（与 index.html splash 风格一致）
  function createTransitionParticles() {
    if (!transitionOverlay || !bgParticles) return;
    
    const PARTICLE_COUNT = 24;
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'transition-particles';
    transitionOverlay.appendChild(particlesContainer);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('span');
      particle.className = 'transition-particle';

      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = 6 + Math.random() * 18;
      const speed = 10 + Math.random() * 6;
      const delay = Math.random() * -8;
      const glowIntensity = 0.4 + Math.random() * 0.3;
      const haloIntensity = 0.45 + Math.random() * 0.25;

      particle.style.setProperty("--particle-core", `rgba(255, 240, 190, ${0.7 + Math.random() * 0.25})`);
      particle.style.setProperty("--particle-glow", `rgba(255, 204, 0, ${glowIntensity})`);
      particle.style.setProperty("--particle-halo", `rgba(255, 214, 51, ${haloIntensity})`);

      particle.style.setProperty("--top", `${top}%`);
      particle.style.setProperty("--left", `${left}%`);
      particle.style.setProperty("--size", `${size}px`);
      particle.style.setProperty("--speed", `${speed}s`);
      particle.style.setProperty("--delay", `${delay}s`);

      particlesContainer.appendChild(particle);
    }
  }

  // 进入主网站的动画和跳转（与 index.html splash 风格一致）
  function enterMainSite() {
    // 禁用按钮，防止重复点击
    enterBtn.disabled = true;
    enterBtn.style.pointerEvents = 'none';
    enterBtn.style.opacity = '0.7';

    // 创建过渡粒子
    createTransitionParticles();

    // 添加容器淡出效果（与 splash fade-out 一致）
    welcomeContainer.classList.add('fade-out');

    // 延迟显示过渡遮罩，让容器先淡出
    setTimeout(() => {
      transitionOverlay.classList.add('active');
    }, 300);

    // 延迟跳转，让动画完成（与 splash 的 1s 过渡时间一致）
    setTimeout(() => {
      window.location.href = './index.html';
    }, 1200);
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

