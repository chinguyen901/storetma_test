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

  function renderGrids() {
    var cat = ShopeeCatalog.getCatalog();
    var flash = cat.filter(function (p) { return p.section === 'flash'; });
    var daily = cat.filter(function (p) { return p.section === 'daily'; });

    if (currentCategory !== 'all') {
      flash = flash.filter(function (p) { return p.category === currentCategory; });
      daily = daily.filter(function (p) { return p.category === currentCategory; });
    }
    var fg = document.getElementById('flashSaleGrid');
    var dg = document.getElementById('dailyGrid');
    if (fg) {
      // Keep flash lightweight for perf with big catalogs
      fg.innerHTML = flash.slice(0, 12).map(function (p) { return renderProductCard(p, true); }).join('');
    }
    if (dg) {
      renderDaily(true, daily);
    }
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
  var currentCategory = 'all';

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

    var list = Array.isArray(dailyList) ? dailyList : ShopeeCatalog.getCatalog().filter(function (p) { return p.section === 'daily'; });

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

    var btn = document.getElementById('btnSeeMoreDaily');
    if (btn) {
      btn.classList.toggle('hidden', dailyOffset >= list.length);
    }
  }

  function bindSeeMore() {
    var btn = document.getElementById('btnSeeMoreDaily');
    if (!btn) return;
    if (btn.dataset && btn.dataset.boundSeeMore === '1') return;
    if (btn.dataset) btn.dataset.boundSeeMore = '1';
    btn.addEventListener('click', function () {
      renderDaily(false);
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
        renderGrids();
      });
    });
    setActiveCategoryUI();
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

  function renderAdmin() {
    var box = document.getElementById('adminProductList');
    if (!box) return;
    var cat = ShopeeCatalog.getCatalog();
    box.innerHTML =
      '<table class="w-full text-xs border-collapse">' +
      '<thead><tr class="border-b text-left">' +
      '<th class="py-2 pr-2">ID</th><th class="py-2 pr-2" data-i18n="productNameVi">Tên</th><th class="py-2 pr-2">$</th><th class="py-2"></th>' +
      '</tr></thead><tbody>' +
      cat
        .map(function (p) {
          return (
            '<tr class="border-b border-slate-100">' +
            '<td class="py-2 pr-2 font-mono text-[10px]">' +
            p.id +
            '</td>' +
            '<td class="py-2 pr-2">' +
            pname(p) +
            '</td>' +
            '<td class="py-2 pr-2">' +
            (p.price_cents / 100).toFixed(2) +
            '</td>' +
            '<td class="py-2 whitespace-nowrap">' +
            '<button type="button" data-edit-id="' +
            p.id +
            '" class="text-primary mr-2">' +
            ShopeeI18n.t('edit') +
            '</button>' +
            '<button type="button" data-del-id="' +
            p.id +
            '" class="text-red-600">' +
            ShopeeI18n.t('delete') +
            '</button>' +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table>';

    box.querySelectorAll('[data-del-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm('OK?')) return;
        ShopeeCatalog.deleteProduct(b.getAttribute('data-del-id'));
        ShopeeCart.removeLine(b.getAttribute('data-del-id'));
        renderAdmin();
        renderGrids();
        updateBadge();
      });
    });
    box.querySelectorAll('[data-edit-id]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-edit-id');
        var p = ShopeeCatalog.getCatalog().find(function (x) { return x.id === id; });
        if (!p) return;
        var vi = prompt('Tên VI:', p.nameVi);
        if (vi === null) return;
        var en = prompt('Name EN:', p.nameEn);
        if (en === null) return;
        var pr = prompt('Price USD:', (p.price_cents / 100).toFixed(2));
        if (pr === null) return;
        var cents = Math.round(parseFloat(pr, 10) * 100);
        ShopeeCatalog.updateProduct(id, { nameVi: vi, nameEn: en || vi, price_cents: cents });
        renderAdmin();
        renderGrids();
      });
    });
    ShopeeI18n.apply(box);
  }

  // Admin product management UI removed from home page.

  function init() {
    ShopeeI18n.apply(document);
    ShopeeUser.renderHeader();
    // Inflate demo catalog once for big-list testing
    if (ShopeeCatalog && typeof ShopeeCatalog.ensureDemoCatalogSize === 'function') {
      ShopeeCatalog.ensureDemoCatalogSize(10000);
    }
    bindSeeMore();
    bindCategories();
    renderGrids();
    updateBadge();
    window.addEventListener('shopee-cart-changed', updateBadge);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
