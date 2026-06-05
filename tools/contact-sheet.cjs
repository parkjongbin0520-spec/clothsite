// react-humaaans 의 모든 Standing 피규어를 정적 SVG 컨택트 시트로 렌더 (선택용)
// react-humaaans 메인은 브라우저 UMD 번들 → Node 용 최소 글로벌 셰임
global.window = global.window || global;
global.document = global.document || { createElement: () => ({ style: {} }), getElementById: () => null };
global.navigator = global.navigator || { userAgent: 'node' };

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const H = require('react-humaaans');
const fs = require('fs');

const names = Object.keys(H)
  .filter((k) => /^Standing\d+$/.test(k))
  .sort((a, b) => (+a.replace(/\D/g, '')) - (+b.replace(/\D/g, '')));

const colors = {
  height: 140,
  skinColor: '#f0c9a0', hairColor: '#3a2a1a',
  shirtColor: '#4a90d9', pantColor: '#39414f',
  coatColor: '#7a5b3a', shoeColor: '#2f2f2f',
  hatColor: '#ffffff', objectColor: '#cccccc', wheelchairColor: '#dddddd',
};

const cards = names.map((n) => {
  let svg;
  try { svg = renderToStaticMarkup(React.createElement(H[n], colors)); }
  catch (e) { svg = '<div style="width:160px">ERR ' + e.message + '</div>'; }
  return `<figure style="margin:6px;text-align:center"><figcaption style="font:11px sans-serif">${n}</figcaption>${svg}</figure>`;
}).join('');

fs.writeFileSync(
  __dirname + '/../_contact.html',
  `<!doctype html><meta charset=utf8><body style="display:flex;flex-wrap:wrap;align-items:flex-end;background:#fff;margin:0">${cards}</body>`
);
console.log('figures:', names.length, '=>', names.join(','));
