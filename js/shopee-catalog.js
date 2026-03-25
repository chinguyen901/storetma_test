(function (w) {
  var KEY = 'shopee_catalog_v1';

  var SEED = [
    { id: 'p1', nameVi: 'Đồng hồ thông minh', nameEn: 'Smart Watch', price_cents: 2990, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHJQ8qfxI1dTXYkcr15rAYpIh2_9XMlUWksBui1QWhrOn8UGUAhzIrgvaviTBvJS72srhW-a4YhEsW4v8552EEJOXZgJQNz9WnRXyl1FiQPQaQWr975NF0Q8kq9-Ze3eEMp1APSclMkO1iT2s31dKg8uZizXmPxckJ7zexPGlGv7m6itp23v3MkiSUkPnAZqh4xpMZTKss_rfMkjLcSAyu6GxIfkwREseiBTSdVpmqfB8mBSGSprDxuSNd7akj5sh08UMixmnTVho', section: 'flash', category: 'accessories', badge: '-45%' },
    { id: 'p2', nameVi: 'Loa Bluetooth', nameEn: 'Bluetooth Speaker', price_cents: 1550, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7GYE6EIPPuH3UhP6sRXn5oKE3vzhfKObWLCK8Nj_U_QPd_PcGAgaerKhbb_iUf02K46c4UGyrTyAG81mIXLq7C4_WYKpi8rqK2Bu6dEXhzHBJ2fxKe__0wwa0byAtAUKDcn4uKLpymCFOkt5Rf11bnaJx1L6iqDnOL7b3IG2c481Aryb7e-L63S_w_FeqD5jw8NQCxsPrxXtYXxbfJkZ-vK_vCh6mf9pCuCMbc15XA5C1RyX_IO9HKnOoTk-beh-AytVTf4-rxls', section: 'flash', category: 'electronics', badge: '-30%' },
    { id: 'p3', nameVi: 'Bộ cọ trang điểm', nameEn: 'Makeup Brush Set', price_cents: 1200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAup-4DRY5GgJsugqh1Aa-MsF8K2OK5iIFZB98_Fiq-x_o9vvskSQiGvsuHykJL769ExBGPIr8c4qgfPW0CtepeffcAX6F6Nu_7zajLVxj1vuz5g75xEGrOMUKOW6dAJ6onbA9bMwVPGQ9wgXU4sUohtm5TFH21dOnux7Iguyff1A6hvv71XWUfSyP-IrnrXANQZ4mg4OFKHcdt_ThncLKGLuhOdAvMW2RwivnpObOxJhUMkb8U2O-OeeFDAb-inCr0Q9RRva0p4Oo', section: 'flash', category: 'beauty', badge: '-60%' },
    { id: 'p4', nameVi: 'Chuột không dây', nameEn: 'Wireless Mouse', price_cents: 4500, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI9Rn8rCDjjQf4SllsnaYWn-Mf-psGodfhXPLvljU_dssZZfWgUCn3yGSu8-dloFPR0cXSk0KhMvEqagIr7DAked4_gDYyKfbjQ1UVDcNJFNle1fRvjIYBTp7iTNCzCwKMLtjRw7JrC3ZcvjW_Qe8r0bSeMzLfcjr2mfON9mqGZh54cnGrxujC1LdX8Tq3wFmw8TAxR1sDSs8K8bT3MAIMAlr0zqgxzMiNaTb3wUg6yLpBd7bXawnbyVCOGbFHDo0nB1PZjHnVMAI', section: 'flash', category: 'electronics', badge: '-25%' },
    { id: 'p5', nameVi: 'Kính mát retro', nameEn: 'Retro Sunglasses', price_cents: 890, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5guLpGhlt31ZTwvd7y-N9I3UEk7AK-ql3VGGxQJvh02aA3nsM1ET_F0SwoJ58PcHiy3tNhYNmeJA6CZ5qItLPtZ9txgNpOhdpn65ZTl7S0gnaD922fjvAevw6rGFMIr8m0o57IaSJaEiecroZR4aSicPanqA5P1qgd--Trv9VfRjJBcArTOLPXu4RqDGvxhBT4QhWPOhWtmYrFwQ1OMdviSfLUCFSbrOM5VGn1la1pu8aFcZz1ai2k5wdhDZ_9-qIsi1EXEpkfqE', section: 'flash', category: 'accessories', badge: '-50%' },
    { id: 'p6', nameVi: 'Bình giữ nhiệt', nameEn: 'Insulated Bottle', price_cents: 1820, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-tCn85LMVYQWmKD23uU6iT0ePwUq6bQAGQXRXIAzJTFX08Llym72m1kD5d8cdTQU3DcmbkYsxeLADm6A6ze6Ik4agfamNOTvFJZ7wAlIDCzQxrpyHLpuE9w5HVUOEg_lvddjgEZAowh3y24C0YB1SUVZghU9WNRwug7TzLmSFEi5iKi5MqPXseL623zATG6QAuCGJsJ9mihlUdr-8q0EYIRm7eXBmg43CEz8fr7UDP3c0pNxV7CU02l5e_tgM0YxTekkfTrGnX_M', section: 'flash', category: 'supermarket', badge: '-15%' },
    { id: 'p7', nameVi: 'Áo thun cotton', nameEn: 'Cotton T-Shirt', price_cents: 1250, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgHATCHG-fSOx9uXNdS47mncdyTcyO5DLIpZ28nSb8dIrR7HsK16zRwaYn7u2JQUifkvcVh3M-zIbNYmpVWrD19yDcfC3nR0QoKrhxqFBL-uc0I-wxGxUTXkr5Vfk95eyCMAtdxO4fuaC1Om9bJSZiTPD0yiKWVIRIgnomXBQ0n5B-2qU0lDI55th-9bnpdrxyqIYd_R5fBRXbEhdiDW7w8SAP38gP3XjXVB4lB1QzZz_6Q4CriaJYM04PFfErR2hU2LO-r2SS01s', section: 'daily', category: 'fashion', badge: '-20%' },
    { id: 'p8', nameVi: 'Kem dưỡng ẩm', nameEn: 'Face Moisturizer', price_cents: 2400, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7_jKXJCpOlv8trfBmVGI8PYnfDwqOaNeodrGdUspAPKGkmqfzdZBHlBOCYAMmTWNZTwcJ0J8D2WJdZDWVgA4XYr2V0Iwiu0EH3CrhX75eVTcm0JXTIEk87tnKkuhl-rZxM1fySCLKdYC4TSA0CmxVPQfgS0TLugIzNpK7uiCY8EvPVSzzkfq0hymACO0xtPgpxYdaAGaAv6oP1tEBAmk0yQOZhJCz_3BmvKveRicoBRsrE8QAcY1Adbr7oFenDqjHE0HQTGf3H1w', section: 'daily', category: 'beauty', badge: '-50%' },
    { id: 'p9', nameVi: 'Chuột gaming', nameEn: 'Gaming Mouse', price_cents: 5990, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF-7FLjtwD7-TFF1AiD3NZXnPmrWLaWNNRRRxvpRZWr_zZH5RwH1MYFjHlcAChhw0E-Al4FZXWnTHY21jkFuEolZ-rwY6U6D6LmT8waRlY9bna_IASRDAyHNJvu_PKMKYehZXN4ql6LkFCBAyMC_vvNlrYGBQn6fT1ImsxC4lW2MkZQPb4h-cA7ryKQNASoACg1tLYvU8CMRAC9sgTSd0a0VcZf2IzSZnipz33Pnk3PPgiSTUnRzuGNPtQ-jlUQuLnEH7pbaNq2F8', section: 'daily', category: 'gaming', badge: '-15%' },
    { id: 'p10', nameVi: 'Thảm yoga TPE', nameEn: 'Yoga Mat', price_cents: 1999, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEh7nbiFRuG3QEqBB0Ig7LvzMAkOv1_LlupVzKRoaNo_2_nsnMrFmMppGms1ZYIBnhs2KUGqEny7BBEytTRNpLyZtP8_IynSYSuPMYSeqI5ckP9pGrWLqo0F8A_LPs7C_bmaZ-Prh8laVeHSi-JhI_O3-qeDFduEXHPxqkbuPAjs_ZuO-B3hQRYXPQET4ul4Vgwy0lxDGW_JBVlW-S9Rd2vrTqyljm_w_ZL_NmoV4LsP__S4sgfEZPHI8MHGWsKAS7lFlmiI-vqwg', section: 'daily', category: 'sports', badge: '-30%' },
    { id: 'p11', nameVi: 'Bộ pha cà phê', nameEn: 'Coffee Dripper Set', price_cents: 3500, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8E9373tyqb7mSTNCWWne81S6xtFrn3_KHSlEpE-UH9LH5LLRJnhpnrEAlTiTTrwnvHVx1wUtiRUcCofemhXWRxLoOm69KyRawIuMkT1N1uPkJ0R4wdtyCJSQloBqE3qicgQzqqe-wM--5JRNvdAg0_mDY1faJSRp8OUePaIMdfe2J5tdx_xnsKFouhss8zOPA_twKdXGpTUeS0KgNv0xfwIZZOcqy03e1sEyhYhgtIdF2k2oMos8I2VtdFV995XXWoxYAqbVuS0w', section: 'daily', category: 'home', badge: '-10%' },
    { id: 'p12', nameVi: 'Túi canvas', nameEn: 'Canvas Tote', price_cents: 550, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRTCnaNXYtWwsBpfps-kZzYYI8pIFIkJF9xqQsy3DrmbBZ0OLmZknBzVXgN3Z-SGOojy0IB_d2EM7rxPhUHM1eDdYwnDjd62ZDjblKTdpGCXemqFrwePy48ikCdAeoSbjHhbD-yPCnIPUtnNFJmyUUapN1VxF184qPYxmUL64l2js7iTHPCCKC2qcI9lLcacxcpC_qWgEETSG53b3IewBHbmyiTmQlJydb1gsBOnRgZeTVBVXSwvuS-YBADHBOkXcjkYpNCWvy0zY', section: 'daily', category: 'fashion', badge: '-40%' },
    { id: 'p13', nameVi: 'Đèn bàn LED', nameEn: 'LED Desk Lamp', price_cents: 1890, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5rkcY1BPb3OpM49ryASJHSy6gcJ7RGkpNo39KlSJZlv0anJwCrZBDZPeOqWaiIII6IGdsMxGAtLwdcJS7axYMAOTog3JyX6AjQHIEr3eLbA_2ikC0cKYNttDwolrFx6P6USR6zKDBher4E6cuMSLI14UWy4atC9pXzhmqaY4n6gmNEwkMBxilchE_P6_weX3QV73PdvR0NjUOnOJE693_NfNQA_BbHeByu2DZFPFTc_6p_Su9bB1-ZJYXUR_F0TVsZGHE_I6AWQ4', section: 'daily', category: 'home', badge: '-65%' },
    { id: 'p14', nameVi: 'Nến thơm', nameEn: 'Scented Candle', price_cents: 1450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOPAL4Dfy2FHc8zYxFVgnDDzs_xxtn-aZYU2G3OQUvUcTRJwLCEOIW7l6lbBfC_cyNN4A1FfPFdwLE1uxwYioxWACY8i1Nw58dRaogFPyRmTUClD3omHXXM-Fqc70YFxVa_PnMnv-FapWNFQhv655mO5bixJ_pWHM_8ylFK_OFLRe2MBspMOoT9-M_QpqxKWc9J0sWv-YDu7tZ0MbPnWNP7AcMjYn1MJN1qw-sPij3uqFWtAz1jPkv5ekbh8LDg2lE_kihsnO90iA', section: 'daily', category: 'home', badge: '-25%' },
    { id: 'p15', nameVi: 'Ốp điện thoại', nameEn: 'Phone Case', price_cents: 299, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlL4IhJnEO4iIUCHEARlmkHdCPj-lwb4NUSQX3VnWXeMY_KjvRca5LBFzuNRgV3UAFjSjIIeaLC2ShDjC-aVTMp1DP9mo4Jf7ip0f3upLHHJMLVl4B5vMKassV0KdpLeVNuhm739y4vVssajd6UYqfiwgA1MirNwpVlIpsg1su57Vhx4UhAr8kD2eE3XYAxgNPKdiePWgYMknxCw_Qg_ipfk9Nf8o_zNzyTGFI7qAQuhvaMfLFr_OJsMGGrey2P4vEYsAim3islL4', section: 'daily', category: 'electronics', badge: '-80%' },
    { id: 'p16', nameVi: 'Sổ bullet journal', nameEn: 'Bullet Journal', price_cents: 1600, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3VsJb980o877lMMtNoy3KWeWsJF5q5zud77xH87pFRbWPrvYPy-a3zA0Q-o9dc5Pv7k8OMi-HJtz5rE2DmDGMm2x1T2kvzs4tnvsC9lqX8Osi5oz23Yjo5QRtS8PrtrbmioLz3WA3HY9uipc8BzuAZmKz5NjoqhGaa7_beSq9OsPzMq6IbVEWykpsL5woNx0RV3qY4eIhm3qyX0ElGOmu_GIF9kTZoefrNBw8FRo71drNycudfOgyOIfLT6877sWj2fZXpD3EHZs', section: 'daily', category: 'home', badge: '-15%' },
    { id: 'p17', nameVi: 'Bình nước 1L', nameEn: 'Water Bottle 1L', price_cents: 950, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6KI9GilgmZ9HqCHN4a_6wsB50i8mcEOkLxo02jbk3-_NhGSg99TN5X2yfH-weQ1Oh3d3Yx1wvTe6z7GbpuPyACmeda7Pcx1xeNVUTtEOe3KqYikzOfRZR4yI-PDjie3EiVhmfRE5LF5IWK0bziiKAlYEB-IdgCg-u9NSwhrxAL4PcbLVIDXKlHLuBxsjChSBDNB92hOEIPJiAYl16USL-w1r1isT53i5N4Dd65_lQHGyIkddpNTNvrBualGjMZ7LycKlIHDe2HvA', section: 'daily', category: 'supermarket', badge: '-45%' },
    { id: 'p18', nameVi: 'Kính mát polarized', nameEn: 'Polarized Sunglasses', price_cents: 1120, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN87nxS2MQTKAMf7H3o-bbHCSv32UorJZ_LV8kSCCwevzX51NAEo9piXm7VACj73jRvQIuD5CdM0qwAhUE1cvElgVorCiblmXrcfliqX5iQgq_ohwxZS9mCyV48445mz-xzLvIBumVzWNFelPivLcTGS7hsjaYfBYjGHhcRGr212Kd8iJu0HofbxKb4i6C0pTJxxlOxQpZr657NF2XJYBwMbI3vrUbzrnT-Iv-t-Ww2O4E9b199TZGB2bBIg_GBfiq2cB8tGzPjrA', section: 'daily', category: 'accessories', badge: '-30%' }
  ];

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function hash32(str) {
    var h = 2166136261; // FNV-1a
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    var t = seed >>> 0;
    return function () {
      // xorshift32
      t ^= t << 13;
      t ^= t >>> 17;
      t ^= t << 5;
      return (t >>> 0) / 4294967296;
    };
  }

  function demoImageFor(id) {
    // Stable, free, no-api-key placeholder images.
    return 'https://picsum.photos/seed/' + encodeURIComponent(id) + '/600/600';
  }

  var CATEGORY_POOL = ['fashion', 'electronics', 'beauty', 'home', 'gaming', 'supermarket', 'accessories', 'kids'];

  function pickCategoryStable(id, fallback) {
    try {
      var h = hash32(String(id || ''));
      return CATEGORY_POOL[h % CATEGORY_POOL.length] || fallback || 'misc';
    } catch (e) {
      return fallback || 'misc';
    }
  }

  function inflateDemoCatalog(targetSize) {
    var base = JSON.parse(JSON.stringify(SEED));
    if (!targetSize || targetSize <= base.length) return base;

    var out = base.slice();
    var labels = ['Pro', 'Max', 'Lite', 'Plus', 'Air', 'S', 'X', 'Ultra', '2026', 'Edition'];
    var badges = ['NEW', 'HOT', 'BEST', '-10%', '-15%', '-20%', '-25%', '-30%', '-40%', '-50%', '-60%'];

    for (var i = out.length; i < targetSize; i++) {
      var b = base[i % base.length];
      var id = b.id + '_demo_' + i;
      var rng = makeRng(hash32(id));
      var label = labels[Math.floor(rng() * labels.length)];
      var model = String(1000 + Math.floor(rng() * 9000));

      var priceFactor = 0.7 + rng() * 1.6; // 0.7x .. 2.3x
      var cents = clamp(Math.round((b.price_cents || 1000) * priceFactor), 50, 99999900);

      var isFlash = rng() < 0.12; // ~12% flash, rest daily
      out.push({
        id: id,
        nameVi: (b.nameVi || 'Sản phẩm') + ' ' + label + ' ' + model,
        nameEn: (b.nameEn || 'Product') + ' ' + label + ' ' + model,
        price_cents: cents,
        image: demoImageFor(id),
        section: isFlash ? 'flash' : 'daily',
        category: b.category || pickCategoryStable(id, 'misc'),
        badge: badges[Math.floor(rng() * badges.length)]
      });
    }
    return out;
  }

  function normalizeProduct(p) {
    if (!p || typeof p !== 'object') return null;
    if (!p.category) p.category = pickCategoryStable(p.id, 'misc');
    return p;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(SEED));
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr) || !arr.length) return JSON.parse(JSON.stringify(SEED));
      return arr.map(normalizeProduct).filter(Boolean);
    } catch (e) {
      return JSON.parse(JSON.stringify(SEED));
    }
  }

  function save(products) {
    localStorage.setItem(KEY, JSON.stringify(products));
  }

  function getCatalog() {
    return load();
  }

  function setCatalog(products) {
    save(products);
  }

  function addProduct(row) {
    var list = load();
    var id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    var cents = Math.max(50, Math.min(99999900, parseInt(row.price_cents, 10) || 0));
    list.push({
      id: id,
      nameVi: String(row.nameVi || row.name || 'Sản phẩm').slice(0, 200),
      nameEn: String(row.nameEn || row.nameVi || 'Product').slice(0, 200),
      price_cents: cents,
      image: String(row.image || 'https://via.placeholder.com/200?text=Product').slice(0, 500),
      section: row.section === 'flash' ? 'flash' : 'daily',
      category: String(row.category || 'misc').slice(0, 40),
      badge: row.badge || 'NEW'
    });
    save(list);
    return id;
  }

  function updateProduct(id, patch) {
    var list = load();
    var i = list.findIndex(function (p) { return p.id === id; });
    if (i < 0) return false;
    if (patch.nameVi != null) list[i].nameVi = String(patch.nameVi).slice(0, 200);
    if (patch.nameEn != null) list[i].nameEn = String(patch.nameEn).slice(0, 200);
    if (patch.price_cents != null) list[i].price_cents = Math.max(50, Math.min(99999900, parseInt(patch.price_cents, 10) || list[i].price_cents));
    if (patch.section === 'flash' || patch.section === 'daily') list[i].section = patch.section;
    if (patch.image) list[i].image = String(patch.image).slice(0, 500);
    save(list);
    return true;
  }

  function deleteProduct(id) {
    var list = load().filter(function (p) { return p.id !== id; });
    save(list);
    return true;
  }

  function productName(p) {
    if (typeof w.ShopeeI18n === 'object' && w.ShopeeI18n.lang() === 'en') return p.nameEn || p.nameVi;
    return p.nameVi || p.nameEn;
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  w.ShopeeCatalog = {
    getCatalog: getCatalog,
    setCatalog: setCatalog,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    productName: productName,
    formatMoney: formatMoney,
    ensureDemoCatalogSize: function (targetSize) {
      try {
        var list = load();
        if (Array.isArray(list) && list.length >= targetSize) {
          // Backfill category for older catalogs, then persist once.
          var changed = false;
          for (var i = 0; i < list.length; i++) {
            if (!list[i] || typeof list[i] !== 'object') continue;
            if (!list[i].category) {
              list[i].category = pickCategoryStable(list[i].id, 'misc');
              changed = true;
            }
          }
          if (changed) save(list);
          return list.length;
        }
        var inflated = inflateDemoCatalog(targetSize);
        save(inflated);
        return inflated.length;
      } catch (e) {
        return 0;
      }
    },
    resetToSeed: function () {
      localStorage.removeItem(KEY);
    }
  };
})(typeof window !== 'undefined' ? window : {});
