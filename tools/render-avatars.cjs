/* 빌드타임: react-humaaans 피규어를 기온대×성별별로 색상까지 박아 정적 SVG로 추출.
   결과 → img/avatar/{female|male}-{0..7}.svg  (앱은 React 없이 이 SVG만 교체 사용)
   실행: node tools/render-avatars.cjs */
global.window = global.window || global;
global.document = global.document || { createElement: () => ({ style: {} }), getElementById: () => null };
global.navigator = global.navigator || { userAgent: 'node' };

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const H = require('react-humaaans');
const fs = require('fs');
const path = require('path');

// coordinateData.js 와 동일한 8개 기온대 (상의/하의/아우터 이름만)
const BANDS = [
  { top: '린넨 반팔 티셔츠',   bottom: '린넨 숏팬츠',       outer: null },
  { top: '세미오버핏 반팔 셔츠', bottom: '캐주얼 면바지',     outer: null },
  { top: '오버핏 옥스포드 셔츠', bottom: '라이트 슬랙스',     outer: '가벼운 가디건' },
  { top: '헤비웨이트 맨투맨',   bottom: '스트레이트 청바지',  outer: '미니멀 자켓' },
  { top: '도톰한 하프넥 니트',  bottom: '테이퍼드 코튼 팬츠', outer: '클래식 트렌치코트' },
  { top: '울 케이블 니트',      bottom: '골덴 와이드 바지',   outer: '헤비 레더 자켓' },
  { top: '기모 맨투맨',         bottom: '웜 테크 슬랙스',     outer: '더블 브레스트 울 코트' },
  { top: '특기모 오버 후드티',  bottom: '조거 기모 팬츠',     outer: '프리미엄 구스다운 롱패딩' },
];

const shirtColor = (n) =>
  n.includes('니트') ? '#9a5b46' :
  n.includes('후드') ? '#6b7280' :
  n.includes('맨투맨') ? '#2f3e57' :
  n.includes('셔츠') ? '#9fb0c3' : '#5aa9e0';

const pantColor = (n) =>
  (n.includes('청') || n.includes('데님')) ? '#3b5b8c' :
  n.includes('슬랙스') ? '#3a3f4a' :
  n.includes('조거') ? '#36393f' :
  (n.includes('면') || n.includes('숏') || n.includes('코튼')) ? '#8a6f4a' : '#6f6150';

const coatColor = (n) =>
  !n ? '#7a5b3a' :
  n.includes('패딩') ? '#2f3e57' :
  n.includes('레더') ? '#4a3a2a' :
  n.includes('트렌치') ? '#c4a87f' :
  n.includes('가디건') ? '#b59b6e' :
  n.includes('코트') ? '#5b4636' : '#3a3a3a';

// 걷는 포즈가 아닌 "자세를 잡은" 모습
//  · 여성 Standing12: 정면으로 발 모으고 선 모델 스탠스
//  · 남성 Standing19: 손을 내밀어 코디를 보여주는 presenting 포즈
const figureFor = (gender /* , hasOuter */) =>
  gender === 'male' ? H.Standing19 : H.Standing12;

const outDir = path.join(__dirname, '..', 'img', 'avatar');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const gender of ['female', 'male']) {
  BANDS.forEach((b, i) => {
    const Fig = figureFor(gender, !!b.outer);
    const props = {
      height: 480,
      skinColor: '#f0c9a0',
      hairColor: gender === 'male' ? '#2b2b2b' : '#4b3a2a',
      shirtColor: shirtColor(b.top),
      pantColor: pantColor(b.bottom),
      coatColor: coatColor(b.outer),
      shoeColor: '#3a3a3a',
      hatColor: '#ffffff',
    };
    let markup = renderToStaticMarkup(React.createElement(Fig, props));
    let svg = (markup.match(/<svg[\s\S]*<\/svg>/) || [markup])[0];
    // standalone SVG 로 쓰려면 네임스페이스 필요
    if (!/xmlns=/.test(svg)) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    fs.writeFileSync(path.join(outDir, `${gender}-${i}.svg`), svg);
    count++;
  });
}
console.log(`wrote ${count} avatar SVGs to img/avatar/`);
