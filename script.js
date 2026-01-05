const body = document.body;
const toggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const tabs = document.querySelectorAll('.nav button[data-tab]');
const sections = document.querySelectorAll('main section');
const subnav = document.getElementById('docsSubnav');

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const sidebar = document.getElementById('sidebar');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const mobileLangToggle = document.getElementById('mobileLangToggle');

async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.js`);
    const scriptContent = await response.text();
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.head.appendChild(script);
    document.head.removeChild(script);
    return window.i18n[lang];
  } catch (error) {
    console.error(`Failed to load ${lang} translation:`, error);
    const backup = localStorage.getItem(`i18n_${lang}`);
    if (backup) return JSON.parse(backup);
    const fallbackLang = lang === 'ru' ? 'en' : 'ru';
    return await loadTranslations(fallbackLang);
  }
}

let currentLang = localStorage.getItem('lang') || 'ru';
let i18n = {};

function updateFunctionComments(lang) {
  if (!i18n[lang]?.comments) return;
  const comments = i18n[lang].comments;
  Object.keys(comments).forEach(sectionId => {
    const sectionComments = comments[sectionId];
    Object.keys(sectionComments).forEach(funcName => {
      const commentText = sectionComments[funcName];
      if (commentText) {
        const paragraphs = document.querySelectorAll(`#${sectionId} p`);
        paragraphs.forEach(p => {
          const text = p.textContent.trim();
          if (text.includes(`${funcName}(`)) {
            const codeElement = p.querySelector('code');
            if (codeElement) {
              const funcCall = codeElement.textContent;
              p.innerHTML = `<code>${funcCall}</code> <span style="color:var(--muted);font-size:14px">${commentText}</span>`;
            }
          }
        });
      }
    });
  });
}

function applyLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let text = i18n[lang];
    for (const k of keys) {
      if (text?.[k] !== undefined) text = text[k];
      else { text = key; break; }
    }
    if (typeof text === 'string') el.textContent = text;
  });
  const langText = i18n[lang].langToggle;
  langToggle.textContent = langText;
  if (mobileLangToggle) {
    mobileLangToggle.textContent = lang === 'ru' ? 'ru' : 'en';
  }
  document.documentElement.lang = lang;
  updateFunctionComments(lang);
}

async function initTranslations() {
  const [ruTranslations, enTranslations] = await Promise.all([
    loadTranslations('ru'),
    loadTranslations('en')
  ]);
  i18n = { ru: ruTranslations, en: enTranslations };
  localStorage.setItem('i18n_ru', JSON.stringify(ruTranslations));
  localStorage.setItem('i18n_en', JSON.stringify(enTranslations));
  
  const theme = localStorage.getItem('theme') || 'dark';
  body.dataset.theme = theme;
  updateThemeButtons(theme);
  applyLanguage(currentLang);
}

function updateThemeButtons(theme) {
  const isDark = theme === 'dark';
  toggle.textContent = isDark ? '🌙 / ☀️' : '☀️ / 🌙';
  if (mobileThemeToggle) {
    mobileThemeToggle.textContent = isDark ? '🌙' : '☀️';
  }
}

function toggleMobileMenu() {
  const isVisible = sidebar.classList.toggle('mobile-visible');
  if (mobileOverlay) {
    mobileOverlay.classList.toggle('visible', isVisible);
  }
  body.style.overflow = isVisible ? 'hidden' : '';
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileOverlay) {
  mobileOverlay.addEventListener('click', toggleMobileMenu);
}

document.querySelectorAll('.nav button, .subnav button').forEach(button => {
  button.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      toggleMobileMenu();
    }
  });
});

function toggleTheme() {
  const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
  updateThemeButtons(newTheme);
}

if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('click', toggleTheme);
}

toggle.addEventListener('click', toggleTheme);

if (mobileLangToggle) {
  mobileLangToggle.addEventListener('click', () => {
    applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
  });
}

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
});

function openTab(id) {
  tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  subnav.style.display = id === 'docs' ? 'block' : 'none';
  location.hash = id;
}

tabs.forEach(b => {
  b.addEventListener('click', () => openTab(b.dataset.tab));
});

document.querySelectorAll('.subnav button').forEach(b => {
  b.addEventListener('click', () => {
    openTab('docs');
    document.querySelectorAll('details').forEach(d => d.open = false);
    const d = document.getElementById(b.dataset.doc);
    if (d) {
      d.open = true;
      d.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && sidebar.classList.contains('mobile-visible')) {
    sidebar.classList.remove('mobile-visible');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    body.style.overflow = '';
  }
});

initTranslations().then(() => {
  const hash = location.hash.replace('#', '');
  openTab(hash || 'intro');
});

window.addEventListener('hashchange', () => {
  const hash = location.hash.replace('#', '');
  if (hash) openTab(hash);
});