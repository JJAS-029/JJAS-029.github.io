(() => {
  const LANG_KEY = 'jjas_lang';
  const THEME_KEY = 'jjas_theme';
  const root = document.documentElement;

  function detectLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'zh') return saved;
    const nav = (navigator.language || 'es').toLowerCase();
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('zh')) return 'zh';
    return 'en';
  }

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang === 'zh' ? 'zh-CN' : lang;
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
    });
  }

  function getEffectiveTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, persist = false) {
    root.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply immediately
  applyLang(detectLang());
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme, false);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(root.getAttribute('data-lang') || detectLang());
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.textContent = getEffectiveTheme() === 'dark' ? '☀️' : '🌙';
      themeBtn.addEventListener('click', () => {
        const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }

    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => applyLang(btn.dataset.setLang));
    });

    // Expandable descriptions on Podcasts page
    document.querySelectorAll('[data-toggle-desc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.podcast-body');
        const desc = card && card.querySelector('.podcast-desc-clamped');
        if (!desc) return;
        const expanded = desc.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', String(expanded));
      });
    });
  });
})();
