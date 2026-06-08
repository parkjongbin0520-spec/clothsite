/* ==========================================================
   build-closet.cjs — '옷 사진들' 폴더 → data/closetData.js 생성
   - 폴더 구조(계절/카테고리/상품/색상 이미지)를 스캔해 카드 데이터로 변환
   - '옷 사진들 출처와 가격.txt' 를 파싱해 상품별 출처 URL · 가격을 매칭
   - 출력: data/closetData.js (Product 인스턴스 배열 CLOSET)
   재생성: node tools/build-closet.cjs
   ========================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CLOSET_DIR = path.join(ROOT, "옷 사진들");
const TXT = path.join(CLOSET_DIR, "옷 사진들 출처와 가격.txt");
const OUT = path.join(ROOT, "data", "closetData.js");

const IMG_RE = /\.(webp|jpe?g|png)$/i;

// 폴더명 → 계절 배열 (봄 가을은 spring·autumn 두 탭에 모두 노출)
const SEASON_MAP = {
  "봄 가을": ["spring", "autumn"],
  "여름": ["summer"],
  "겨울": ["winter"],
};
// 폴더명 → Product.category (catalogConfig.js 의 catalogKey 와 일치)
const CAT_MAP = { "상의": "TOP", "하의": "PANTS", "셋업": "SETUP", "아우터": "OUTER" };

// 출처 URL 호스트 → 표시용 몰 이름 (카드 brand 자리 = "어디서 파는지")
const MALLS = [
  [/kream\.co\.kr/i, "KREAM"],
  [/spao\.com/i, "SPAO"],
  [/musinsa\.com/i, "무신사"],
];
const mallOf = (url) => (MALLS.find(([re]) => re.test(url)) || [null, "무신사"])[1];

// --- 이름 정규화 + 바이그램 유사도 (폴더명 ↔ txt 상품명 오탈자 매칭) ---
const norm = (s) => s.toLowerCase().replace(/\s+/g, "").replace(/[()&]/g, "");
function bigrams(s) {
  const g = new Set();
  for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2));
  return g;
}
function similarity(a, b) {
  if (a === b) return 1;
  const A = bigrams(a), B = bigrams(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return (2 * inter) / (A.size + B.size);
}

// --- 출처 txt 파싱 (계절/카테고리 섹션 헤더를 함께 추적) ---
// txt 헤더: "- 봄/가을" · "- 여름" · "- 겨울" / "[상의]" · "[하의]" · "[셋업]" · "[아우터]"
const TXT_SEASON = { "봄": ["spring", "autumn"], "여름": ["summer"], "겨울": ["winter"] };
const TXT_CAT = CAT_MAP;
const sources = [];
let curSeasons = null, curCat = null;
for (const raw of fs.readFileSync(TXT, "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  const sh = line.match(/^-\s*(봄|여름|겨울)/);
  if (sh) { curSeasons = TXT_SEASON[sh[1]]; continue; }
  const ch = line.match(/^\[(상의|하의|셋업|아우터)\]/);
  if (ch) { curCat = TXT_CAT[ch[1]]; continue; }
  const m = line.match(/^(.*?)\s*-\s*(https?:\/\/\S+)\s*$/);
  if (!m) continue;
  let left = m[1];
  const url = m[2];
  let price = null;
  const pm = left.match(/([\d,]+)\s*원/);
  if (pm) { price = parseInt(pm[1].replace(/,/g, ""), 10); left = left.slice(0, pm.index); }
  const name = left.replace(/약\s*$/, "").trim();
  if (name) sources.push({ name, norm: norm(name), price, url, mall: mallOf(url), seasons: curSeasons, cat: curCat });
}

/** 최적 출처 찾기: ① 같은 계절·카테고리 안에서 우선 매칭(느슨), ② 실패 시
    전체에서 거의 동일한 이름만 매칭(엄격). txt 의 카테고리 오기재·오탈자를 모두 흡수. */
function bestMatch(productName, candidates, threshold) {
  const n = norm(productName);
  let best = null, score = 0;
  for (const s of candidates) {
    const sc = similarity(n, s.norm);
    if (sc > score) { score = sc; best = s; }
  }
  return score >= threshold ? best : null;
}
function findSource(productName, seasons, catalogKey) {
  const sameSection = sources.filter(
    (s) => s.cat === catalogKey && s.seasons && s.seasons.some((x) => seasons.includes(x)));
  return bestMatch(productName, sameSection, 0.5)
      || bestMatch(productName, sources, 0.72);
}

// --- 폴더 스캔 ---
const listImages = (dir) => fs.readdirSync(dir).filter((f) => IMG_RE.test(f)).sort();
// encodeURI 는 / 는 보존하되 공백·한글을 인코딩한다. 정적 서버에서 경로가 갈리지 않도록
// & # ? 도 추가로 이스케이프(파일명에 & 포함된 셋업 등).
const toUrl = (abs) => encodeURI(path.relative(ROOT, abs).split(path.sep).join("/"))
  .replace(/&/g, "%26").replace(/#/g, "%23").replace(/\?/g, "%3F");

const products = [];
const idCount = {};
let unmatched = [];
for (const seasonDir of fs.readdirSync(CLOSET_DIR)) {
  const seasons = SEASON_MAP[seasonDir];
  const seasonAbs = path.join(CLOSET_DIR, seasonDir);
  if (!seasons || !fs.statSync(seasonAbs).isDirectory()) continue;
  for (const catDir of fs.readdirSync(seasonAbs)) {
    const catalogKey = CAT_MAP[catDir];
    const catAbs = path.join(seasonAbs, catDir);
    if (!catalogKey || !fs.statSync(catAbs).isDirectory()) continue;
    for (const entry of fs.readdirSync(catAbs)) {
      const entryAbs = path.join(catAbs, entry);
      const st = fs.statSync(entryAbs);
      let name, images;
      if (st.isDirectory()) {
        name = entry;
        images = listImages(entryAbs).map((f) => toUrl(path.join(entryAbs, f)));
      } else if (IMG_RE.test(entry)) {
        name = entry.replace(IMG_RE, "");
        images = [toUrl(entryAbs)];
      } else continue;
      if (!images.length) continue;

      const src = findSource(name, seasons, catalogKey);
      if (!src) unmatched.push(`${seasonDir}/${catDir}/${name}`);
      const key = `${catalogKey.toLowerCase()}-${seasons[0]}`;
      idCount[key] = (idCount[key] || 0) + 1;
      const id = `${key}-${String(idCount[key]).padStart(2, "0")}`;

      products.push({
        id, category: catalogKey, season: seasons, name,
        brand: src ? src.mall : "무신사",
        price: src ? src.price : null,
        imageUrl: images[0],
        shopUrl: src ? src.url : null, // null → Product 가 검색 URL 자동 생성
        colors: images.length,
      });
    }
  }
}

// --- 출력 ---
const lines = products.map((p) => {
  const opt = {
    id: p.id, category: p.category, season: p.season, brand: p.brand,
    name: p.name, price: p.price, imageUrl: p.imageUrl,
  };
  if (p.shopUrl) opt.shopUrl = p.shopUrl;
  return `  new Product(${JSON.stringify(opt)}),`;
});

const out = `/* ==========================================================
   closetData.js — AUTO-GENERATED, 직접 수정 금지
   생성: node tools/build-closet.cjs
   소스: '옷 사진들/' 폴더 + '옷 사진들 출처와 가격.txt'
   - 각 카드는 계절(봄 가을 → spring·autumn) · 카테고리로 분류된다.
   - shopUrl = 실제 출처(무신사·KREAM·SPAO) → 카드 클릭 시 새 탭 이동.
   - Product 클래스는 productData.js 에 정의됨(이 파일보다 먼저 로드).
   상품 ${products.length}개 · 출처 미매칭 ${unmatched.length}개(검색 URL 폴백)
   ========================================================== */
const CLOSET = [
${lines.join("\n")}
];

/* 카탈로그 렌더 소스를 CLOSET 으로 사용 + 위시리스트 조회용 productById 등록 */
if (typeof productById !== "undefined") CLOSET.forEach((p) => { productById[p.id] = p; });
`;

fs.writeFileSync(OUT, out, "utf8");
console.log(`✓ ${OUT}`);
console.log(`  상품 ${products.length}개 / 출처 매칭 ${products.length - unmatched.length}개`);
if (unmatched.length) console.log("  미매칭(검색 URL 폴백):\n   - " + unmatched.join("\n   - "));
