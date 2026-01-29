/* =========================================================
   ファイル名：main.js
   概要　　：VIB公式サイト 基本インタラクション制御（簡易版）
   作成者　：曹 小帥（SOU）
   最終更新：2025-01-XX
   ========================================================= */

/* =========================================================
   1. Sidebar（サイドバー開閉 + オーバーレイ制御）
   ========================================================= */
const sidebar = document.querySelector(".sidebar");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");

// サイドバーを閉じる共通関数
function closeSidebar() {
  if (sidebar) sidebar.classList.remove("open");
  if (sidebar) sidebar.classList.add("closed");
  if (overlay) overlay.classList.remove("active");
  if (hamburger) hamburger.classList.remove("active");
}

// サイドバーを開く共通関数
function openSidebar() {
  if (sidebar) sidebar.classList.remove("closed");
  if (sidebar) sidebar.classList.add("open");
  if (overlay) overlay.classList.add("active");
  if (hamburger) hamburger.classList.add("active");
}

if (sidebar && hamburger && overlay) {
  // 初期状態設定（モバイルでは閉じる）
  if (window.innerWidth <= 900) {
    sidebar.classList.add("closed");
  }

  // ハンバーガーボタン押下
  hamburger.addEventListener("click", () => {
    const isClosed = sidebar.classList.contains("closed");
    if (isClosed) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  // オーバーレイ押下で閉じる
  overlay.addEventListener("click", closeSidebar);

  // スマホでリンクを押したら自動で閉じる
  document.querySelectorAll(".side-nav .nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  // 画面サイズ変更時にリセット
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      sidebar.classList.remove("closed");
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
      hamburger.classList.remove("active");
    } else if (!sidebar.classList.contains("open")) {
      sidebar.classList.add("closed");
      hamburger.classList.remove("active");
    }
  });
}

/* =========================================================
   2. 年号の自動更新
   ========================================================= */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =========================================================
   3. トップへ戻るボタン
   ========================================================= */
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
  // スクロールでボタンの表示/非表示
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  // トップへ戻るをクリック
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // スクロールイベントを監視（スロットルでパフォーマンス最適化）
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 初期チェック
  toggleBackToTop();
}

/* =========================================================
   4. ナビゲーションバーの現在のページをハイライト
   ========================================================= */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  // 現在のスクロール位置を取得
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// スロットルを使用してスクロールイベントを最適化
let navTicking = false;
window.addEventListener("scroll", () => {
  if (!navTicking) {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      navTicking = false;
    });
    navTicking = true;
  }
});

// 初期チェック
updateActiveNav();

/* =========================================================
   5. IntersectionObserver によるスクロールアニメーション
   ========================================================= */
// アニメーション設定
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// アニメーションを無効化する設定を確認
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // 一度アニメーションが実行されたら監視を停止（パフォーマンス最適化）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // すべての .observe 要素を監視
  document.querySelectorAll('.observe').forEach(el => {
    observer.observe(el);
  });
} else {
  // アニメーションを無効化する場合は、すべての要素を即座に表示
  document.querySelectorAll('.observe').forEach(el => {
    el.classList.add('animate');
  });
}

/* =========================================================
   6. 视频懒加载优化（可选）
   ========================================================= */
function initVideoLazyLoad() {
  const videos = document.querySelectorAll('video[data-lazy]');
  
  if (videos.length === 0) return;
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector('source[data-src]');
        if (source) {
          video.src = source.dataset.src;
          video.load();
        }
        videoObserver.unobserve(video);
      }
    });
  }, {
    rootMargin: '100px'
  });
  
  videos.forEach(video => {
    videoObserver.observe(video);
  });
}

/* =========================================================
   7. 视频进入视口自动播放（优化版）
   ========================================================= */
function initVideoAutoPlay() {
  const videos = document.querySelectorAll('video[data-autoplay]');

  if (videos.length === 0) return;

  // 尊重用户的动画偏好设置
  const prefersReducedMotionVideo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotionVideo) {
    // 如果用户禁用动画，不自动播放，但保留手动控制
    return;
  }

  // 用于存储每个视频的状态
  const videoStates = new WeakMap();

  // 安全播放视频
  function safePlay(video) {
    const state = videoStates.get(video) || {};
    
    // 如果用户手动暂停过，不自动恢复播放
    if (state.userPaused) return;
    
    // 检查视频是否已准备好
    if (video.readyState < 2) {
      // 视频还没准备好，添加加载状态
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) wrapper.classList.add('loading');
      
      // 等待视频可以播放时再播放
      video.addEventListener('canplay', function onCanPlay() {
        video.removeEventListener('canplay', onCanPlay);
        if (wrapper) wrapper.classList.remove('loading');
        attemptPlay(video);
      }, { once: true });
      return;
    }
    
    attemptPlay(video);
  }

  // 尝试播放
  function attemptPlay(video) {
    const state = videoStates.get(video) || {};
    if (state.userPaused) return;
    
    const wrapper = video.closest('.video-wrapper');
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          // 播放成功，添加 playing 类
          if (wrapper) {
            wrapper.classList.remove('loading');
            wrapper.classList.add('playing');
          }
        })
        .catch((error) => {
          // 自动播放被阻止时的处理
          if (error.name === 'NotAllowedError') {
            // 浏览器阻止了自动播放，通常需要用户交互
            console.info('视频自动播放被浏览器阻止，请手动播放');
          }
          // 其他错误静默处理
        });
    }
  }

  // 安全暂停视频
  function safePause(video) {
    if (!video.paused) {
      video.pause();
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) wrapper.classList.remove('playing');
    }
  }

  // 监听用户手动暂停/播放操作
  videos.forEach(video => {
    videoStates.set(video, { userPaused: false });
    
    // 用户手动暂停
    video.addEventListener('pause', () => {
      // 只有在视口内暂停才认为是用户操作
      const rect = video.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport && !video.ended) {
        videoStates.set(video, { userPaused: true });
      }
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) wrapper.classList.remove('playing');
    });
    
    // 用户手动播放，重置状态
    video.addEventListener('play', () => {
      const rect = video.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        videoStates.set(video, { userPaused: false });
      }
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) wrapper.classList.add('playing');
    });
    
    // 视频结束后重置状态，允许下次进入视口时自动播放
    video.addEventListener('ended', () => {
      videoStates.set(video, { userPaused: false });
      // 重置到开头，以便下次可以自动播放
      video.currentTime = 0;
      const wrapper = video.closest('.video-wrapper');
      if (wrapper) wrapper.classList.remove('playing');
    });
  });

  // 创建 IntersectionObserver
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // 进入视口时自动播放
        safePlay(video);
      } else {
        // 离开视口时暂停
        safePause(video);
        // 离开视口时重置用户暂停状态，下次进入时可以自动播放
        videoStates.set(video, { userPaused: false });
      }
    });
  }, {
    // 优化阈值：25% 可见就开始播放，更好的用户体验
    threshold: 0.25,
    // 提前 100px 开始准备
    rootMargin: '100px 0px'
  });

  videos.forEach(video => {
    videoObserver.observe(video);
  });

  // 页面隐藏时暂停所有视频（节省资源）
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      videos.forEach(video => {
        if (!video.paused) {
          safePause(video);
          // 标记为页面隐藏导致的暂停，而非用户操作
          const state = videoStates.get(video) || {};
          state.pausedByVisibility = true;
          videoStates.set(video, state);
        }
      });
    } else {
      // 页面恢复可见时，重新播放在视口内的视频
      videos.forEach(video => {
        const state = videoStates.get(video) || {};
        if (state.pausedByVisibility) {
          state.pausedByVisibility = false;
          videoStates.set(video, state);
          // 检查是否在视口内
          const rect = video.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0 
                              && rect.top > -video.offsetHeight * 0.75;
          if (isInViewport && !state.userPaused) {
            safePlay(video);
          }
        }
      });
    }
  });

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    videoObserver.disconnect();
  });
}

// 初始化视频功能
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoLazyLoad);
  document.addEventListener('DOMContentLoaded', initVideoAutoPlay);
} else {
  initVideoLazyLoad();
  initVideoAutoPlay();
}

/* =========================================================
   8. 展示会自動スクロール機能（autoplay モード）
   ========================================================= */
function initAutoScroll() {
  // URL パラメータを確認
  const urlParams = new URLSearchParams(window.location.search);
  const isAutoplay = urlParams.get('autoplay') === 'true';
  
  if (!isAutoplay) return;
  
  // モバイル・タブレット（768px以下）では自動スクロールを無効化
  const MIN_WIDTH_FOR_AUTOPLAY = 768;
  if (window.innerWidth < MIN_WIDTH_FOR_AUTOPLAY) {
    console.info('📱 モバイル端末のため、自動スクロールは無効です');
    return;
  }
  
  // 設定
  const CONFIG = {
    SCROLL_SPEED: 0.5,          // スクロール速度（px/frame）
    PAUSE_DURATION: 3000,       // セクション間の停止時間（ミリ秒）
  };
  
  // 状態管理（シンプル化）
  let state = {
    running: true,      // アニメーション実行中
    userPaused: false,  // ユーザー操作による一時停止
  };
  
  // scroll-behavior の切り替え
  function disableSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'auto';
  }
  
  function enableSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  
  // メインループ - シンプル版（セクション停止なし、連続スクロール）
  function tick() {
    if (!state.running) return;
    
    // ユーザー操作による一時停止中は smooth scroll を有効化
    if (state.userPaused) {
      enableSmoothScroll();
      requestAnimationFrame(tick);
      return;
    }
    
    // 自動スクロール中は smooth を無効化
    disableSmoothScroll();
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    
    // ページ末尾チェック
    if (currentScroll >= maxScroll - 5) {
      state.running = false;
      document.body.style.transition = 'opacity 1s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = 'welcome.html';
      }, 1000);
      return;
    }
    
    // スクロール実行（即時、スムーズなし）
    window.scrollTo(window.scrollX, currentScroll + CONFIG.SCROLL_SPEED);
    
    requestAnimationFrame(tick);
  }
  
  // ユーザー操作で一時停止
  function handleUserInteraction(e) {
    // touchstart は無視（誤検知防止）- touchmove のみ反応
    if (e && e.type === 'touchstart') return;
    
    state.userPaused = true;
    enableSmoothScroll(); // ユーザー操作時は smooth scroll を有効化
    
    clearTimeout(window.autoScrollResumeTimeout);
    window.autoScrollResumeTimeout = setTimeout(() => {
      state.userPaused = false;
      console.log('User pause ended, resuming');
    }, 10000);
  }
  
  // 初期化
  function init() {
    // ユーザー操作のイベント（touchstart を除く - 誤検知防止）
    ['wheel', 'touchmove', 'keydown'].forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });
    
    // ナビリンクをクリックしたときも smooth scroll を有効化して一時停止
    document.querySelectorAll('.nav-link, a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        enableSmoothScroll();
        state.userPaused = true;
        
        clearTimeout(window.autoScrollResumeTimeout);
        window.autoScrollResumeTimeout = setTimeout(() => {
          state.userPaused = false;
        }, 10000);
      });
    });
    
    // クリックで一時停止/再開のトグル（リンク・ボタン以外）
    document.addEventListener('click', (e) => {
      // リンクやボタンのクリックは無視
      if (e.target.closest('a, button')) return;
      
      state.userPaused = !state.userPaused;
      
      // 一時停止時は smooth scroll を有効化
      if (state.userPaused) {
        enableSmoothScroll();
      }
      
      // 視覚的フィードバック
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        z-index: 10000;
        pointer-events: none;
        opacity: 1;
        transition: opacity 0.5s ease;
      `;
      indicator.textContent = state.userPaused ? '⏸ 一時停止' : '▶ 自動スクロール再開';
      document.body.appendChild(indicator);
      
      setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 500);
      }, 1500);
    });
    
    // 少し遅延させてから開始（ページ読み込み完了を待つ）
    setTimeout(() => {
      // デバッグ情報
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      console.info('🎬 展示会自動スクロールモード開始');
      console.info(`   - ページ高さ: ${document.documentElement.scrollHeight}px`);
      console.info(`   - ビューポート高さ: ${window.innerHeight}px`);
      console.info(`   - 最大スクロール量: ${maxScroll}px`);
      console.info('   - クリックで一時停止/再開');
      console.info('   - マウスホイール/スワイプで10秒間一時停止');
      
      // メインループ開始
      requestAnimationFrame(tick);
    }, 2000);
  }
  
  // DOM 読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// 自動スクロール機能を初期化
initAutoScroll();

/* =========================================================
   9. 審査用デモ動画（SharePoint）の再生エラーハンドリング
   ========================================================= */
(function initReviewVideoFallback() {
  const reviewVideo = document.getElementById('reviewDemoVideo');
  const fallbackBox = document.getElementById('reviewVideoFallback');

  if (!reviewVideo || !fallbackBox) return;

  // フォールバック表示用の共通関数
  function showFallback() {
    fallbackBox.hidden = false;
  }

  // 再生エラー・ネットワークエラー時にフォールバックを表示
  reviewVideo.addEventListener('error', showFallback);
  reviewVideo.addEventListener('stalled', showFallback);
  reviewVideo.addEventListener('abort', showFallback);

  // 一定時間経ってもメタデータが取得できない場合もフォールバック
  setTimeout(() => {
    try {
      const NO_SOURCE = typeof HTMLMediaElement !== 'undefined'
        ? HTMLMediaElement.NETWORK_NO_SOURCE
        : 3;

      if (
        reviewVideo.readyState === 0 || // まったく読み込めていない
        reviewVideo.networkState === NO_SOURCE
      ) {
        showFallback();
      }
    } catch (e) {
      // 古いブラウザなどでの例外は無視
    }
  }, 8000);
})();
