// "포즈" 느낌 후보 피규어만 크게 렌더해 비교
global.window = global.window || global;
global.document = global.document || { createElement: () => ({ style: {} }), getElementById: () => null };
global.navigator = global.navigator || { userAgent: 'node' };
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const H = require('react-humaaans');
const fs = require('fs');

const cands = [3, 7, 9, 12, 19, 20, 21, 22];
const colors = { height: 300, skinColor: '#f0c9a0', hairColor: '#3a2a1a', shirtColor: '#4a90d9', pantColor: '#39414f', coatColor: '#7a5b3a', shoeColor: '#2f2f2f', hatColor: '#ffffff' };
const cards = cands.map((i) => {
  const svg = renderToStaticMarkup(React.createElement(H['Standing' + i], colors));
  return `<figure style="margin:10px;text-align:center"><figcaption style="font:13px sans-serif;font-weight:700">Standing${i}</figcaption>${svg}</figure>`;
}).join('');
fs.writeFileSync(__dirname + '/../_poses.html', `<!doctype html><meta charset=utf8><body style="display:flex;flex-wrap:wrap;align-items:flex-end;background:#fff;margin:0">${cards}</body>`);
console.log('wrote candidates:', cands.join(','));
