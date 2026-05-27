const box = document.getElementById('box');
const slider = box.querySelector('.slider');
const dlwjsbtn = document.getElementById('dlwjsbtn');
const ekdmabtn = document.getElementById('ekdmabtn');

//무한 슬라이드 세팅
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
    }
}

// 2. 5초(5000ms)마다 자동으로 nextSlide 함수 실행
let slideInterval = setInterval(nextSlide, 5000);

//3. 자동 슬라이드 타이머를 리셋하는 함수
//(버튼을 누르자마자 다음 사진으로 자동으로 전환되는 현상을 방지)
function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

//다음 버튼 클릭
ekdmabtn.addEventListener('click', () => {
    nextSlide();
    resetSlideInterval(); //사용자 조작시 타이머 리셋
});

//이전 버튼 클릭
dlwjsbtn.addEventListener('click', () => {
    prevSlide();
    resetSlideInterval(); //사용자 조작시 타이머 리셋
});
//계절 버튼
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
const API_KEY = "8576ca6cc1758255ca9250ce92660339"; //날씨 api 키

//날씨 api 작동 코드
async function getWeather() {

    const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}&units=metric&lang=kr`;

    try {
        const response = await axios.get(url);
        
        const temp = response.data.main.temp;

        const weather = response.data.weather[0].description;
        
        console.log(response.data);

        console.log("온도:", response.data.main.temp);
        console.log("날씨:", response.data.weather[0].description);

        document.getElementById('weather').textContent =
            `${temp}°C · ${weather}`;

    } catch (err) {
        console.log(err.response?.data || err.message);
        document.getElementById('weather').textContent =
        '날씨 불러오기 실패';
    }
}

getWeather();


//사이트로 넘어가게 하는 기능 .buy-btn은 변수명, if문은 사이트가 사계절에 따라서 다른 사이트로 이동하게 하는 코드
document.querySelectorAll('.buy-btn').forEach(buybtn => {
    buybtn.addEventListener('click', () => {

        const season = document
            .querySelector('.active-season')
            .dataset.season;

        let link;
        
        if (season === 'spring') {
            link = 'https://www.musinsa.com';
        } else if (season === 'summer') {
            link = 'https://www.29cm.co.kr';
        } else if (season === 'autumn') {
            link = 'https://store.musinsa.com';
        } else {
            link = 'https://www.zara.com/kr/';
        }

        window.open(link, '_blank');
    });
});
