(function (w) {
  var LANG_KEY = 'shopee_lang';

  var dict = {
    vi: {
      download: 'Tải app',
      support: 'Hỗ trợ',
      register: 'Đăng ký',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      searchPh: 'Tìm sản phẩm, thương hiệu...',
      flashSale: 'Flash Sale',
      seeAll: 'Xem thêm',
      dailyDiscover: 'Gợi ý hôm nay',
      addToCart: 'Thêm vào giỏ',
      manageProducts: 'Quản lý sản phẩm',
      productNameVi: 'Tên (VI)',
      productNameEn: 'Tên (EN)',
      priceUsd: 'Giá (USD, ví dụ 12.50)',
      section: 'Khu vực',
      flash: 'Flash Sale',
      daily: 'Gợi ý',
      addProduct: 'Thêm sản phẩm',
      save: 'Lưu',
      cancel: 'Hủy',
      edit: 'Sửa',
      delete: 'Xóa',
      cart: 'Giỏ hàng',
      checkout: 'Thanh toán',
      account: 'Tài khoản',
      home: 'Trang chủ',
      mall: 'Mall',
      live: 'Live',
      notifications: 'Thông báo',
      me: 'Tôi',
      summerSale: 'SIÊU SALE HÈ',
      summerSub: 'Giảm tới 70%',
      shopNow: 'Mua ngay',
      needHelp: 'Cần trợ giúp?',
      loginTitle: 'Đăng nhập',
      logInBtn: 'ĐĂNG NHẬP',
      forgotPw: 'Quên mật khẩu?',
      loginSms: 'Đăng nhập SMS',
      newTo: 'Mới dùng Shopee?',
      signUp: 'Đăng ký',
      cartTitle: 'Giỏ hàng của bạn',
      emptyCart: 'Giỏ hàng trống',
      goShopping: 'Tiếp tục mua',
      subtotal: 'Tạm tính',
      total: 'Tổng cộng',
      proceedCheckout: 'Thanh toán',
      remove: 'Xóa',
      qty: 'SL',
      checkoutTitle: 'Thanh toán đơn hàng',
      checkoutHint: 'Nhấn nút để mở Stripe. Nhập thẻ test trên trang Stripe.',
      payStripe: 'Thanh toán qua Stripe',
      opening: 'Đang mở Stripe...',
      products: 'Sản phẩm',
      shippingFee: 'Phí vận chuyển',
      discount: 'Giảm giá',
      grandTotal: 'Tổng thanh toán',
      successTitle: 'Thanh toán thành công',
      successMsg: 'Cảm ơn bạn. Đơn hàng đã được ghi nhận (test).',
      continueShop: 'Tiếp tục mua sắm'
      ,
      catAll: 'Tất cả',
      catFashion: 'Thời trang',
      catElectronics: 'Điện tử',
      catBeauty: 'Làm đẹp',
      catHome: 'Nhà cửa & Đời sống',
      catGaming: 'Gaming',
      catSupermarket: 'Siêu thị',
      catAccessories: 'Phụ kiện',
      catKids: 'Mẹ & Bé'
    },
    en: {
      download: 'Download',
      support: 'Support',
      register: 'Register',
      login: 'Login',
      logout: 'Logout',
      searchPh: 'Search products, brands...',
      flashSale: 'Flash Sale',
      seeAll: 'See All',
      dailyDiscover: 'Daily Discover',
      addToCart: 'ADD TO CART',
      manageProducts: 'Manage products',
      productNameVi: 'Name (VI)',
      productNameEn: 'Name (EN)',
      priceUsd: 'Price (USD, e.g. 12.50)',
      section: 'Section',
      flash: 'Flash Sale',
      daily: 'Daily',
      addProduct: 'Add product',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      cart: 'Cart',
      checkout: 'Checkout',
      account: 'Account',
      home: 'Home',
      mall: 'Mall',
      live: 'Live',
      notifications: 'Notifications',
      me: 'Me',
      summerSale: 'SUMMER\nSUPER SALE',
      summerSub: 'Up to 70% Off',
      shopNow: 'Shop Now',
      needHelp: 'Need help?',
      loginTitle: 'Login',
      logInBtn: 'LOG IN',
      forgotPw: 'Forgot Password?',
      loginSms: 'Login with SMS',
      newTo: 'New to Shopee?',
      signUp: 'Sign Up',
      cartTitle: 'Your shopping cart',
      emptyCart: 'Cart is empty',
      goShopping: 'Continue shopping',
      subtotal: 'Subtotal',
      total: 'Total',
      proceedCheckout: 'Checkout',
      remove: 'Remove',
      qty: 'Qty',
      checkoutTitle: 'Checkout',
      checkoutHint: 'Open Stripe to pay. Enter test card on Stripe page.',
      payStripe: 'Pay with Stripe',
      opening: 'Opening Stripe...',
      products: 'Products',
      shippingFee: 'Shipping',
      discount: 'Discount',
      grandTotal: 'Total payment',
      successTitle: 'Payment successful',
      successMsg: 'Thank you. Order recorded (test mode).',
      continueShop: 'Continue shopping'
      ,
      catAll: 'All',
      catFashion: 'Fashion',
      catElectronics: 'Electronics',
      catBeauty: 'Beauty',
      catHome: 'Home & Living',
      catGaming: 'Gaming',
      catSupermarket: 'Supermarket',
      catAccessories: 'Accessories',
      catKids: 'Toys & Kids'
    }
  };

  function lang() {
    return localStorage.getItem(LANG_KEY) || 'vi';
  }

  function setLang(l) {
    localStorage.setItem(LANG_KEY, l === 'en' ? 'en' : 'vi');
    location.reload();
  }

  function t(key) {
    var L = lang();
    return (dict[L] && dict[L][key]) || dict.en[key] || key;
  }

  function apply(root) {
    root = root || document;
    document.documentElement.lang = lang();
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (k && t(k)) {
        if (k === 'summerSale') el.innerHTML = t(k).replace('\n', '<br/>');
        else el.textContent = t(k);
      }
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (k) el.placeholder = t(k);
    });
    root.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var l = btn.getAttribute('data-lang-btn');
      btn.classList.toggle('font-bold', l === lang());
      btn.classList.toggle('underline', l === lang());
      btn.onclick = function () { setLang(l); };
    });
  }

  w.ShopeeI18n = { lang: lang, setLang: setLang, t: t, apply: apply };
})(typeof window !== 'undefined' ? window : {});
