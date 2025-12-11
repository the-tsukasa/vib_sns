/**
 * Welcome Page Enhanced Script - 強化版ウェルカムページスクリプト
 * 強化されたインタラクション、パーティクルシステム、タイプライター効果などを含む
 */

(function () {
    'use strict';

    // 設定定数
    const CONFIG = {
        PROGRESS_INTERVAL: 30,
        PROGRESS_MIN: 2,
        PROGRESS_MAX: 7,
        FADE_DELAY: 500,
        MAGNETIC_DIVISOR: 25,
        CURSOR_ANIMATION_DURATION: 500,
        THROTTLE_DELAY: 16, // ~60fps
        PARTICLE_COUNT: 30,
        TYPING_SPEED: 100 // タイプライター速度（ミリ秒）
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

    // パーティクルシステムの作成
    function createParticles() {
        if (prefersReducedMotion() || isTouchDevice()) {
            return;
        }

        const particlesContainer = document.querySelector('.welcome-particles');
        if (!particlesContainer) return;

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'welcome-particle';

            // ランダムな位置と遅延
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';

            particlesContainer.appendChild(particle);
        }
    }

    // ローディングアニメーションの初期化（強化版）
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
                        hero.style.transform = 'scale(1)';
                        if (logo) logo.classList.add('welcome-logo-reveal');
                        if (text) {
                            text.classList.add('show');
                            // タイプライター効果を開始
                            typewriterEffect(text);
                        }

                        // ローダーを削除
                        setTimeout(() => {
                            wrapper.style.display = 'none';
                        }, 1000);
                    }, CONFIG.FADE_DELAY);
                }, CONFIG.FADE_DELAY);
            }
        }, CONFIG.PROGRESS_INTERVAL);
    }

    // タイプライター効果
    function typewriterEffect(element) {
        if (prefersReducedMotion()) {
            return;
        }

        const text = element.textContent.trim();
        element.textContent = '';
        element.classList.add('typing');

        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent = text.substring(0, index + 1);
                index++;
            } else {
                clearInterval(typeInterval);
                element.classList.remove('typing');
            }
        }, CONFIG.TYPING_SPEED);
    }

    // マウス追従効果の初期化（強化版）
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

        const updateCursor = throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }, CONFIG.THROTTLE_DELAY);

        const updateOutline = () => {
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            outlineX += dx * 0.1;
            outlineY += dy * 0.1;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

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

    // マグネット効果の初期化（強化版）
    function initMagnetic() {
        if (prefersReducedMotion()) {
            return;
        }

        const magneticWrap = document.querySelector('.welcome-magnetic-wrap');
        if (!magneticWrap) {
            return;
        }

        let isHovering = false;

        const handleMouseMove = throttle((e) => {
            if (!isHovering) return;

            const rect = magneticWrap.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const x = (centerX - e.clientX) / CONFIG.MAGNETIC_DIVISOR;
            const y = (centerY - e.clientY) / CONFIG.MAGNETIC_DIVISOR;

            magneticWrap.style.transform = `translate(${x}px, ${y}px)`;
        }, CONFIG.THROTTLE_DELAY);

        const handleMouseEnter = () => {
            isHovering = true;
        };

        const handleMouseLeave = () => {
            isHovering = false;
            magneticWrap.style.transform = 'translate(0, 0)';
        };

        magneticWrap.addEventListener('mouseenter', handleMouseEnter);
        magneticWrap.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousemove', handleMouseMove);
    }

    // インタラクション効果の初期化（強化版）
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

            // クリックリップル効果
            el.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
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

    // パララックススクロール効果
    function initParallax() {
        if (prefersReducedMotion()) {
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        const handleScroll = throttle((e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const x = (mouseX - 0.5) * speed * 100;
                const y = (mouseY - 0.5) * speed * 100;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, CONFIG.THROTTLE_DELAY);

        document.addEventListener('mousemove', handleScroll);
    }

    // 全機能の初期化
    function init() {
        try {
            createParticles();
            initLoader();
            initCursor();
            initMagnetic();
            initInteractions();
            initDateDisplay();
            initParallax();
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

