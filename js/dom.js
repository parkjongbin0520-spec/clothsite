// --- 슬라이더 ---
const box = document.getElementById('box');
const slider = box.querySelector('.slider');
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
seasonButtons.forEach(button => {
    button.addEventListener('click', () => {
        seasonButtons.forEach(btn => btn.classList.remove('active-season'));
        button.classList.add('active-season');
        const selectedSeason = button.getAttribute('data-season');
        mainApp.classList.remove('spring', 'summer', 'autumn', 'winter');
        mainApp.classList.add(selectedSeason);
    });
});

// --- 아바타 성별 전환 ---
const btnFemale = document.getElementById('btnFemale');
const btnMale = document.getElementById('btnMale');
const avatarGenderText = document.getElementById('avatarGenderText');
const avatarGraphic = document.getElementById('avatarGraphic');

if (btnFemale && btnMale) {
    btnFemale.addEventListener('click', () => {
        btnFemale.classList.add('active-gender');
        btnMale.classList.remove('active-gender');
        selectedGender = "female";
        if (avatarGenderText) avatarGenderText.innerText = "여성 모델 기본값";
        if (avatarGraphic) avatarGraphic.innerText = "👩";
    });

    btnMale.addEventListener('click', () => {
        btnMale.classList.add('active-gender');
        btnFemale.classList.remove('active-gender');
        selectedGender = "male";
        if (avatarGenderText) avatarGenderText.innerText = "남성 모델 기본값";
        if (avatarGraphic) avatarGraphic.innerText = "👨";
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

// --- AI 기온별 코디 추천 ---
function getOutfitByTemp(temp) {
    return coordinateData.find(d => temp >= d.minTemp && temp < d.maxTemp);
}

const aiRecommendBtn = document.getElementById('aiRecommendBtn');
if (aiRecommendBtn) {
    aiRecommendBtn.addEventListener('click', () => {
        let outfit = getOutfitByTemp(currentTemp);
        if (!outfit) return;

        if (selectedGender === "male" && outfit.bottom.includes("숏팬츠")) {
            outfit = { ...outfit, bottom: "남성 5부 반바지" };
        }

        if (document.getElementById('rec-item-1')) {
            document.getElementById('rec-item-1').innerText = outfit.top;
            document.getElementById('rec-item-2').innerText = outfit.bottom;
            document.getElementById('rec-item-3').innerText = outfit.outer;
            document.getElementById('rec-item-4').innerText = outfit.shoes;
            document.getElementById('rec-item-5').innerText = outfit.bag;
            document.getElementById('rec-item-6').innerText = outfit.acc;
            document.getElementById('recommendDesc').innerHTML = `<strong>🤖 AI 추천 결과:</strong><br>${outfit.desc}`;
        }

        if (document.getElementById('fitOuter')) {
            document.getElementById('fitOuter').innerText = outfit.outer;
            document.getElementById('fitTop').innerText = outfit.top;
            document.getElementById('fitBottom').innerText = outfit.bottom;
            document.getElementById('fitShoes').innerText = outfit.shoes;
            document.getElementById('fitAcc').innerText = outfit.acc;
        }

        if (avatarGraphic) {
            avatarGraphic.innerText = selectedGender === "female" ? "🙋‍♀️" : "🙋‍♂️";
        }
    });
}

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
        window.open(seasonLinks[season] || seasonLinks.spring, '_blank');
    });
});
