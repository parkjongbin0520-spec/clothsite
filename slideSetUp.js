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

    // 1. 배경이 바뀔 메인 컨테이너와 계절 버튼들을 스크립트로 가져옵니다. 
      const mainApp = document.getElementById('mainApp'); 
      const seasonButtons = document.querySelectorAll('.season-btn'); 
      // 2. 각 버튼마다 클릭 이벤트(눌렀을 때 일어날 일)를 연결합니다. 
      seasonButtons.forEach(button => { 
        button.addEventListener('click', () => { 
          // [기능 1] 현재 클릭한 버튼만 주황색으로 활성화하고, 나머지는 원래대로 되돌립니다. 
          seasonButtons.forEach(btn => btn.classList.remove('active-season')); 
          button.classList.add('active-season'); 
          // [기능 2] 버튼의 data-season 값(spring, summer, autumn, winter)을 읽어옵니다. 
          const selectedSeason = button.getAttribute('data-season'); 
          // [기능 3] 메인 박스에서 기존 계절 클래스를 지우고, 새로 클릭한 계절 클래스를 넣어 배경색을 바꿉니다. 
          mainApp.classList.remove('spring', 'summer', 'autumn', 'winter');
          mainApp.classList.add(selectedSeason); 
}); 
}); 
