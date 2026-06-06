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

// 단일 소스: data/coordinateData.js 에서 기온대 가먼트명을 그대로 가져온다 (중복 제거)
const C = require(path.join(__dirname, '..', 'data', 'coordinateData.js'));
const BANDS = C.COORDINATES.map((b) => ({
  top: (C.garmentById[b.items.top] || {}).name || '',
  bottom: (C.garmentById[b.items.bottom] || {}).name || '',
  outer: b.items.outer ? ((C.garmentById[b.items.outer] || {}).name || null) : null,
}));

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
