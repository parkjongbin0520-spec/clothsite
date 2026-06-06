/* ==========================================================
   찜(위시리스트) — localStorage 기반, 외부 서버 없이 동작
   - window.Wishlist: 저장소 API (ids/has/toggle/remove/count/onChange)
   - 헤더 배지(♡ N) + 찜목록 패널(글래스 모달) 렌더
   상품 조회는 productData.js 의 productById 전역을 사용한다.
   ========================================================== */
(function () {
  const KEY = "ipeumanhae-wishlist";
  let mem = null; // localStorage 사용 불가 시(Safari 사생활 보호 등) 세션 메모리 폴백
  const read = () => {
    if (mem) return mem;
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };
  const cbs = [];
  const emit = () => cbs.forEach((cb) => cb());
  const write = (arr) => {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); mem = null; }
    catch (e) { mem = arr; } // 영속 저장 실패 시 세션 동안 메모리에 유지 → 찜 동작은 유지
    emit();
  };

  window.Wishlist = {
    ids: read,
    has: (id) => read().includes(id),
    toggle(id) {
      const a = read();
      write(a.includes(id) ? a.filter((x) => x !== id) : [...a, id]);
      return read().includes(id);
    },
    remove: (id) => write(read().filter((x) => x !== id)),
    count: () => read().length,
    onChange: (cb) => cbs.push(cb),
  };

  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("wishBtn");
    const countEl = document.getElementById("wishCount");
    const panel = document.getElementById("wishModal");
    const listEl = document.getElementById("wishList");
    const closeBtn = document.getElementById("wishClose");
    const scrim = document.getElementById("wishScrim");
    if (!panel || !listEl) return;

    const byId = (id) => (typeof productById !== "undefined" ? productById[id] : null);

    function renderBadge() {
      if (countEl) countEl.textContent = Wishlist.count();
      if (openBtn) openBtn.classList.toggle("has-items", Wishlist.count() > 0);
    }

    function renderList() {
      const ids = Wishlist.ids();
      if (!ids.length) {
        listEl.innerHTML = '<li class="wish-empty">아직 찜한 상품이 없어요. 코디 카드의 ♡ 를 눌러보세요.</li>';
        return;
      }
      listEl.innerHTML = ids.map((id) => {
        const p = byId(id);
        if (!p) return "";
        return `<li class="wish-item">
            <img class="wish-item__thumb" src="${p.imageUrl}" alt="" />
            <div class="wish-item__info">
              <span class="wish-item__brand">${p.brand}</span>
              <span class="wish-item__name">${p.name}</span>
              <span class="wish-item__price">${p.formattedPrice}</span>
            </div>
            <a class="wish-item__buy" href="${p.shopUrl}" target="_blank" rel="noopener noreferrer">구매</a>
            <button class="wish-item__remove" data-pid="${id}" aria-label="찜 삭제">&times;</button>
          </li>`;
      }).join("");
    }

    let lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      renderList();
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (closeBtn) requestAnimationFrame(() => closeBtn.focus());
    }
    function close() {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (scrim) scrim.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("is-open")) close();
    });
    listEl.addEventListener("click", (e) => {
      const rm = e.target.closest(".wish-item__remove");
      if (rm) Wishlist.remove(rm.dataset.pid);
    });

    Wishlist.onChange(() => {
      renderBadge();
      if (panel.classList.contains("is-open")) renderList();
    });
    renderBadge();
  });
})();
