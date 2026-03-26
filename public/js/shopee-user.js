(function (w) {
  var KEY = 'shopee_user';

  function getUser() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setUser(u) {
    if (!u) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(u));
    w.dispatchEvent(new CustomEvent('shopee-user-changed'));
  }

  function logout() {
    setUser(null);
    location.href = 'login.html';
  }

  function renderHeader() {
    var u = getUser();
    var guest = document.getElementById('navGuest');
    var user = document.getElementById('navUser');
    var nameEl = document.getElementById('userDisplayName');
    if (!guest || !user) return;
    if (u && u.displayName) {
      guest.classList.add('hidden');
      user.classList.remove('hidden');
      if (nameEl) nameEl.textContent = u.displayName;
    } else {
      guest.classList.remove('hidden');
      user.classList.add('hidden');
    }
    var btn = document.getElementById('btnLogout');
    if (btn) btn.onclick = function () { setUser(null); location.reload(); };
  }

  w.ShopeeUser = { getUser: getUser, setUser: setUser, logout: logout, renderHeader: renderHeader };
})(typeof window !== 'undefined' ? window : {});

