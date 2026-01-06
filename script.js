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

function openDownloadModal() {
  downloadModal.classList.add('active');
  body.style.overflow = 'hidden';
  updateDownloadModalTexts(currentLang);
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

function updateDownloadModalTexts(lang) {
  if (!i18n[lang]?.download) return;
  
  const texts = i18n[lang].download;
  
  const modalTitle = document.querySelector('.download-modal-header h3');
  if (modalTitle && texts.title) {
    modalTitle.textContent = texts.title;
  }
  
  const offlineTitle = document.querySelector('.download-option:nth-child(1) h4');
  const onlineTitle = document.querySelector('.download-option:nth-child(2) h4');
  if (offlineTitle && texts.offline?.title) offlineTitle.textContent = texts.offline.title;
  if (onlineTitle && texts.online?.title) onlineTitle.textContent = texts.online.title;
  
  const offlineDesc = document.querySelector('.download-option:nth-child(1) p');
  const onlineDesc = document.querySelector('.download-option:nth-child(2) p');
  if (offlineDesc && texts.offline?.desc) offlineDesc.textContent = texts.offline.desc;
  if (onlineDesc && texts.online?.desc) onlineDesc.textContent = texts.online.desc;
  
  const githubLink = document.querySelector('.github-link span');
  if (githubLink && texts.online?.link) githubLink.textContent = texts.online.link;
  
  const dateSelectOption = document.querySelector('#dateSelect option[value=""]');
  if (dateSelectOption && texts.selectDate) {
    dateSelectOption.textContent = texts.selectDate;
  }
  
  const langOptions = document.querySelectorAll('#langSelect option');
  if (langOptions.length >= 2 && texts.lang) {
    langOptions[0].textContent = texts.lang.ru;
    langOptions[1].textContent = texts.lang.en;
  }
}

async function loadOfflineDocs() {
  try {
    const response = await fetch('offline-docs/');
    if (!response.ok) {
      throw new Error('Directory listing not available');
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a[href]'));
    
    const dates = [];
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.match(/^\d{2}-\d{2}-\d{2}\/$/)) {
        const folder = href.replace('/', '');
        const dateParts = folder.split('-');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = 2000 + parseInt(dateParts[2], 10);
        const date = new Date(year, month, day);
        
        let displayDate;
        if (currentLang === 'ru') {
          displayDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        } else {
          displayDate = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        }
        
        dates.push({
          folder: folder,
          display: displayDate
        });
      }
    });
    
    dates.sort((a, b) => {
      const dateA = a.folder.split('-').reverse().join('');
      const dateB = b.folder.split('-').reverse().join('');
      return dateB.localeCompare(dateA);
    });
    
    processDocsData({ dates: dates });
    
  } catch (error) {
    console.error('Failed to load offline docs:', error);
    const errorText = i18n[currentLang]?.download?.offline?.error || 'Оффлайн версии не найдены';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${errorText}</div>`;
  }
}

function processDocsData(data) {
  const selectDateText = i18n[currentLang]?.download?.selectDate || 'Выберите дату';
  dateSelect.innerHTML = `<option value="">${selectDateText}</option>`;
  
  if (data.dates && Array.isArray(data.dates)) {
    data.dates.forEach(date => {
      const option = document.createElement('option');
      option.value = date.folder;
      option.textContent = date.display;
      dateSelect.appendChild(option);
    });
  }
  
  dateSelect.addEventListener('change', updateFilesList);
  langSelect.addEventListener('change', updateFilesList);
  
  if (data.dates && data.dates.length > 0) {
    dateSelect.value = data.dates[0].folder;
    updateFilesList();
  }
}

async function updateFilesList() {
  const selectedDate = dateSelect.value;
  const selectedLang = langSelect.value;
  
  if (!selectedDate) {
    const promptText = i18n[currentLang]?.download?.selectDatePrompt || 'Выберите дату';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${promptText}</div>`;
    return;
  }
  
  const loadingText = currentLang === 'ru' ? 'Загрузка файлов...' : 'Loading files...';
  offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${loadingText}</div>`;
  
  try {
    const response = await fetch(`offline-docs/${selectedDate}/${selectedLang}/`);
    if (!response.ok) throw new Error('Directory not found');
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a[href]'));
    
    const zipFiles = [];
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.endsWith('/') && (href.toLowerCase().endsWith('.zip') || href.toLowerCase().endsWith('.rar') || href.toLowerCase().endsWith('.7z'))) {
        zipFiles.push({
          name: link.textContent.trim() || href,
          href: `offline-docs/${selectedDate}/${selectedLang}/${href}`
        });
      }
    });
    
    offlineFiles.innerHTML = '';
    
    if (zipFiles.length > 0) {
      zipFiles.forEach(file => {
        const fileItem = document.createElement('a');
        fileItem.href = file.href;
        fileItem.className = 'download-file-item';
        fileItem.download = file.name;
        
        const fileName = document.createElement('span');
        fileName.className = 'download-file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'download-file-size';
        fileSize.textContent = '...';
        
        fetch(file.href, { method: 'HEAD' })
          .then(headResponse => {
            const size = headResponse.headers.get('content-length');
            if (size) {
              const sizeMB = (size / (1024 * 1024)).toFixed(1);
              fileSize.textContent = `${sizeMB} MB`;
            } else {
              fileSize.textContent = '';
            }
          })
          .catch(() => {
            fileSize.textContent = '';
          });
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileSize);
        offlineFiles.appendChild(fileItem);
      });
    } else {
      const noFilesText = i18n[currentLang]?.download?.noFiles || 'Файлы не найдены';
      offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${noFilesText}</div>`;
    }
  } catch (error) {
    console.error('Failed to load files:', error);
    const errorText = i18n[currentLang]?.download?.loadError || 'Ошибка загрузки файлов';
    offlineFiles.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 20px;">${errorText}</div>`;
  }
}

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