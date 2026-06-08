/* ==========================================================
   상품 카탈로그 데이터 (재사용 가능한 객체지향 구조)
   - 무신사 / 29CM / 지그재그 등 커머스 상품 카드 구조를 분석해
     브랜드 · 상품명 · 판매가 · 정상가(할인) · 평점 · 리뷰수 · 태그를 모델링
   - Product 클래스 하나로 데이터 ↔ UI(카드) 렌더링을 일원화
   ========================================================== */

class Product {
  /**
   * @param {Object} opt
   * @param {string} opt.id          상품 고유 ID
   * @param {string} opt.category    카테고리 (TOP | PANTS | OUTER)
   * @param {string} opt.brand       브랜드명
   * @param {string} opt.name        상품명
   * @param {number} opt.price       현재 판매가 (원)
   * @param {number} [opt.originalPrice] 정상가 (할인 계산용, 없으면 할인 없음)
   * @param {string} opt.imageUrl    썸네일 이미지 URL
   * @param {number} [opt.rating]    평점 (0~5)
   * @param {number} [opt.reviewCount] 리뷰 수
   * @param {string[]} [opt.tags]    배지 태그 (예: "BEST", "무신사 랭킹")
   * @param {string} [opt.shopUrl]   구매 링크 (없으면 검색 URL 자동 생성)
   * @param {string} [opt.avatarLayer] 아바타 합성용 투명 PNG 경로 (코디 가먼트와 공유하는 모델)
   */
  constructor({
    id, category, brand, name, price,
    originalPrice = null, imageUrl,
    rating = 0, reviewCount = 0, tags = [], shopUrl = null,
    avatarLayer = null,
  }) {
    this.id = id;
    this.category = category;
    this.brand = brand;
    this.name = name;
    this.price = price;
    this.originalPrice = originalPrice;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.tags = tags;
    this.shopUrl = shopUrl || Product.buildSearchUrl(brand, name);
    this.avatarLayer = avatarLayer; // 향후 아바타 옷 입히기용 (기본 null)
  }

  /** 브랜드 + 상품명으로 커머스 검색 URL 생성 (원클릭 커머스 연동) */
  static buildSearchUrl(brand, name) {
    const q = encodeURIComponent(`${brand} ${name}`);
    return `https://www.musinsa.com/search/musinsa/integration?q=${q}`;
  }

  get hasDiscount() {
    return this.originalPrice != null && this.originalPrice > this.price;
  }

  get discountRate() {
    return this.hasDiscount
      ? Math.round((1 - this.price / this.originalPrice) * 100)
      : 0;
  }

  get formattedPrice() {
    return `${this.price.toLocaleString("ko-KR")}원`;
  }

  get formattedReviewCount() {
    return this.reviewCount.toLocaleString("ko-KR");
  }

  /** 카드 1장에 해당하는 HTML 문자열 반환 (시맨틱 <article>) */
  toCardHTML() {
    const tag = this.tags.length
      ? `<span class="card__tag">${this.tags[0]}</span>`
      : "";
    const discount = this.hasDiscount
      ? `<span class="card__discount">${this.discountRate}%</span>`
      : "";
    const rating = this.rating
      ? `<div class="card__meta">★ ${this.rating.toFixed(1)}
           <span class="card__review">리뷰 ${this.formattedReviewCount}</span>
         </div>`
      : "";

    return `
      <article class="card" data-id="${this.id}">
        <button type="button" class="card__wish" data-pid="${this.id}" aria-label="찜하기" aria-pressed="false">♡</button>
        <a class="card__thumb" href="${this.shopUrl}" target="_blank" rel="noopener noreferrer">
          <img class="card-img" src="${this.imageUrl}" alt="${this.brand} ${this.name}" loading="lazy" />
          ${tag}
        </a>
        <div class="card__body">
          <span class="card__brand">${this.brand}</span>
          <p class="card__name">${this.name}</p>
          <div class="card__price">${discount}<span class="card__now">${this.formattedPrice}</span></div>
          ${rating}
        </div>
      </article>`;
  }
}

/* --- 상품 데이터 (샘플) ---
   tools/fetch-products.cjs 가 네이버 쇼핑 결과로 아래 PRODUCTS 블록을 통째로 교체한다.
   (PRODUCTS:START ~ PRODUCTS:END 마커 사이를 자동 갱신) */
/* PRODUCTS:START */
const PRODUCTS = [
  // ── TOP / 상의 ──
  new Product({
    id: "top-01", category: "TOP", brand: "어반리프",
    name: "베이식 코튼 세미오버핏 반팔 티셔츠",
    price: 19900, originalPrice: 29000,
    imageUrl: "https://i.ibb.co/W4cthkKL/detail-6357599-17768432610933-big.png",
    rating: 4.8, reviewCount: 12483, tags: ["무신사 랭킹 1위"],
  }),
  new Product({
    id: "top-02", category: "TOP", brand: "스탠다드핏",
    name: "워싱 옥스포드 오버핏 셔츠",
    price: 32900, originalPrice: 49000,
    imageUrl: "https://i.ibb.co/W4cthkKL/detail-6357599-17768432610933-big.png",
    rating: 4.7, reviewCount: 8210, tags: ["BEST"],
  }),
  new Product({
    id: "top-03", category: "TOP", brand: "데이라이프",
    name: "헤비웨이트 크루넥 맨투맨",
    price: 28900, originalPrice: 39000,
    imageUrl: "https://i.ibb.co/W4cthkKL/detail-6357599-17768432610933-big.png",
    rating: 4.9, reviewCount: 5677, tags: ["신상"],
  }),

  // ── PANTS / 팬츠 ──
  new Product({
    id: "pants-01", category: "PANTS", brand: "필드그레이",
    name: "와이드 코튼 치노 팬츠",
    price: 36900, originalPrice: 52000,
    imageUrl: "https://i.ibb.co/MxBd6vY5/6371083-17772584866330-big.png",
    rating: 4.6, reviewCount: 9043, tags: ["단독"],
  }),
  new Product({
    id: "pants-02", category: "PANTS", brand: "노르딕무드",
    name: "원턱 스트레이트 슬랙스",
    price: 39900, originalPrice: 59000,
    imageUrl: "https://i.ibb.co/MxBd6vY5/6371083-17772584866330-big.png",
    rating: 4.8, reviewCount: 6321, tags: ["BEST"],
  }),
  new Product({
    id: "pants-03", category: "PANTS", brand: "코튼데이즈",
    name: "세미와이드 워싱 데님 팬츠",
    price: 42900, originalPrice: 58000,
    imageUrl: "https://i.ibb.co/MxBd6vY5/6371083-17772584866330-big.png",
    rating: 4.7, reviewCount: 7785, tags: ["무신사 추천"],
  }),

  // ── OUTER / 아우터 ──
  new Product({
    id: "outer-01", category: "OUTER", brand: "오버그라운드",
    name: "오버핏 발마칸 싱글 코트",
    price: 119000, originalPrice: 169000,
    imageUrl: "https://i.ibb.co/GQJ77TSJ/6101998-17739852939208-big.png",
    rating: 4.8, reviewCount: 3420, tags: ["FW 신상"],
  }),
  new Product({
    id: "outer-02", category: "OUTER", brand: "노르딕무드",
    name: "라이트 경량 패딩 자켓",
    price: 79000, originalPrice: 119000,
    imageUrl: "https://i.ibb.co/GQJ77TSJ/6101998-17739852939208-big.png",
    rating: 4.9, reviewCount: 8932, tags: ["무신사 랭킹"],
  }),
  new Product({
    id: "outer-03", category: "OUTER", brand: "어반리프",
    name: "워싱 데님 트러커 자켓",
    price: 58900, originalPrice: 79000,
    imageUrl: "https://i.ibb.co/GQJ77TSJ/6101998-17739852939208-big.png",
    rating: 4.6, reviewCount: 4517, tags: ["BEST"],
  }),
];
/* PRODUCTS:END */

/** id → 카탈로그 상품 빠른 조회 (코디 추천 → 실제 상품/구매링크 연결용) */
const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

const CATALOG_INITIAL = 8; // 행마다 처음 보여줄 카드 수 (나머지는 "더보기")

/** catalogConfig.CATEGORIES 기준으로 카탈로그 존을 동적 생성 (카테고리/카드 수 확장 자유) */
function renderCatalog(products = PRODUCTS) {
  const host = document.getElementById("catalogRows");
  if (!host || typeof CATEGORIES === "undefined") return;

  host.innerHTML = CATEGORIES.map((cat) => {
    const items = products.filter((p) => p.category === cat.catalogKey);
    const cards = items.map((p) => p.toCardHTML()).join("");
    const more = items.length > CATALOG_INITIAL
      ? `<button type="button" class="more-btn" aria-label="${cat.label} 더보기">더보기 +${items.length - CATALOG_INITIAL}</button>`
      : "";
    return `<article class="clothing-zone" data-cat="${cat.id}">
        <h3 class="zone-title">${cat.eyebrow} <span class="zone-label">${cat.label}</span></h3>
        <div class="card-row">${cards}</div>
        ${more}
      </article>`;
  }).join("");

  // 처음엔 CATALOG_INITIAL 개만 노출, 나머지는 숨김(더보기로 해제)
  host.querySelectorAll(".clothing-zone").forEach((zone) => {
    zone.querySelectorAll(".card").forEach((card, i) => {
      if (i >= CATALOG_INITIAL) card.hidden = true;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => renderCatalog());
