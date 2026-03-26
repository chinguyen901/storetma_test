(function () {
  function money(c) {
    return ShopeeCatalog.formatMoney(c);
  }

  function pname(p) {
    return ShopeeCatalog.productName(p);
  }

  function renderProductCard(p, compact) {
    var name = pname(p);
    var btnText = ShopeeI18n.t('addToCart');
    if (compact) {
      return (
        '<div class="flex flex-col group">' +
        '<div class="aspect-square relative overflow-hidden bg-surface mb-2">' +
        '<img alt="" class="w-full h-full object-cover" src="' + p.image + '"/>' +
        (p.badge ? '<div class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-1">' + p.badge + '</div>' : '') +
        '</div>' +
        '<div class="px-1">' +
        '<div class="text-primary font-bold text-lg leading-none mb-1">' + money(p.price_cents) + '</div>' +
        '<div class="w-full bg-gray-200 h-3 rounded-full relative overflow-hidden"><div class="absolute inset-0 bg-primary w-2/3"></div></div>' +
        '<button type="button" data-add-cart="' + p.id + '" class="mt-2 w-full py-1.5 bg-[#EE4D2D] text-white text-xs font-bold rounded-sm hover:opacity-95">' + btnText + '</button>' +
        '</div></div>'
      );
    }
    return (
      '<div class="product-card bg-white rounded shadow-sm overflow-hidden flex flex-col relative group hover:shadow-md transition-shadow">' +
      '<div class="aspect-square relative overflow-hidden bg-surface-container-low">' +
      '<img alt="" class="w-full h-full object-cover" src="' + p.image + '"/>' +
      (p.badge ? '<div class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-1">' + p.badge + '</div>' : '') +
      '</div>' +
      '<div class="p-2 flex flex-col flex-1">' +
      '<h3 class="text-xs line-clamp-2 mb-2 text-on-surface leading-snug">' + name + '</h3>' +
      '<div class="mt-auto flex items-center justify-between">' +
      '<span class="text-primary font-bold text-base">' + money(p.price_cents) + '</span>' +
      '</div>' +
      '<button type="button" data-add-cart="' + p.id + '" class="mt-2 w-full py-2 bg-primary text-white font-bold text-xs rounded-sm">' + btnText + '</button>' +
      '</div></div>'
    );
  }

  function bindAddButtons() {
    document.querySelectorAll('[data-add-cart]').forEach(function (btn) {
      if (btn.dataset && btn.dataset.boundAddCart === '1') return;
      if (btn.dataset) btn.dataset.boundAddCart = '1';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-add-cart');
        animateFlyToCart(btn);
        ShopeeCart.addToCart(id, 1);
        updateBadge();
      });
    });
  }

  var DAILY_PAGE_INIT = 24;
  var DAILY_PAGE_MORE = 50;
  var dailyOffset = 0;
  var dailyHasMore = true;
  var currentCategory = 'all';
  var dailySearchTerm = '';
  var dailySortMode = 'relevance';
  var flashRequestToken = 0;
  var dailyRequestToken = 0;
  var productCache = {};

  function setActiveCategoryUI() {
    document.querySelectorAll('[data-category]').forEach(function (el) {
      var cat = el.getAttribute('data-category');
      var active = cat === currentCategory;
      el.classList.toggle('text-primary', active);
      el.classList.toggle('font-bold', active);
      var box = el.querySelector('div');
      if (box) {
        box.classList.toggle('bg-primary', active);
        box.classList.toggle('text-white', active);
        box.classList.toggle('ring-2', active);
        box.classList.toggle('ring-primary/20', active);
        box.classList.toggle('bg-surface-container-low', !active);
      }
      var icon = el.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.classList.toggle('text-white', active);
        icon.classList.toggle('text-primary', !active);
      }
    });
  }

  function renderDaily(reset, dailyList) {
    var dg = document.getElementById('dailyGrid');
    if (!dg) return;

    var list = Array.isArray(dailyList) ? dailyList.slice() : [];
    list = applyDailyControls(list);

    if (reset) {
      dailyOffset = 0;
      dg.innerHTML = '';
    }

    var pageSize = reset ? DAILY_PAGE_INIT : DAILY_PAGE_MORE;
    var next = list.slice(dailyOffset, dailyOffset + pageSize);
    dailyOffset += next.length;

    if (next.length) {
      dg.insertAdjacentHTML('beforeend', next.map(function (p) { return renderProductCard(p, false); }).join(''));
      bindAddButtons();
    }

    updateSeeMoreButton();
  }

  function applyDailyControls(list) {
    var out = list;
    var q = (dailySearchTerm || '').toLowerCase();
    if (q) {
      out = out.filter(function (p) {
        var name = pname(p).toLowerCase();
        return name.indexOf(q) !== -1;
      });
    }

    if (dailySortMode === 'priceAsc') {
      out.sort(function (a, b) { return a.price_cents - b.price_cents; });
    } else if (dailySortMode === 'priceDesc') {
      out.sort(function (a, b) { return b.price_cents - a.price_cents; });
    } else if (dailySortMode === 'nameAsc') {
      out.sort(function (a, b) { return pname(a).localeCompare(pname(b)); });
    }
    return out;
  }

  function getCategoryHeadingText() {
    if (currentCategory === 'all') return ShopeeI18n.t('dailyDiscover');
    var el = document.querySelector('[data-category="' + currentCategory + '"] [data-i18n]');
    if (!el) return ShopeeI18n.t('dailyDiscover');
    var key = el.getAttribute('data-i18n');
    return key ? ShopeeI18n.t(key) : ShopeeI18n.t('dailyDiscover');
  }

  function updateDailyHeading() {
    var heading = document.getElementById('dailyHeading');
    if (!heading) return;
    heading.textContent = getCategoryHeadingText();
  }

  function bindSeeMore() {
    var btn = document.getElementById('btnSeeMoreDaily');
    if (!btn) return;
    if (btn.dataset && btn.dataset.boundSeeMore === '1') return;
    if (btn.dataset) btn.dataset.boundSeeMore = '1';
    btn.addEventListener('click', function () {
      loadDailyMore();
    });
  }

  function bindCategories() {
    document.querySelectorAll('[data-category]').forEach(function (btn) {
      if (btn.dataset && btn.dataset.boundCategory === '1') return;
      if (btn.dataset) btn.dataset.boundCategory = '1';
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-category') || 'all';
        currentCategory = cat;
        setActiveCategoryUI();
        updateDailyHeading();
        renderGrids();
      });
    });
    setActiveCategoryUI();
    updateDailyHeading();
  }

  function bindDailyControls() {
    var search = document.getElementById('dailySearchInput');
    var searchBtn = document.getElementById('dailySearchBtn');
    var sort = document.getElementById('dailySortSelect');
    function runSearch() {
      dailySearchTerm = search ? (search.value || '') : '';
      renderGrids();
    }
    if (search && !(search.dataset && search.dataset.boundDailySearch === '1')) {
      if (search.dataset) search.dataset.boundDailySearch = '1';
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          runSearch();
        }
      });
    }
    if (searchBtn && !(searchBtn.dataset && searchBtn.dataset.boundDailySearchBtn === '1')) {
      if (searchBtn.dataset) searchBtn.dataset.boundDailySearchBtn = '1';
      searchBtn.addEventListener('click', runSearch);
    }
    if (sort && !(sort.dataset && sort.dataset.boundDailySort === '1')) {
      if (sort.dataset) sort.dataset.boundDailySort = '1';
      sort.addEventListener('change', function () {
        dailySortMode = sort.value || 'relevance';
        renderGrids();
      });
    }
  }

  function updateSeeMoreButton() {
    var btn = document.getElementById('btnSeeMoreDaily');
    if (!btn) return;
    btn.classList.toggle('hidden', !dailyHasMore);
  }

  function mapRowToProduct(r) {
    return {
      id: r.id,
      nameVi: r.nameVi || r.name_vi || '',
      nameEn: r.nameEn || r.name_en || '',
      price_cents: r.price_cents,
      image: r.image,
      section: r.section,
      category: r.category,
      badge: r.badge || ''
    };
  }

  function cacheProducts(list) {
    list.forEach(function (p) {
      if (!p || !p.id) return;
      productCache[p.id] = p;
    });
    if (ShopeeCatalog && typeof ShopeeCatalog.setCatalog === 'function') {
      ShopeeCatalog.setCatalog(Object.keys(productCache).map(function (k) { return productCache[k]; }));
    }
  }

  async function fetchProducts(opts) {
    var p = new URLSearchParams();
    p.set('section', opts.section);
    p.set('category', opts.category || 'all');
    p.set('q', opts.q || '');
    p.set('sort', opts.sort || 'relevance');
    p.set('limit', String(opts.limit || 24));
    p.set('offset', String(opts.offset || 0));
    var res = await fetch('/api/products?' + p.toString());
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  }

  async function loadDaily(reset) {
    var dg = document.getElementById('dailyGrid');
    if (!dg) return;
    if (reset) {
      dailyOffset = 0;
      dailyHasMore = true;
      dg.innerHTML = '';
      updateSeeMoreButton();
    }
    var token = ++dailyRequestToken;
    var limit = reset ? DAILY_PAGE_INIT : DAILY_PAGE_MORE;
    var data = await fetchProducts({
      section: 'daily',
      category: currentCategory,
      q: dailySearchTerm,
      sort: dailySortMode,
      limit: limit,
      offset: dailyOffset
    });
    if (token !== dailyRequestToken) return;
    var list = (data.items || []).map(mapRowToProduct);
    cacheProducts(list);
    dailyOffset += list.length;
    dailyHasMore = !!data.hasMore;
    renderDaily(false, list);
    updateSeeMoreButton();
  }

  async function loadDailyMore() {
    try {
      if (!dailyHasMore) return;
      await loadDaily(false);
    } catch (e) {
      // non-blocking for UX
    }
  }

  async function loadFlash() {
    var fg = document.getElementById('flashSaleGrid');
    if (!fg) return;
    var token = ++flashRequestToken;
    var data = await fetchProducts({
      section: 'flash',
      category: currentCategory,
      q: '',
      sort: 'relevance',
      limit: 12,
      offset: 0
    });
    if (token !== flashRequestToken) return;
    var list = (data.items || []).map(mapRowToProduct);
    cacheProducts(list);
    fg.innerHTML = list.map(function (p) { return renderProductCard(p, true); }).join('');
    bindAddButtons();
  }

  function animateFlyToCart(btn) {
    try {
      var dest = document.getElementById('cartFab');
      if (!dest || dest.classList.contains('hidden')) dest = document.getElementById('cartIconLink');
      if (!dest) return;

      var card = btn.closest('.product-card') || btn.closest('.flex') || btn.parentElement;
      var img = card ? card.querySelector('img') : null;
      if (!img) return;

      var from = img.getBoundingClientRect();
      var to = dest.getBoundingClientRect();

      var el = document.createElement('div');
      el.className = 'fly-img';
      el.style.left = from.left + from.width / 2 - 21 + 'px';
      el.style.top = from.top + from.height / 2 - 21 + 'px';
      el.style.backgroundImage = 'url(\"' + img.src + '\")';
      document.body.appendChild(el);

      var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var dy = (to.top + to.height / 2) - (from.top + from.height / 2);

      if (el.animate) {
        el.animate(
          [
            { transform: 'translate(0px, 0px) scale(1)', opacity: 0.95 },
            { transform: 'translate(' + dx + 'px,' + (dy - 20) + 'px) scale(0.35)', opacity: 0.2 }
          ],
          { duration: 520, easing: 'cubic-bezier(.2,.85,.2,1)' }
        ).onfinish = function () { el.remove(); };
      } else {
        el.style.transition = 'transform 520ms cubic-bezier(.2,.85,.2,1), opacity 520ms cubic-bezier(.2,.85,.2,1)';
        requestAnimationFrame(function () {
          el.style.transform = 'translate(' + dx + 'px,' + (dy - 20) + 'px) scale(0.35)';
          el.style.opacity = '0.2';
        });
        setTimeout(function () { el.remove(); }, 560);
      }
    } catch (err) {
      // swallow animation errors (non-blocking)
    }
  }

  function updateBadge() {
    var n = ShopeeCart.countItems();
    var el = document.getElementById('cartCountBadge');
    if (el) {
      el.textContent = String(n);
      el.classList.toggle('hidden', n === 0);
    }
    var fab = document.getElementById('cartFab');
    var fabCount = document.getElementById('cartFabCount');
    if (fab) fab.classList.toggle('hidden', n === 0);
    if (fabCount) {
      fabCount.textContent = String(n);
      fabCount.classList.toggle('hidden', n === 0);
    }
  }

  async function init() {
    ShopeeI18n.apply(document);
    ShopeeUser.renderHeader();
    bindSeeMore();
    bindCategories();
    bindDailyControls();
    await renderGrids();
    updateBadge();
    window.addEventListener('shopee-cart-changed', updateBadge);
  }

  async function renderGrids() {
    try {
      await Promise.all([loadFlash(), loadDaily(true)]);
    } catch (e) {
      // fallback to local catalog if DB/API unavailable
      var cat = ShopeeCatalog.getCatalog();
      var flash = cat.filter(function (p) { return p.section === 'flash'; });
      var daily = cat.filter(function (p) { return p.section === 'daily'; });
      if (currentCategory !== 'all') {
        flash = flash.filter(function (p) { return p.category === currentCategory; });
        daily = daily.filter(function (p) { return p.category === currentCategory; });
      }
      var fg = document.getElementById('flashSaleGrid');
      if (fg) fg.innerHTML = flash.slice(0, 12).map(function (p) { return renderProductCard(p, true); }).join('');
      dailyHasMore = daily.length > DAILY_PAGE_INIT;
      renderDaily(true, daily.slice(0, DAILY_PAGE_INIT));
      bindAddButtons();
      updateSeeMoreButton();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();

