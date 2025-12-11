/**
 * Welcome Page Creative Script - クリエイティブ版ウェルカムページスクリプト
 * 高度なパーティクルシステム、3D効果、テキスト分割、マウス軌跡などのクリエイティブ機能を含む
 */

(function () {
    'use strict';

    // 設定定数
    const CONFIG = {
        PROGRESS_INTERVAL: 30,
        PROGRESS_MIN: 2,
        PROGRESS_MAX: 7,
        FADE_DELAY: 500,
        MAGNETIC_DIVISOR: 20,
        CURSOR_ANIMATION_DURATION: 500,
        THROTTLE_DELAY: 16, // ~60fps
        PARTICLE_COUNT: 25, // ページをクリーンにするためパーティクル数を削減
        TRAIL_PARTICLES: 5,
        TRAIL_DELAY: 50
    };

    // ユーティリティ関数：スロットル
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // ユーティリティ関数：タッチデバイス対応確認
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // ユーティリティ関数：視差効果減衰設定の確認
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // 高度なパーティクルシステムの作成
    function createAdvancedParticles() {
        if (prefersReducedMotion() || isTouchDevice()) {
            return;
        }

        const particlesContainer = document.querySelector('.welcome-particles-creative');
        if (!particlesContainer) return;

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'welcome-particle-creative';

            // より小さなパーティクルサイズで、効果をより繊細に
            const size = Math.random() * 4 + 2; // 2-6px、より小さく繊細に
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // ランダムな位置
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // より遅く、柔らかなアニメーション
            const delay = Math.random() * 25;
            const duration = 20 + Math.random() * 20; // より長いアニメーション時間
            const dx = (Math.random() - 0.5) * 150; // 移動距離を削減
            const dy = (Math.random() - 0.5) * 150;

            particle.style.setProperty('--dx', dx);
            particle.style.setProperty('--dy', dy);
            particle.style.animationDelay = delay + 's';
            particle.style.animationDuration = duration + 's';
            particle.style.opacity = 0.4 + Math.random() * 0.3; // より柔らかな透明度

            particlesContainer.appendChild(particle);
        }
    }

    // マウス軌跡パーティクルの作成
    let trailParticles = [];
    let lastMouseTime = 0;

    function createTrailParticle(x, y) {
        if (prefersReducedMotion() || isTouchDevice()) {
            return;
        }

        const particle = document.createElement('div');
        particle.className = 'welcome-trail-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    // ローディングアニメーションの初期化（クリエイティブ版）
    function initLoader() {
        const vBar = document.getElementById('welcome-v-bar');
        const counter = document.querySelector('.welcome-loader-counter');
        const wrapper = document.getElementById('welcome-loader-wrapper');
        const hero = document.getElementById('welcome-hero');
        const logo = document.getElementById('welcome-main-logo');
        const text = document.querySelector('.welcome-hero-text');

        if (!vBar || !counter || !wrapper || !hero) {
            console.warn('ローダー要素が見つかりません');
            return;
        }

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * CONFIG.PROGRESS_MAX) + CONFIG.PROGRESS_MIN;
            if (progress > 100) progress = 100;

            vBar.style.height = progress + '%';
            counter.textContent = progress + '%';
            counter.setAttribute('aria-valuenow', progress);

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    vBar.classList.add('welcome-fade-out');
                    counter.classList.add('welcome-fade-out');
                    wrapper.classList.add('welcome-split-open');

                    setTimeout(() => {
                        hero.style.opacity = '1';
                        hero.style.transform = 'scale(1) perspective(1000px) rotateX(0deg)';
                        if (logo) logo.classList.add('welcome-logo-reveal');
                        if (text) {
                            text.classList.add('show');
                            // テキスト分割アニメーションを開始
                            splitTextAnimation(text);
                        }

                        // ローダーを削除
                        setTimeout(() => {
                            wrapper.style.display = 'none';
                        }, 1200);
                    }, CONFIG.FADE_DELAY);
                }, CONFIG.FADE_DELAY);
            }
        }, CONFIG.PROGRESS_INTERVAL);
    }

    // テキスト分割アニメーション - 強化版
    function splitTextAnimation(element) {
        if (prefersReducedMotion()) {
            return;
        }

        const text = element.textContent.trim();
        element.textContent = '';

        // 各文字にspanを作成し、data-char属性を追加
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            const displayChar = char === ' ' ? '\u00A0' : char;
            span.className = char === ' ' ? 'char space' : 'char';
            span.textContent = displayChar;
            span.setAttribute('data-char', displayChar);
            span.style.setProperty('--index', index);
            element.appendChild(span);
        });
    }

    // マウス追従効果の初期化（クリエイティブ版）
    function initCursor() {
        if (isTouchDevice() || prefersReducedMotion()) {
            return;
        }

        const cursorDot = document.querySelector('.welcome-cursor-dot');
        const cursorOutline = document.querySelector('.welcome-cursor-outline');
        const interactables = document.querySelectorAll('.welcome-interactable');

        if (!cursorDot || !cursorOutline) {
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let dotScale = 1;
        let lastMouseTime = 0;

        const updateCursor = throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            const now = Date.now();
            const timeDiff = now - lastMouseTime;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // カーソルポイントの動的スケーリング効果 - 移動速度に基づく
            if (timeDiff < 50) {
                dotScale = 1.3;
            } else if (timeDiff < 100) {
                dotScale = 1.15;
            } else {
                dotScale = 1;
            }

            cursorDot.style.width = `${6 * dotScale}px`;
            cursorDot.style.height = `${6 * dotScale}px`;
            cursorDot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;

            lastMouseTime = now;
        }, CONFIG.THROTTLE_DELAY);

        const updateOutline = () => {
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // よりスマートな動的追従速度
            let speed;
            if (distance > 100) {
                speed = 0.18; // 遠距離は高速追従
            } else if (distance > 50) {
                speed = 0.12; // 中距離
            } else {
                speed = 0.08; // 近距離は滑らかに
            }

            outlineX += dx * speed;
            outlineY += dy * speed;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            // 移動方向と距離に基づいて動的な回転とスケーリングを追加
            if (distance > 3) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const rotation = angle * 0.3; // 回転幅を減らし、より自然に
                const scale = 1 + Math.min(distance / 200, 0.1); // わずかなスケーリング
                cursorOutline.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
            } else {
                cursorOutline.style.transform = `translate(-50%, -50%) rotate(0deg) scale(1)`;
            }

            requestAnimationFrame(updateOutline);
        };

        window.addEventListener('mousemove', updateCursor);
        updateOutline();

        // インタラクティブ要素のホバー効果
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });

        document.body.style.cursor = 'none';
    }

    // マグネット効果の初期化（クリエイティブ版）
    function initMagnetic() {
        if (prefersReducedMotion()) {
            return;
        }

        const magneticWrap = document.querySelector('.welcome-magnetic-wrap');
        if (!magneticWrap) {
            return;
        }

        let isHovering = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = throttle((e) => {
            if (!isHovering) return;

            const rect = magneticWrap.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            targetX = (centerX - e.clientX) / CONFIG.MAGNETIC_DIVISOR;
            targetY = (centerY - e.clientY) / CONFIG.MAGNETIC_DIVISOR;
        }, CONFIG.THROTTLE_DELAY);

        const animate = () => {
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            if (isHovering) {
                magneticWrap.style.transform = `translate(${currentX}px, ${currentY}px) perspective(1000px) rotateY(${currentX * 0.1}deg) rotateX(${-currentY * 0.1}deg)`;
            } else {
                currentX *= 0.9;
                currentY *= 0.9;
                magneticWrap.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }

            requestAnimationFrame(animate);
        };

        magneticWrap.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        magneticWrap.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0;
            targetY = 0;
        });

        document.addEventListener('mousemove', handleMouseMove);
        animate();
    }

    // インタラクション効果の初期化（クリエイティブ版）
    function initInteractions() {
        const interactables = document.querySelectorAll('.welcome-interactable');

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('welcome-hover-active');
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('welcome-hover-active');
            });

            // キーボードナビゲーションのサポート
            el.addEventListener('focus', () => {
                document.body.classList.add('welcome-hover-active');
            });

            el.addEventListener('blur', () => {
                document.body.classList.remove('welcome-hover-active');
            });

            // クリックリップル効果（強化版）
            el.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'radial-gradient(circle, rgba(0,0,0,0.3), transparent)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'welcome-ripple 0.8s ease-out';

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 800);
            });
        });
    }

    // 日付表示を追加
    function initDateDisplay() {
        const dateElement = document.querySelector('.welcome-date');
        if (!dateElement) return;

        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        const dateString = now.toLocaleDateString('ja-JP', options);
        dateElement.textContent = dateString;
    }

    // 3Dパララックス効果
    function init3DParallax() {
        if (prefersReducedMotion()) {
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        const handleMouseMove = throttle((e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const x = mouseX * speed * 50;
                const y = mouseY * speed * 50;
                const rotateY = mouseX * speed * 10;
                const rotateX = -mouseY * speed * 10;

                el.style.transform = `translate(${x}px, ${y}px) perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            });
        }, CONFIG.THROTTLE_DELAY);

        document.addEventListener('mousemove', handleMouseMove);
    }

    // CSSにリップルアニメーションを追加
    function injectRippleAnimation() {
        if (!document.getElementById('ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes welcome-ripple {
                    from {
                        transform: scale(0);
                        opacity: 0.6;
                    }
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 全機能の初期化
    function init() {
        try {
            injectRippleAnimation();
            createAdvancedParticles();
            initLoader();
            initCursor();
            initMagnetic();
            initInteractions();
            initDateDisplay();
            init3DParallax();
        } catch (error) {
            console.error('初期化エラー:', error);
        }
    }

    // DOM読み込み完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

