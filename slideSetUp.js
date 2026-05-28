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
//박스//
// 'categoryTabs' 안에 있는 모든 탭 버튼(.tab-btn)을 선택합니다.
const tabButtons = document.querySelectorAll('#categoryTabs .tab-btn');


