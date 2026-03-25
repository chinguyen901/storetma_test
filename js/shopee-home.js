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
    var fg = document.getElementById('flashSaleGrid');
    var dg = document.getElementById('dailyGrid');
    if (fg) fg.innerHTML = flash.map(function (p) { return renderProductCard(p, true); }).join('');
    if (dg) dg.innerHTML = daily.map(function (p) { return renderProductCard(p, false); }).join('');
    bindAddButtons();
  }

  function bindAddButtons() {
    document.querySelectorAll('[data-add-cart]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-add-cart');
        ShopeeCart.addToCart(id, 1);
        updateBadge();
      });
    });
  }

  function updateBadge() {
    var n = ShopeeCart.countItems();
    var el = document.getElementById('cartCountBadge');
    if (el) {
      el.textContent = String(n);
      el.classList.toggle('hidden', n === 0);
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

  document.getElementById('formAddProduct') &&
    document.getElementById('formAddProduct').addEventListener('submit', function (e) {
      e.preventDefault();
      var vi = document.getElementById('newNameVi').value.trim();
      var en = document.getElementById('newNameEn').value.trim() || vi;
      var pr = parseFloat(document.getElementById('newPrice').value, 10);
      var sec = document.getElementById('newSection').value;
      if (!vi || !pr || pr <= 0) return;
      ShopeeCatalog.addProduct({
        nameVi: vi,
        nameEn: en,
        price_cents: Math.round(pr * 100),
        section: sec,
        badge: 'NEW'
      });
      e.target.reset();
      renderAdmin();
      renderGrids();
    });

  function init() {
    ShopeeI18n.apply(document);
    ShopeeUser.renderHeader();
    renderGrids();
    renderAdmin();
    updateBadge();
    window.addEventListener('shopee-cart-changed', updateBadge);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
