(function () {
    const hero     = document.querySelector('.s1-hero');
    const briefing = document.querySelector('.s1-briefing');
    const s1Logo   = document.querySelector('.screen-01 .top-logo');
    const header   = document.querySelector('.app-header');
    const nav      = document.querySelector('.floating-nav');

    // 초기 상태: 헤더·네비 숨김 (JS 제어이므로 CSS transition 우회)
    function initHidden() {
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-100%)';
        }
        if (nav) {
            nav.style.opacity = '0';
            nav.style.transform = 'translateX(-50%) translateY(30px)';
        }
    }
    initHidden();

    let vh = window.innerHeight;
    let rafId = null;

    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    // progress 구간 [start, end] → [0, 1] 정규화
    function rangeProgress(raw, start, end) {
        return easeInOut(clamp((raw - start) / (end - start), 0, 1));
    }

    function applyFrame() {
        const raw = window.scrollY / vh; // 0(맨 위) → 1(screen-01 완전 벗어남)

        // --- screen-01 로고: 빠르게 페이드아웃 ---
        if (s1Logo) {
            const p = rangeProgress(raw, 0, 0.35);
            s1Logo.style.opacity = String(1 - p);
        }

        // --- s1-briefing: 아래로 사라짐 ---
        if (briefing) {
            const p = rangeProgress(raw, 0, 0.45);
            briefing.style.opacity = String(1 - p);
            // CSS base: translateX(-50%), 여기서 Y축만 추가 이동
            briefing.style.transform = `translateX(-50%) translateY(${p * 20}px)`;
        }

        // --- s1-hero: 위로 올라가며 페이드아웃 ---
        if (hero) {
            const p = rangeProgress(raw, 0, 0.65);
            hero.style.opacity = String(1 - p);
            hero.style.transform = `translateY(${-p * 50}px) scale(${1 - p * 0.1})`;
        }

        // --- app-header: 위에서 슬라이드인 ---
        if (header) {
            const p = rangeProgress(raw, 0.25, 0.75);
            header.style.opacity = String(p);
            header.style.transform = `translateY(${(1 - p) * -100}%)`;
        }

        // --- floating-nav: 아래에서 슬라이드업 ---
        if (nav) {
            const p = rangeProgress(raw, 0.55, 0.95);
            nav.style.opacity = String(p);
            nav.style.transform = `translateX(-50%) translateY(${(1 - p) * 30}px)`;
        }

        rafId = null;
    }

    function onScroll() {
        if (rafId) return;
        rafId = requestAnimationFrame(applyFrame);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', function () {
        vh = window.innerHeight;
        applyFrame();
    });

    // 초기 렌더링
    applyFrame();
})();
