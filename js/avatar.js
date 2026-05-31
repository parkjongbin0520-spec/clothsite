const AVATAR_API = "https://learn.codeit.kr/api/avatars/1";

// DOM 캐시
const skinEl = document.getElementById("layer-skin");
const hairEl = document.getElementById("layer-hair");
const topEl = document.getElementById("layer-top");
const bottomEl = document.getElementById("layer-bottom");
const outerEl = document.getElementById("layer-outer");
const accEl = document.getElementById("layer-acc");

// 옷 매핑
const CLOTH_MAP = {
  tshirtBasic: "/img/top/tshirtBasic.png",
  hoodie: "/img/top/hoodie.png",
  jacketLeather: "/img/outer/jacketLeather.png",
  knitVest: "/img/top/knitVest.png",
  dressFormal: "/img/set/dressFormal.png",
};

const HAIR_MAP = {
  short1: "/img/hair/short1.png",
  long1: "/img/hair/long1.png",
  none: null,
};

async function loadAvatar() {
  const res = await fetch(AVATAR_API);
  const avatar = await res.json();

  renderAvatar(avatar);
}

function renderAvatar(a) {
  if (skinEl) skinEl.src = `/img/skin/${a.skin}.png`;
  if (hairEl) hairEl.src = HAIR_MAP[a.hairType] || "";
  if (topEl) topEl.src = CLOTH_MAP[a.clothes] || "";
  if (accEl) accEl.src = `/img/acc/${a.accessories}.png`;
}

// 실행
loadAvatar();