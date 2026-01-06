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
const downloadBtn = document.getElementById('downloadBtn');
const downloadMobileBtn = document.getElementById('downloadMobileBtn');
const downloadModal = document.getElementById('downloadModal');
const dateSelect = document.getElementById('dateSelect');
const langSelect = document.getElementById('langSelect');
const offlineFiles = document.getElementById('offlineFiles');
const closeModalBtn = document.querySelector('.download-modal-close');

function getUrlState() {
    const hash = window.location.hash.replace('#', '');
    const params = hash.split('/');
    const state = {};
    
    params.forEach(param => {
        if (param === 'light' || param === 'dark') {
            state.theme = param;
        } else if (param === 'ru' || param === 'en') {
            state.lang = param;
        } else if (param && param !== '#') {
            state.tab = param;
        }
    });
    
    return state;
}

function updateUrl(state) {
    const parts = [];
    
    if (state.tab) parts.push(state.tab);
    if (state.theme) parts.push(state.theme);
    if (state.lang) parts.push(state.lang);
    
    const newHash = parts.length > 0 ? '#' + parts.join('/') : '#intro';
    if (window.location.hash !== newHash) {
        window.location.hash = newHash;
    }
}

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
  
  const currentState = getUrlState();
  currentState.lang = lang;
  updateUrl(currentState);
}

async function initTranslations() {
  const [ruTranslations, enTranslations] = await Promise.all([
    loadTranslations('ru'),
    loadTranslations('en')
  ]);
  i18n = { ru: ruTranslations, en: enTranslations };
  localStorage.setItem('i18n_ru', JSON.stringify(ruTranslations));
  localStorage.setItem('i18n_en', JSON.stringify(enTranslations));
  
  const urlState = getUrlState();
  
  const theme = urlState.theme || localStorage.getItem('theme') || 'dark';
  body.dataset.theme = theme;
  updateThemeButtons(theme);
  
  const lang = urlState.lang || localStorage.getItem('lang') || 'ru';
  applyLanguage(lang);
  
  openTab(urlState.tab || 'intro');
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
  
  const currentState = getUrlState();
  currentState.theme = newTheme;
  updateUrl(currentState);
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
  
  const currentState = getUrlState();
  currentState.tab = id;
  updateUrl(currentState);
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

let offlineDocsData = null;

function openDownloadModal() {
  downloadModal.classList.add('active');
  body.style.overflow = 'hidden';
  loadOfflineDocs();
}

function closeDownloadModal() {
  downloadModal.classList.remove('active');
  body.style.overflow = '';
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', openDownloadModal);
}

if (downloadMobileBtn) {
  downloadMobileBtn.addEventListener('click', openDownloadModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeDownloadModal);
}

downloadModal.addEventListener('click', (e) => {
  if (e.target === downloadModal) {
    closeDownloadModal();
  }
});

async function loadOfflineDocs() {
  try {
    const response = await fetch('offline-docs/manifest.json');
    if (!response.ok) throw new Error('Manifest not found');
    
    offlineDocsData = await response.json();
    
    const selectDateText = i18n[currentLang]?.download?.selectDate || 'Выберите дату';
    dateSelect.innerHTML = `<option value="">${selectDateText}</option>`;
    
    if (offlineDocsData.dates && offlineDocsData.dates.length > 0) {
      offlineDocsData.dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date.folder;
        option.textContent = date.display;
        dateSelect.appendChild(option);
      });
      
      dateSelect.value = offlineDocsData.dates[0].folder;
      updateFilesList();
    } else {
      const errorText = i18n[currentLang]?.download?.offline?.error || 'Оффлайн версии не найдены';
      offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${errorText}</div>`;
    }
  } catch (error) {
    console.error('Failed to load offline docs:', error);
    const errorText = i18n[currentLang]?.download?.offline?.error || 'Оффлайн версии не найдены';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${errorText}</div>`;
  }
}

function updateFilesList() {
  if (!offlineDocsData) return;
  
  const selectedDate = dateSelect.value;
  const selectedLang = langSelect.value;
  
  if (!selectedDate) {
    const promptText = i18n[currentLang]?.download?.selectDatePrompt || 'Выберите дату';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${promptText}</div>`;
    return;
  }
  
  const dateData = offlineDocsData.dates.find(d => d.folder === selectedDate);
  if (!dateData || !dateData.files || !dateData.files[selectedLang]) {
    const noFilesText = i18n[currentLang]?.download?.noFiles || 'Файлы не найдены';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${noFilesText}</div>`;
    return;
  }
  
  const files = dateData.files[selectedLang];
  offlineFiles.innerHTML = '';
  
  if (files.length > 0) {
    files.forEach(file => {
      const fileItem = document.createElement('a');
      fileItem.href = file.url;
      fileItem.className = 'download-file-item';
      fileItem.download = file.name;
      
      const fileName = document.createElement('span');
      fileName.className = 'download-file-name';
      fileName.textContent = file.name;
      
      const fileSize = document.createElement('span');
      fileSize.className = 'download-file-size';
      fileSize.textContent = file.size || '';
      
      fileItem.appendChild(fileName);
      fileItem.appendChild(fileSize);
      offlineFiles.appendChild(fileItem);
    });
  } else {
    const noFilesText = i18n[currentLang]?.download?.noFiles || 'Файлы не найдены';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${noFilesText}</div>`;
  }
}

dateSelect.addEventListener('change', updateFilesList);
langSelect.addEventListener('change', updateFilesList);

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && sidebar.classList.contains('mobile-visible')) {
    sidebar.classList.remove('mobile-visible');
    if (mobileOverlay) mobileOverlay.classList.remove('visible');
    body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
    closeDownloadModal();
  }
});

initTranslations();

window.addEventListener('hashchange', () => {
  const urlState = getUrlState();
  
  if (urlState.theme && urlState.theme !== body.dataset.theme) {
    body.dataset.theme = urlState.theme;
    localStorage.setItem('theme', urlState.theme);
    updateThemeButtons(urlState.theme);
  }
  
  if (urlState.lang && urlState.lang !== currentLang) {
    applyLanguage(urlState.lang);
  }
  
  if (urlState.tab) {
    openTab(urlState.tab);
  } else {
    openTab('intro');
  }
});