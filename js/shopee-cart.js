(function (w) {
  var KEY = 'shopee_cart_v1';

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function save(lines) {
    localStorage.setItem(KEY, JSON.stringify(lines));
    w.dispatchEvent(new CustomEvent('shopee-cart-changed'));
  }

  function getCart() {
    return load();
  }

  function setCart(lines) {
    save(lines);
  }

  function addToCart(productId, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var lines = load();
    var found = lines.find(function (l) { return l.id === productId; });
    if (found) found.qty += qty;
    else lines.push({ id: productId, qty: qty });
    save(lines);
  }

  function setQty(productId, qty) {
    qty = parseInt(qty, 10);
    var lines = load().filter(function (l) { return l.id !== productId; });
    if (qty > 0) lines.push({ id: productId, qty: qty });
    save(lines);
  }

  function removeLine(productId) {
    save(load().filter(function (l) { return l.id !== productId; }));
  }

  function clearCart() {
    save([]);
  }

  function countItems() {
    return load().reduce(function (s, l) { return s + l.qty; }, 0);
  }

  function buildCheckoutPayload(catalog) {
    var map = {};
    catalog.forEach(function (p) { map[p.id] = p; });
    return load()
      .map(function (line) {
        var p = map[line.id];
        if (!p) return null;
        return {
          id: p.id,
          qty: line.qty,
          name: (p.nameEn || p.nameVi).slice(0, 120),
          unit_amount_cents: p.price_cents
        };
      })
      .filter(Boolean);
  }

  function totalCents(catalog) {
    var map = {};
    catalog.forEach(function (p) { map[p.id] = p; });
    return load().reduce(function (sum, line) {
      var p = map[line.id];
      return sum + (p ? p.price_cents * line.qty : 0);
    }, 0);
  }

  w.ShopeeCart = {
    getCart: getCart,
    setCart: setCart,
    addToCart: addToCart,
    setQty: setQty,
    removeLine: removeLine,
    clearCart: clearCart,
    countItems: countItems,
    buildCheckoutPayload: buildCheckoutPayload,
    totalCents: totalCents
  };
})(typeof window !== 'undefined' ? window : {});
