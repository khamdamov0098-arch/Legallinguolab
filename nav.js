var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjMtjRzo2_T4CWVGIFg9ErQxHyKVwDwFJlJkgpm7rSsQAaBbq_ozX-NajZYwUmICp1Tw/exec';
const LLL_USERS_KEY = 'lll_users';

function normalizePhone(raw) {
  let tel = String(raw || '').replace(/\s/g, '');
  if (/^998\d{9}$/.test(tel)) tel = '+' + tel;
  if (/^8\d{9}$/.test(tel)) tel = '+998' + tel.slice(1);
  if (/^\d{9}$/.test(tel)) tel = '+998' + tel;
  return tel;
}

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LLL_USERS_KEY) || '{}'); }
  catch (e) { return {}; }
}

function saveLocalUser(tel, name, group) {
  const users = getLocalUsers();
  users[tel] = { name, group, telefon: tel };
  localStorage.setItem(LLL_USERS_KEY, JSON.stringify(users));
}

function findLocalUser(tel) {
  const users = getLocalUsers();
  return users[tel] || null;
}

function isBackendReady() {
  return SCRIPT_URL && !SCRIPT_URL.includes('YOUR_APPS_SCRIPT_URL');
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) mobileMenu.classList.remove('open');
    });
  }
  document.querySelectorAll('.dropdown > a').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      const menu = this.nextElementSibling;
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
      if (!isOpen) menu.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
  });
  renderNavUser();
  renderHeroButtons();
});

function renderHeroButtons() {
  const loginBtn = document.getElementById('heroLoginBtn');
  const primaryBtn = document.getElementById('heroPrimaryBtn');
  if (!loginBtn && !primaryBtn) return;
  const raw = localStorage.getItem('lll_user');
  if (raw) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (primaryBtn) {
      primaryBtn.href = 'teoria.html';
      primaryBtn.textContent = 'Продолжить обучение →';
    }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (primaryBtn) {
      primaryBtn.href = 'register.html';
      primaryBtn.textContent = 'Начать обучение →';
    }
  }
}

function navUserInitial(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function renderNavUser() {
  const navUser    = document.getElementById('navUserBlock');
  const mobileUser = document.getElementById('mobileUserBlock');
  const raw = localStorage.getItem('lll_user');
  if (raw) {
    const u = JSON.parse(raw);
    const initial = navUserInitial(u.name);
    if (navUser) navUser.innerHTML = `
      <div class="nav-user">
        <div class="nav-user-avatar" aria-hidden="true">${initial}</div>
        <div class="nav-user-info">
          <div class="nav-user-name">${u.name}</div>
          <div class="nav-user-group">${u.group}</div>
        </div>
        <button class="btn-nav-logout" onclick="navLogout()">Выйти</button>
      </div>`;
    if (mobileUser) mobileUser.innerHTML = `
      <div class="mobile-user-block">
        <div class="nav-user-info">
          <div class="nav-user-name">${u.name}</div>
          <div class="nav-user-group">${u.group}</div>
        </div>
        <button class="btn-nav-logout" onclick="navLogout()">Выйти</button>
      </div>`;
  } else {
    if (navUser) navUser.innerHTML = `<a href="login.html" class="btn-login">Войти →</a>`;
    if (mobileUser) mobileUser.innerHTML = `<a href="login.html" class="btn-login" style="display:block;margin:0.6rem 0.25rem;text-align:center;">Войти →</a>`;
  }
  renderHeroButtons();
}

function navLogout() {
  localStorage.removeItem('lll_user');
  window.location.href = 'index.html';
}

function openPDF(url, title) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const fullUrl = url.startsWith('http') ? url : window.location.origin + '/' + url;

  // Mobilda yangi tabda ochish (Google Docs viewer Netlify fayllarini ko'rsata olmaydi)
  if (isMobile) {
    window.open(fullUrl, '_blank');
    return;
  }

  // Kompyuterda modal ichida ko'rsatish
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  document.getElementById('modalTitle').textContent = title;
  const dlBtn = document.getElementById('modalDlBtn');
  if (dlBtn) dlBtn.href = fullUrl;
  document.getElementById('modalFrame').src = fullUrl;
  overlay.classList.add('open');
}

function closePDF(e) {
  const overlay = document.getElementById('modalOverlay');
  if (!e || e.target === overlay || e.currentTarget.classList.contains('modal-close')) {
    overlay.classList.remove('open');
    document.getElementById('modalFrame').src = '';
  }
}

function showToast(msg, type = '') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.classList.remove('show'), 3500);
}
