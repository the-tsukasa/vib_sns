/**
 * Service Worker for Vib SNS
 * PWA 支持 - 离线缓存和资源管理
 * 作成者：曹 小帥（SOU）
 */

const CACHE_NAME = 'vib-sns-v1.0.0';
const RUNTIME_CACHE = 'vib-sns-runtime-v1.0.0';

// 需要缓存的资源列表
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/welcome.html',
  '/css/main.css',
  '/css/sections/welcome.css',
  '/js/main.js',
  '/js/welcome.js',
  '/assets/icons/logo.png',
  '/assets/icons/favicon-64.png',
  '/assets/icons/favicon.png',
  '/assets/icons/favicon.ico'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching static assets');
        // 只缓存关键资源，其他资源使用运行时缓存
        return cache.addAll(PRECACHE_URLS).catch(err => {
          console.warn('[Service Worker] Some precache files failed:', err);
          // 即使部分文件失败，也继续安装
        });
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting();
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 删除旧版本的缓存
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 跳过跨域请求（除非是 same-origin）
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 如果缓存中有，直接返回
        if (cachedResponse) {
          return cachedResponse;
        }

        // 否则从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应（因为响应流只能使用一次）
            const responseToCache = response.clone();

            // 将响应添加到运行时缓存
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                // 只缓存同源资源
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // 如果是导航请求（页面），返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html') || 
                     caches.match('/') ||
                     new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            }
            
            // 其他请求返回错误
            return new Response('Network error', { 
              status: 408, 
              statusText: 'Request Timeout' 
            });
          });
      })
  );
});

// 后台同步（如果需要）
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  // 可以在这里实现后台数据同步
});

// 推送通知（如果需要）
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : '新しい通知があります',
    icon: '/assets/icons/logo.png',
    badge: '/assets/icons/favicon-64.png',
    vibrate: [200, 100, 200],
    tag: 'vib-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Vib', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

