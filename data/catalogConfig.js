/* ==========================================================
   카탈로그 카테고리 — 단일 설정값
   - 카탈로그 존(섹션 B) 동적 생성, 네이버 쇼핑 fetch 쿼리, 코디 매핑이
     모두 이 배열에서 파생된다. 카테고리 추가 = 항목 한 줄 추가.
   - catalogKey 는 Product.category(대문자)와 일치해야 함.
   - query / display 는 tools/fetch-products.cjs(네이버 쇼핑 API)에서 사용.
   ========================================================== */
const CATEGORIES = [
  { id: "top",    label: "상의",   catalogKey: "TOP",   eyebrow: "TOP",   query: "남성 셔츠",   display: 20 },
  { id: "bottom", label: "하의",   catalogKey: "PANTS", eyebrow: "PANTS", query: "남성 슬랙스", display: 20 },
  { id: "outer",  label: "아우터", catalogKey: "OUTER", eyebrow: "OUTER", query: "남성 자켓",   display: 20 },
  // 카테고리 추가 예) { id:"shoes", label:"신발", catalogKey:"SHOES", eyebrow:"SHOES", query:"스니커즈", display:20 },
];

/* Node(fetch 스크립트)와 데이터 공유. 브라우저에선 무시됨. */
if (typeof module !== "undefined" && module.exports) module.exports = { CATEGORIES };
