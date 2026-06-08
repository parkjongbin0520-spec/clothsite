/* ==========================================================
   네이버 쇼핑 검색 API → 카테고리별 실제 상품을 data/productData.js 의
   PRODUCTS 블록(마커 사이)으로 생성한다. 정적 사이트라 키는 빌드타임에만 사용.

   사전준비: 네이버 개발자센터(developers.naver.com) → 애플리케이션 등록 →
            "검색" API 사용 → Client ID/Secret 발급 → .env 에 저장(.env.example 참고)
   실행:    node tools/fetch-products.cjs
   ========================================================== */
const fs = require("fs");
const path = require("path");
const https = require("https");
const { CATEGORIES, SEASON_QUERY } = require("../data/catalogConfig.js");

// --- .env 간단 로더 (의존성 없이) ---
(() => {
  const p = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

const ID = process.env.NAVER_CLIENT_ID;
const SECRET = process.env.NAVER_CLIENT_SECRET;
if (!ID || !SECRET) {
  console.error("✗ NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 가 없습니다.");
  console.error("  네이버 개발자센터에서 '검색' API 앱 등록 후 .env 에 넣어주세요 (.env.example 참고).");
  process.exit(1);
}

function search(query, display) {
  const url =
    "https://openapi.naver.com/v1/search/shop.json" +
    `?query=${encodeURIComponent(query)}&display=${display}&sort=sim`;
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "X-Naver-Client-Id": ID, "X-Naver-Client-Secret": SECRET } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(d);
            j.items ? resolve(j.items) : reject(new Error(d));
          } catch (e) { reject(e); }
        });
      })
      .on("error", reject);
  });
}

const clean = (s = "") =>
  s.replace(/<[^>]*>/g, "")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

(async () => {
  const products = [];
  for (const season of Object.keys(SEASON_QUERY)) {
    for (const cat of CATEGORIES) {
      const q = `${SEASON_QUERY[season]} ${cat.query}`; // 예: "여름 셔츠"
      const items = await search(q, cat.display);
      items.forEach((it, i) => {
        products.push({
          id: `${cat.id}-${season}-${String(i + 1).padStart(2, "0")}`,
          category: cat.catalogKey,
          season: [season],
          brand: clean(it.brand || it.maker || it.mallName),
          name: clean(it.title),
          price: Number(it.lprice) || 0,
          originalPrice: it.hprice ? Number(it.hprice) : null,
          imageUrl: it.image,
          shopUrl: it.link, // 실제 상품 페이지 URL
          rating: 0, reviewCount: 0, tags: [],
        });
      });
      console.log(`  [${season}] ${cat.label}(${q}): ${items.length}개`);
    }
  }

  // productData.js 의 PRODUCTS:START ~ PRODUCTS:END 사이를 교체
  const file = path.join(__dirname, "..", "data", "productData.js");
  let src = fs.readFileSync(file, "utf8");
  const literal =
    "const PRODUCTS = [\n" +
    products.map((p) => "  new Product(" + JSON.stringify(p) + "),").join("\n") +
    "\n];";
  const re = /\/\* PRODUCTS:START \*\/[\s\S]*?\/\* PRODUCTS:END \*\//;
  if (!re.test(src)) {
    console.error("✗ productData.js 에서 PRODUCTS:START/END 마커를 찾지 못했습니다.");
    process.exit(1);
  }
  src = src.replace(re, `/* PRODUCTS:START */\n${literal}\n/* PRODUCTS:END */`);
  fs.writeFileSync(file, src);
  console.log(`✓ 총 ${products.length}개 상품을 data/productData.js 에 기록했습니다.`);
})().catch((e) => { console.error(e); process.exit(1); });
