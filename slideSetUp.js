const box = document.getElementById('box');
const slider = box.querySelector('.slider');
const dlwjsbtn = document.getElementById('dlwjsbtn');
const ekdmabtn = document.getElementById('ekdmabtn');

let currentTemp = 15;
let selectedGender = "female"; // 기본 아바타 성별
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
    }, 500); // transition duration
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

// 2. 5초(5000ms)마다 자동으로 nextSlide 함수 실행
let slideInterval = setInterval(nextSlide, 5000);

// 3. 자동 슬라이드 타이머를 리셋하는 함수
function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

// 다음 버튼 클릭
ekdmabtn.addEventListener('click', () => { nextSlide(); resetSlideInterval(); });

// 이전 버튼 클릭
dlwjsbtn.addEventListener('click', () => { prevSlide(); resetSlideInterval(); });
// 계절 버튼 이벤트 통합 관리
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

// 아바타 성별 전환 스위치 인터랙션 로직
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

// 하단 의류 카테고리 탭
document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll("#categoryTabs .tab-btn");
    const cardRows = document.querySelectorAll(".bottom-content .card-row");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // 1. 모든 탭 버튼에서 active-tab 디자인 클래스 제거 후, 클릭한 버튼에만 추가
            tabButtons.forEach((btn) => btn.classList.remove("active-tab"));
            button.classList.add("active-tab");

            // 2. 클릭한 버튼에 적힌 data-target 값(cardTop, cardBottom 등)을 쏙 가져옵니다.
            const targetId = button.getAttribute("data-target");

            // 3. 아래에 깔려있는 모든 카드 묶음(card-row)을 하나씩 검사합니다.
            cardRows.forEach((row) => {
                // 버튼의 목적지(targetId)와 카드 묶음의 id가 일치하면 보여주고, 다르면 숨깁니다.
                if (row.id === targetId) {
                    row.style.display = "flex"; // CSS의 가로스크롤 정렬(flex)을 유지하며 노출
                } else {
                    row.style.display = "none";  // 화면에서 숨김
                }
            });
        });
    });
});
const API_KEY = "8576ca6cc1758255ca9250ce92660339";

// 날씨 API 작동 코드
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}&units=metric&lang=kr`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const weather = data.weather[0].description;
        currentTemp = data.main.temp;
        document.getElementById('weather').textContent = `${currentTemp.toFixed(1)}°C · ${weather}`;
    } catch (err) {
        document.getElementById('weather').textContent = '날씨 불러오기 실패';
    }
}
getWeather();

// AI 기온별 코디 추천 및 자동 피팅 시스템
const aiRecommendBtn = document.getElementById('aiRecommendBtn');
if (aiRecommendBtn) {
    aiRecommendBtn.addEventListener('click', () => {
        let outfit = { top: "", bottom: "", outer: "", shoes: "", bag: "", acc: "", desc: "" };
        const t = currentTemp;

        if (t >= 28) {
            outfit = {
                top: "린넨 반팔 티셔츠", bottom: "린넨 숏팬츠", outer: "없음 (폭염)",
                shoes: "스트랩 샌들", bag: "에코백", acc: "틴트 선글라스",
                desc: "폭염 날씨입니다. 통풍이 잘되는 시원한 소재로 가볍게 입혀드렸습니다."
            };
        } else if (t >= 23 && t < 28) {
            outfit = {
                top: "세미오버핏 반팔 셔츠", bottom: "캐주얼 면바지", outer: "없음",
                shoes: "화이트 스니커즈", bag: "메신저백", acc: "미니멀 볼캡",
                desc: "초여름 날씨입니다. 깔끔하면서도 더위를 피할 수 있는 미니멀 룩 완성!"
            };
        } else if (t >= 20 && t < 23) {
            outfit = {
                top: "오버핏 옥스포드 셔츠", bottom: "라이트 슬랙스", outer: "가벼운 가디건",
                shoes: "클래식 로퍼", bag: "레더 숄더백", acc: "메탈 시계",
                desc: "활동하기 최적인 선선한 기온입니다. 셔츠와 가디건 조합 레이어드 피팅 완료."
            };
        } else if (t >= 17 && t < 20) {
            outfit = {
                top: "헤비웨이트 맨투맨", bottom: "스트레이트 청바지", outer: "미니멀 자켓",
                shoes: "캐주얼 캔버스화", bag: "캠퍼스 백팩", acc: "은은한 반지 세트",
                desc: "완연한 봄/가을 기후입니다. 스타일리시한 무드의 아우터 자켓을 레이어드 착용했습니다."
            };
        } else if (t >= 12 && t < 17) {
            outfit = {
                top: "도톰한 하프넥 니트", bottom: "테이퍼드 코튼 팬츠", outer: "클래식 트렌치코트",
                shoes: "레더 첼시부츠", bag: "스퀘어 토트백", acc: "모던 울 머플러",
                desc: "쌀쌀한 환절기입니다. 체온 유지를 위해 무드 있는 트렌치코트를 입혀드렸습니다."
            };
        } else if (t >= 9 && t < 12) {
            outfit = {
                top: "울 케이블 니트", bottom: "골덴 와이드 바지", outer: "헤비 레더 자켓",
                shoes: "스웨이드 워커", bag: "레더 메신저백", acc: "니트 비니 모자",
                desc: "기온이 낮아 옷깃을 여미게 되는 날씨입니다. 두꺼운 니트와 레더 가죽 자켓을 매칭했습니다."
            };
        } else if (t >= 5 && t < 9) {
            outfit = {
                top: "기모 맨투맨 + 발열내의", bottom: "웜 테크 슬랙스", outer: "더블 브레스트 울 코트",
                shoes: "가죽 드레스 슈즈", bag: "브리프 케이스", acc: "헤링본 울 장갑",
                desc: "겨울 초입의 날씨입니다. 세련되면서도 매우 따뜻한 울 코트를 장착시켰습니다."
            };
        } else {
            outfit = {
                top: "특기모 오버 후드티", bottom: "조거 기모 팬츠", outer: "프리미엄 구스다운 롱패딩",
                shoes: "보아 방한 슈즈", bag: "미니 패딩백", acc: "캐시미어 목도리",
                desc: "매우 매서운 한파 날씨입니다. 생존형 무적의 구스다운 롱패딩과 기모 세트로 중무장 피팅!"
            };
        }

        // 성별에 따른 명칭 보정
        if(selectedGender === "male") {
            if(outfit.bottom.includes("숏팬츠")) outfit.bottom = "남성 5부 반바지";
        }

        // 1. 대시보드 그리드 텍스트 변경
        if(document.getElementById('rec-item-1')) {
            document.getElementById('rec-item-1').innerText = outfit.top;
            document.getElementById('rec-item-2').innerText = outfit.bottom;
            document.getElementById('rec-item-3').innerText = outfit.outer;
            document.getElementById('rec-item-4').innerText = outfit.shoes;
            document.getElementById('rec-item-5').innerText = outfit.bag;
            document.getElementById('rec-item-6').innerText = outfit.acc;
            document.getElementById('recommendDesc').innerHTML = `<strong>🤖 AI 추천 결과:</strong><br>${outfit.desc}`;
        }

        // 2. 하단 아바타 레이어 자동 실착 피팅 연동
        if(document.getElementById('fitOuter')) {
            document.getElementById('fitOuter').innerText = outfit.outer;
            document.getElementById('fitTop').innerText = outfit.top;
            document.getElementById('fitBottom').innerText = outfit.bottom;
            document.getElementById('fitShoes').innerText = outfit.shoes;
            document.getElementById('fitAcc').innerText = outfit.acc;
        }

        // 아바타 그래픽 상태 변화 효과 적용
        if(avatarGraphic) {
            avatarGraphic.innerText = selectedGender === "female" ? "🙋‍♀️" : "🙋‍♂️";
        }
    });
}

// 사계절 구매 링크 새창 활성화 로직
document.querySelectorAll('.buy-btn').forEach(buybtn => {
    buybtn.addEventListener('click', () => {
        const season = document.querySelector('.active-season').dataset.season;
        let link = season === 'spring' ? 'https://www.musinsa.com' :
                   season === 'summer' ? 'https://www.29cm.co.kr' :
                   season === 'autumn' ? 'https://store.musinsa.com' : 'https://www.zara.com/kr/';
        window.open(link, '_blank');
    });
});
