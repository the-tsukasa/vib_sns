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
  
  // 設定
  const CONFIG = {
    SCROLL_SPEED: 1.5,          // スクロール速度（px/frame）
    PAUSE_DURATION: 3000,       // セクション間の停止時間（ミリ秒）
    LOOP_DELAY: 5000,           // ループ前の待機時間（ミリ秒）
    SECTION_THRESHOLD: 100,     // セクション検出の閾値（px）
    SMOOTH_SCROLL: true,        // スムーススクロールを使用
  };
  
  let isScrolling = true;
  let isPaused = false;
  let lastSectionIndex = -1;
  let animationId = null;
  
  // すべてのセクションを取得
  const sections = document.querySelectorAll('section[id]');
  const sectionPositions = [];
  
  // セクション位置を計算
  function calculateSectionPositions() {
    sectionPositions.length = 0;
    sections.forEach((section, index) => {
      sectionPositions.push({
        index: index,
        top: section.offsetTop,
        height: section.offsetHeight,
        id: section.id
      });
    });
  }
  
  // 現在のセクションインデックスを取得
  function getCurrentSectionIndex() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    for (let i = sectionPositions.length - 1; i >= 0; i--) {
      if (scrollY >= sectionPositions[i].top) {
        return i;
      }
    }
    return 0;
  }
  
  // セクションに到達したときに一時停止
  function checkSectionPause() {
    const currentIndex = getCurrentSectionIndex();
    
    if (currentIndex !== lastSectionIndex && currentIndex >= 0) {
      lastSectionIndex = currentIndex;
      
      // セクションの先頭付近で一時停止
      const section = sectionPositions[currentIndex];
      const scrollY = window.scrollY;
      const sectionStart = section.top;
      
      if (Math.abs(scrollY - sectionStart) < CONFIG.SECTION_THRESHOLD) {
        pauseScroll(CONFIG.PAUSE_DURATION);
      }
    }
  }
  
  // 一時停止
  function pauseScroll(duration) {
    if (isPaused) return;
    isPaused = true;
    
    setTimeout(() => {
      isPaused = false;
    }, duration);
  }
  
  // スクロールアニメーション
  function autoScroll() {
    if (!isScrolling || isPaused) {
      animationId = requestAnimationFrame(autoScroll);
      return;
    }
    
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    
    // ページ末尾に到達した場合、welcome ページに戻る
    if (currentScroll >= maxScroll - 5) {
      // ループ前に一時停止
      isScrolling = false;
      
      // フェードアウト効果
      document.body.style.transition = 'opacity 1s ease';
      document.body.style.opacity = '0';
      
      // welcome ページに戻る
      setTimeout(() => {
        window.location.href = 'welcome.html';
      }, 1000);
      
      return;
    }
    
    // スクロールを進める
    window.scrollBy(0, CONFIG.SCROLL_SPEED);
    
    // セクション到達チェック
    checkSectionPause();
    
    animationId = requestAnimationFrame(autoScroll);
  }
  
  // ユーザー操作で一時停止/再開
  function handleUserInteraction() {
    // 一時的に自動スクロールを停止
    isScrolling = false;
    
    // 10秒後に自動再開
    clearTimeout(window.autoScrollResumeTimeout);
    window.autoScrollResumeTimeout = setTimeout(() => {
      isScrolling = true;
    }, 10000);
  }
  
  // 初期化
  function init() {
    // セクション位置を計算
    calculateSectionPositions();
    
    // リサイズ時に再計算
    window.addEventListener('resize', calculateSectionPositions);
    
    // ユーザー操作のイベント
    ['wheel', 'touchstart', 'touchmove', 'keydown'].forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });
    
    // クリックで一時停止/再開のトグル
    document.addEventListener('click', (e) => {
      // リンクやボタン以外のクリックで一時停止/再開
      if (e.target.closest('a, button')) return;
      
      isScrolling = !isScrolling;
      
      // 視覚的フィードバック（オプション）
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
      indicator.textContent = isScrolling ? '▶ 自動スクロール再開' : '⏸ 一時停止';
      document.body.appendChild(indicator);
      
      setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 500);
      }, 1500);
    });
    
    // 少し遅延させてから開始（ページ読み込み完了を待つ）
    setTimeout(() => {
      autoScroll();
      
      // 開始メッセージ
      console.info('🎬 展示会自動スクロールモード開始');
      console.info('   - クリックで一時停止/再開');
      console.info('   - マウスホイール/タッチで10秒間一時停止');
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
