/**
 * PWA 注册和管理脚本
 * Service Worker 注册和更新提示
 * 作成者：曹 小帥（SOU）
 */

(function() {
  'use strict';

  // 检查浏览器是否支持 Service Worker
  if ('serviceWorker' in navigator) {
    // 注册 Service Worker
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('./sw.js', document.baseURI).href)
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);

          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 新版本已安装，提示用户刷新
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });

      // 监听 Service Worker 控制权变化
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          // 可选：自动刷新页面
          // window.location.reload();
        }
      });
    });
  }

  // 显示更新通知
  function showUpdateNotification() {
    // 创建更新提示（可选）
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(13, 15, 26, 0.95);
        color: #ffcc00;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 204, 0, 0.3);
      ">
        <span>新しいバージョンが利用可能です</span>
        <button id="pwa-update-btn" style="
          background: #ffcc00;
          color: #0D0F1A;
          border: none;
          padding: 6px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
        ">更新</button>
        <button id="pwa-dismiss-btn" style="
          background: transparent;
          color: #ffcc00;
          border: 1px solid rgba(255, 204, 0, 0.3);
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(updateBanner);

    // 更新按钮
    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      window.location.reload();
    });

    // 关闭按钮
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      updateBanner.remove();
    });

    // 5秒后自动隐藏
    setTimeout(() => {
      if (updateBanner.parentNode) {
        updateBanner.style.opacity = '0';
        updateBanner.style.transition = 'opacity 0.3s';
        setTimeout(() => updateBanner.remove(), 300);
      }
    }, 5000);
  }

})();

