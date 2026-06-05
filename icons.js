/* LegalLinguoLab — unified SVG icons (replaces emoji) */
const LLL_ICONS = {
  home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  'book-open': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/>',
  'pen-line': '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  library: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5z"/><path d="M12 6v7"/><path d="M8 8.5v4"/><path d="M16 8.5v4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  chart: '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  scale: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M7 7l-3 5h6z"/><path d="M17 7l-3 5h6z"/><path d="M6 20h12"/>',
  'file-edit': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10 13l-2 5 5-2 5-5-5 2z"/>',
  graduation: '<path d="M22 10v6"/><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>',
  'user-circle': '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="12" r="10"/>',
  pin: '<path d="M12 17v5"/><path d="M5 7a7 7 0 0 1 14 0c0 5-7 10-7 10S5 12 5 7z"/><circle cx="12" cy="7" r="2"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  close: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  medal1: '<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>',
  medal2: '<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 21l5-2.5 5 2.5-1.21-7.11"/>',
  medal3: '<circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 20l5-2 5 2-1.21-6.11"/>',
  stats: '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>'
};

const EMOJI_TO_ICON = {
  '📚': 'book-open', '✍️': 'pen-line', '🎯': 'target', '📖': 'library',
  'ℹ️': 'info', '📊': 'chart', '👤': 'user', '🏠': 'home', '⚖️': 'scale',
  '📝': 'file-edit', '🎓': 'graduation', '👩‍🏫': 'user-circle', '📌': 'pin',
  '⚠️': 'alert', '🥇': 'medal1', '🥈': 'medal2', '🥉': 'medal3',
  '⬇': 'download', '✕': 'close', '▾': 'chevron', '📱': 'phone', '👥': 'users',
  '📄': 'file-edit', '📋': 'file-edit'
};

function lllIcon(name, size, stroke) {
  const path = LLL_ICONS[name];
  if (!path) return '';
  const s = size || 20;
  const c = stroke || 'currentColor';
  return `<svg class="ico-svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function emojiToIcon(emoji) {
  return EMOJI_TO_ICON[emoji] || null;
}

function replaceLeadingEmoji(el, iconSize) {
  if (!el || el.dataset.icoDone) return;
  const raw = el.textContent.trim();
  for (const [emoji, iconName] of Object.entries(EMOJI_TO_ICON)) {
    if (!raw.startsWith(emoji)) continue;
    const rest = raw.slice(emoji.length).trim();
    const size = iconSize || (el.classList.contains('page-header') ? 0 : 20);
    const sz = el.closest('.page-header') ? 32 : (el.classList.contains('footer-logo') ? 22 : size);
    const wrap = el.classList.contains('dm-icon') ? '' : '<span class="ico-wrap">';
    const wrapEnd = wrap ? '</span>' : '';
    el.innerHTML = `${wrap}${lllIcon(iconName, sz)}${wrapEnd}${rest ? ' ' + rest : ''}`;
    el.dataset.icoDone = '1';
    el.classList.add('has-ico');
    return;
  }
}

function initLegalIcons() {
  document.querySelectorAll('.dm-icon').forEach(el => {
    const name = emojiToIcon(el.textContent.trim());
    if (name) {
      el.innerHTML = lllIcon(name, 18);
      el.dataset.icoDone = '1';
    }
  });

  document.querySelectorAll('.page-header h1').forEach(el => replaceLeadingEmoji(el, 32));
  document.querySelectorAll('.header-nav > a').forEach(el => {
    if (!el.closest('.dropdown')) replaceLeadingEmoji(el, 18);
  });
  document.querySelectorAll('.mobile-menu > a').forEach(el => replaceLeadingEmoji(el, 20));
  document.querySelectorAll('.footer-logo').forEach(el => replaceLeadingEmoji(el, 22));

  document.querySelectorAll('.stage-icon, .feature-icon').forEach(el => {
    const name = emojiToIcon(el.textContent.trim());
    if (name) { el.innerHTML = lllIcon(name, 28); el.dataset.icoDone = '1'; }
  });

  document.querySelectorAll('.author-avatar, .author-page-avatar').forEach(el => {
    el.innerHTML = lllIcon('user-circle', el.classList.contains('author-page-avatar') ? 52 : 48);
    el.dataset.icoDone = '1';
  });

  document.querySelectorAll('.hero-badge, .hero-card h3').forEach(el => replaceLeadingEmoji(el, 20));

  document.querySelectorAll('.info-box').forEach(el => {
    const t = el.textContent.trim();
    if (t.startsWith('📌')) {
      el.innerHTML = `<span class="ico-wrap ico-wrap--info">${lllIcon('pin', 18)}</span><span>${t.slice(2).trim()}</span>`;
      el.dataset.icoDone = '1';
    } else if (t.startsWith('⚠️')) {
      el.innerHTML = `<span class="ico-wrap ico-wrap--warn">${lllIcon('alert', 18)}</span><span>${t.slice(2).trim()}</span>`;
      el.dataset.icoDone = '1';
    }
  });

  document.querySelectorAll('.exercise-card h3, .warn-box').forEach(el => replaceLeadingEmoji(el, 20));

  document.querySelectorAll('.field label, .topic-item, .main h2').forEach(el => replaceLeadingEmoji(el, 18));

  document.querySelectorAll('.dropdown > a').forEach(el => {
    const html = el.innerHTML.replace(/▾/g, lllIcon('chevron', 14));
    if (html !== el.innerHTML) el.innerHTML = html;
  });

  document.querySelectorAll('.modal-dl-btn').forEach(el => {
    if (el.textContent.includes('⬇')) el.innerHTML = lllIcon('download', 16) + ' Скачать';
  });
  document.querySelectorAll('.modal-close').forEach(el => {
    if (el.textContent.includes('✕')) el.innerHTML = lllIcon('close', 18);
  });
}

document.addEventListener('DOMContentLoaded', initLegalIcons);
window.lllIcon = lllIcon;
window.initLegalIcons = initLegalIcons;
