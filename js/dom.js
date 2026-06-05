// --- 슬라이더 ---
const box = document.getElementById('box');
const slider = document.getElementById('slider') || box.querySelector('.slider');
const dlwjsbtn = document.getElementById('dlwjsbtn');
const ekdmabtn = document.getElementById('ekdmabtn');

let selectedGender = "female";
const firstClone = slider.querySelector('.adimage').cloneNode(true);
slider.appendChild(firstClone);

let isTransitioning = false;

function nextSlide() {
    if (isTransitioning) return;
    const itemwidth = slider.querySelector('.adimage').clientWidth;
    const totalImages = slider.querySelectorAll('.adimage').length;
    isTransitioning = true;
    slider.style.scrollBehavior = 'smooth';
    slider.scrollLeft += itemwidth;
    setTimeout(() => {
        if (slider.scrollLeft >= (totalImages - 1) * itemwidth - 10) {
            slider.style.scrollBehavior = 'auto';
            slider.scrollLeft = 0;
        }
        isTransitioning = false;
    }, 500);
}

function prevSlide() {
    if (isTransitioning) return;
    const itemwidth = slider.querySelector('.adimage').clientWidth;
    const totalImages = slider.querySelectorAll('.adimage').length;
    isTransitioning = true;
    if (slider.scrollLeft <= 10) {
        slider.style.scrollBehavior = 'auto';
        slider.scrollLeft = (totalImages - 1) * itemwidth;
        setTimeout(() => {
            slider.style.scrollBehavior = 'smooth';
            slider.scrollLeft -= itemwidth;
            isTransitioning = false;
        }, 20);
    } else {
        slider.style.scrollBehavior = 'smooth';
        slider.scrollLeft -= itemwidth;
        setTimeout(() => { isTransitioning = false; }, 500);
    }
}

let slideInterval = setInterval(nextSlide, 5000);

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

ekdmabtn.addEventListener('click', () => { nextSlide(); resetSlideInterval(); });
dlwjsbtn.addEventListener('click', () => { prevSlide(); resetSlideInterval(); });

// --- 계절 버튼 ---
const mainApp = document.getElementById('mainApp');
const seasonButtons = document.querySelectorAll('.season-btn');
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

seasonButtons.forEach(button => {
    button.addEventListener('click', () => {
        seasonButtons.forEach(btn => btn.classList.remove('active-season'));
        button.classList.add('active-season');
        const selectedSeason = button.getAttribute('data-season');
        // html 요소에 계절 클래스 적용 → screen-01 포함 전체 상속
        document.documentElement.classList.remove(...SEASONS);
        document.documentElement.classList.add(selectedSeason);
        // mainApp 하위 호환 유지
        mainApp.classList.remove(...SEASONS);
        mainApp.classList.add(selectedSeason);
    });
});

// --- 아바타 성별 전환 ---
const btnFemale = document.getElementById('btnFemale');
const btnMale = document.getElementById('btnMale');
const avatarGenderText = document.getElementById('avatarGenderText');
const avatarImg = document.getElementById('avatarImg');

/* ── Humaaans 아바타 (실제 인간 비율 벡터, 빌드타임 사전 렌더) ──
   tools/render-avatars.cjs 가 react-humaaans 로 기온대×성별 16종을
   색상까지 박아 img/avatar/{gender}-{0..7}.svg 로 미리 생성.
   런타임엔 추천 밴드에 맞는 SVG 로 교체만 한다 (React·외부런타임 없음). */
function updateAvatar() {
    if (!avatarImg) return;
    let idx = lastTempBand ? COORDINATES.indexOf(lastTempBand) : 1; // 코디 전 기본: 온화한 밴드
    if (idx < 0) idx = 1;
    avatarImg.src = `img/avatar/${selectedGender}-${idx}.svg`;
}

if (btnFemale && btnMale) {
    btnFemale.addEventListener('click', () => {
        btnFemale.classList.add('active-gender');
        btnMale.classList.remove('active-gender');
        selectedGender = "female";
        if (avatarGenderText) avatarGenderText.innerText = "여성";
        redressIfModalOpen(); // 스펙 + 아바타 이미지 재반영
    });

    btnMale.addEventListener('click', () => {
        btnMale.classList.add('active-gender');
        btnFemale.classList.remove('active-gender');
        selectedGender = "male";
        if (avatarGenderText) avatarGenderText.innerText = "남성";
        redressIfModalOpen();
    });
}

// --- 하단 카테고리 탭 ---
document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll("#categoryTabs .tab-btn");
    const cardRows = document.querySelectorAll(".bottom-content .card-row");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tabButtons.forEach((btn) => btn.classList.remove("active-tab"));
            button.classList.add("active-tab");
            const targetId = button.getAttribute("data-target");
            cardRows.forEach((row) => {
                row.style.display = row.id === targetId ? "flex" : "none";
            });
        });
    });
});

// --- 아바타 코디 모달 제어 ---
const codiModal = document.getElementById('codiModal');
const codiClose = document.getElementById('codiClose');
const codiScrim = document.getElementById('codiScrim');
let lastFocusedEl = null;
let lastTempBand = null; // 마지막으로 추천된 기온대 (성별 토글 시 재반영용)

function isModalOpen() {
    return codiModal && codiModal.classList.contains('is-open');
}

function openCodiModal() {
    if (!codiModal) return;
    lastFocusedEl = document.activeElement;
    codiModal.classList.add('is-open');
    codiModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 락
    // visibility 전환 후에야 포커스 가능 → 다음 프레임에 이동
    requestAnimationFrame(() => { if (codiClose) codiClose.focus(); });
}

function closeCodiModal() {
    if (!codiModal) return;
    codiModal.classList.remove('is-open');
    codiModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();  // 포커스 복귀
}

if (codiClose) codiClose.addEventListener('click', closeCodiModal);
if (codiScrim) codiScrim.addEventListener('click', closeCodiModal);
document.addEventListener('keydown', (e) => {
    if (!isModalOpen()) return;
    if (e.key === 'Escape') { closeCodiModal(); return; }
    // 포커스 트랩: 모달 안에서만 Tab 순환
    if (e.key === 'Tab') {
        const f = codiModal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

// --- 코디 카드 (추천 가먼트 + 카테고리 대표 상품 썸네일·가격) ---
const CAT_TO_CATALOG = { top: 'TOP', bottom: 'PANTS', outer: 'OUTER' };
const CODI_SLOTS = {
    top:    { name: 'fitTop',    thumb: 'topThumb',    price: 'topPrice' },
    bottom: { name: 'fitBottom', thumb: 'bottomThumb', price: 'bottomPrice' },
    outer:  { name: 'fitOuter',  thumb: 'outerThumb',  price: 'outerPrice' },
};

/** 카테고리·밴드로 대표 커머스 상품 1개 선택 (썸네일/가격용) */
function repProduct(slot, bandIdx) {
    if (typeof PRODUCTS === 'undefined') return null;
    const list = PRODUCTS.filter((p) => p.category === CAT_TO_CATALOG[slot]);
    if (!list.length) return null;
    return list[((bandIdx % list.length) + list.length) % list.length];
}

/** 코디 카드 1장 채우기 (가먼트 없으면 '없음' + 썸네일 숨김) */
function fillCodiCard(slot, garment, bandIdx) {
    const ids = CODI_SLOTS[slot];
    const nameEl = document.getElementById(ids.name);
    const thumbEl = document.getElementById(ids.thumb);
    const priceEl = document.getElementById(ids.price);
    if (garment) {
        const prod = repProduct(slot, bandIdx);
        if (nameEl) nameEl.textContent = garment.name;
        if (thumbEl) {
            if (prod) { thumbEl.src = prod.imageUrl; thumbEl.alt = prod.name; thumbEl.style.display = ''; }
            else { thumbEl.style.display = 'none'; }
        }
        if (priceEl) priceEl.textContent = prod ? prod.formattedPrice : '';
    } else {
        if (nameEl) nameEl.textContent = '없음';
        if (thumbEl) thumbEl.style.display = 'none';
        if (priceEl) priceEl.textContent = '';
    }
}

// --- AI 기온별 코디 추천 ---
/** 기온대 밴드를 resolveOutfit 으로 해석해 모달 내용을 채운다 */
function dressAvatar(band) {
    if (!band) return;
    const outfit = resolveOutfit(band, selectedGender); // coordinateData.js
    const idx = COORDINATES.indexOf(band);

    fillCodiCard('top', outfit.top, idx);
    fillCodiCard('bottom', outfit.bottom, idx);
    fillCodiCard('outer', outfit.outer, idx);

    const desc = document.getElementById('recommendDesc');
    if (desc) {
        desc.innerHTML = `<strong>🤖 AI 추천 결과:</strong><br>${outfit.desc}`;
        if (window.parseEmoji) parseEmoji(desc); // 🤖 이모지 통일
    }

    updateAvatar(); // 코디를 입은 아바타 이미지로 갱신
}

/** 성별 토글 시 모달이 열려 있으면 같은 기온대로 다시 입힌다 */
function redressIfModalOpen() {
    if (isModalOpen() && lastTempBand) dressAvatar(lastTempBand);
}

const aiRecommendBtn = document.getElementById('aiRecommendBtn');
if (aiRecommendBtn) {
    aiRecommendBtn.addEventListener('click', () => {
        const band = getCoordinateByTemp(currentTemp); // coordinateData.js
        if (!band) return;
        lastTempBand = band;
        dressAvatar(band);
        openCodiModal();
    });
}

// 초기 기본 아바타(코디 전) 1회 렌더 — 빈 이미지 방지
updateAvatar();

// --- 구매 링크 ---
const seasonLinks = {
    spring: 'https://www.musinsa.com',
    summer: 'https://www.29cm.co.kr',
    autumn: 'https://store.musinsa.com',
    winter: 'https://www.zara.com/kr/'
};

document.querySelectorAll('.buy-btn').forEach(buybtn => {
    buybtn.addEventListener('click', () => {
        const season = document.querySelector('.active-season').dataset.season;
        const link = seasonLinks[season] || seasonLinks.spring;
        window.open(link, '_blank', 'noopener,noreferrer');
    });
});
// --- 계절 비주얼 이미지 교체 ---
// 주의: seasonButtons 는 위에서 이미 선언됨 (재선언 시 SyntaxError 로 파일 전체가 죽음)
const seasonImage = document.querySelector('.season-image');

const seasonImages = {
  spring: 'img/739a64e3e3fb42ea.png',
  summer: 'img/summer.png',
  autumn: 'img/autumn.png',
  winter: 'img/winter.png'
};

if (seasonImage) {
  // 해당 계절 이미지 파일이 아직 없으면 봄 이미지로 폴백 (깨진 이미지 아이콘 방지)
  seasonImage.addEventListener('error', () => {
    if (seasonImage.src.indexOf(seasonImages.spring) === -1) {
      seasonImage.src = seasonImages.spring;
    }
  });

  seasonButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedSeason = button.dataset.season;
      seasonImage.src = seasonImages[selectedSeason] || seasonImages.spring;
    });
  });
}