/* ==========================================================
   코디 추천 데이터 (재사용 가능한 아이템 레지스트리 구조)
   - GARMENTS: 모든 의류를 id 로 식별하는 단일 레지스트리
       · category 는 아바타 레이어 순서와 동일한 'top' | 'bottom' | 'outer'
       · avatarLayer: 향후 "아바타 옷 입히기"용 투명 PNG 경로 (지금은 null = 이모지 폴백)
   - COORDINATES: 기온대 → 가먼트 "id" 참조 (문자열 복붙 X)
   - resolveOutfit(): 기온대 + 성별을 실제 가먼트 객체로 해석
   카탈로그(productData.js)와 동일한 { id, category, name, avatarLayer } 모델을 공유한다.
   ========================================================== */

const CATEGORY = { TOP: "top", BOTTOM: "bottom", OUTER: "outer" };

/** 가먼트 1개를 만든다 (썸네일/커머스 정보는 카탈로그 아이템이 따로 보유) */
function garment(id, category, name, avatarLayer = null) {
  return { id, category, name, avatarLayer };
}

/* --- 가먼트 레지스트리 (옷 1벌 = 객체 1개, 어디서든 id 로 재사용) --- */
const GARMENTS = [
  // ── 상의 ──
  garment("t-linen-tee",     CATEGORY.TOP, "린넨 반팔 티셔츠"),
  garment("t-semi-shirt",    CATEGORY.TOP, "세미오버핏 반팔 셔츠"),
  garment("t-oxford",        CATEGORY.TOP, "오버핏 옥스포드 셔츠"),
  garment("t-heavy-mtm",     CATEGORY.TOP, "헤비웨이트 맨투맨"),
  garment("t-halfneck-knit", CATEGORY.TOP, "도톰한 하프넥 니트"),
  garment("t-cable-knit",    CATEGORY.TOP, "울 케이블 니트"),
  garment("t-fleece-mtm",    CATEGORY.TOP, "기모 맨투맨 + 발열내의"),
  garment("t-hood",          CATEGORY.TOP, "특기모 오버 후드티"),

  // ── 하의 ──
  garment("b-linen-shorts",  CATEGORY.BOTTOM, "린넨 숏팬츠"),
  garment("b-mens-shorts",   CATEGORY.BOTTOM, "남성 5부 반바지"), // 폭염 시 남성 변형
  garment("b-cotton-pants",  CATEGORY.BOTTOM, "캐주얼 면바지"),
  garment("b-light-slacks",  CATEGORY.BOTTOM, "라이트 슬랙스"),
  garment("b-straight-jeans",CATEGORY.BOTTOM, "스트레이트 청바지"),
  garment("b-tapered",       CATEGORY.BOTTOM, "테이퍼드 코튼 팬츠"),
  garment("b-corduroy-wide", CATEGORY.BOTTOM, "골덴 와이드 바지"),
  garment("b-warm-slacks",   CATEGORY.BOTTOM, "웜 테크 슬랙스"),
  garment("b-jogger",        CATEGORY.BOTTOM, "조거 기모 팬츠"),

  // ── 아우터 ──
  garment("o-cardigan",  CATEGORY.OUTER, "가벼운 가디건"),
  garment("o-jacket",    CATEGORY.OUTER, "미니멀 자켓"),
  garment("o-trench",    CATEGORY.OUTER, "클래식 트렌치코트"),
  garment("o-leather",   CATEGORY.OUTER, "헤비 레더 자켓"),
  garment("o-wool-coat", CATEGORY.OUTER, "더블 브레스트 울 코트"),
  garment("o-padding",   CATEGORY.OUTER, "프리미엄 구스다운 롱패딩"),
];

/** id → 가먼트 빠른 조회 */
const garmentById = Object.fromEntries(GARMENTS.map((g) => [g.id, g]));

/* --- 기온대 → 가먼트 id 참조 (outer:null = 아우터 없음) --- */
const COORDINATES = [
  {
    min: 28, max: Infinity,
    items: { top: "t-linen-tee", bottom: "b-linen-shorts", outer: null },
    itemsMale: { bottom: "b-mens-shorts" },
    desc: "폭염 날씨입니다. 통풍이 잘되는 시원한 소재로 가볍게 입혀드렸습니다.",
  },
  {
    min: 23, max: 28,
    items: { top: "t-semi-shirt", bottom: "b-cotton-pants", outer: null },
    desc: "초여름 날씨입니다. 깔끔하면서도 더위를 피할 수 있는 미니멀 룩 완성!",
  },
  {
    min: 20, max: 23,
    items: { top: "t-oxford", bottom: "b-light-slacks", outer: "o-cardigan" },
    desc: "활동하기 최적인 선선한 기온입니다. 셔츠와 가디건 조합 레이어드 피팅 완료.",
  },
  {
    min: 17, max: 20,
    items: { top: "t-heavy-mtm", bottom: "b-straight-jeans", outer: "o-jacket" },
    desc: "완연한 봄/가을 기후입니다. 스타일리시한 무드의 아우터 자켓을 레이어드 착용했습니다.",
  },
  {
    min: 12, max: 17,
    items: { top: "t-halfneck-knit", bottom: "b-tapered", outer: "o-trench" },
    desc: "쌀쌀한 환절기입니다. 체온 유지를 위해 무드 있는 트렌치코트를 입혀드렸습니다.",
  },
  {
    min: 9, max: 12,
    items: { top: "t-cable-knit", bottom: "b-corduroy-wide", outer: "o-leather" },
    desc: "기온이 낮아 옷깃을 여미게 되는 날씨입니다. 두꺼운 니트와 레더 가죽 자켓을 매칭했습니다.",
  },
  {
    min: 5, max: 9,
    items: { top: "t-fleece-mtm", bottom: "b-warm-slacks", outer: "o-wool-coat" },
    desc: "겨울 초입의 날씨입니다. 세련되면서도 매우 따뜻한 울 코트를 장착시켰습니다.",
  },
  {
    min: -Infinity, max: 5,
    items: { top: "t-hood", bottom: "b-jogger", outer: "o-padding" },
    desc: "매우 매서운 한파 날씨입니다. 생존형 무적의 구스다운 롱패딩과 기모 세트로 중무장 피팅!",
  },
];

/** 기온(℃)에 해당하는 코디 밴드를 찾는다 */
function getCoordinateByTemp(temp) {
  return COORDINATES.find((c) => temp >= c.min && temp < c.max);
}

/**
 * 밴드 + 성별을 실제 가먼트 객체로 해석한다.
 * @returns {{ top:Object|null, bottom:Object|null, outer:Object|null, desc:string }}
 */
function resolveOutfit(band, gender = "female") {
  const pick = (slot) => {
    let id = band.items[slot];
    if (gender === "male" && band.itemsMale && band.itemsMale[slot]) {
      id = band.itemsMale[slot]; // 성별 변형은 데이터로 (런타임 문자열 분기 제거)
    }
    return id ? garmentById[id] : null;
  };
  return { top: pick("top"), bottom: pick("bottom"), outer: pick("outer"), desc: band.desc };
}
