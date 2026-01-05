const body = document.body;
const toggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const tabs = document.querySelectorAll('.nav button[data-tab]');
const sections = document.querySelectorAll('main section');
const subnav = document.getElementById('docsSubnav');

// Загружаем переводы асинхронно
async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.js`);
    const scriptContent = await response.text();
    
    // Выполняем скрипт, чтобы добавить перевод в window.i18n
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.head.appendChild(script);
    document.head.removeChild(script);
    
    return window.i18n[lang];
  } catch (error) {
    console.error(`Failed to load ${lang} translation:`, error);
    
    // Загружаем резервный перевод из localStorage если есть
    const backup = localStorage.getItem(`i18n_${lang}`);
    if (backup) {
      return JSON.parse(backup);
    }
    
    // Если загрузка не удалась, загружаем другой язык
    const fallbackLang = lang === 'ru' ? 'en' : 'ru';
    return await loadTranslations(fallbackLang);
  }
}

let currentLang = localStorage.getItem('lang') || 'ru';
let i18n = {};

// Функция для обновления комментариев к функциям
function updateFunctionComments(lang) {
  if (!i18n[lang] || !i18n[lang].comments) return;
  
  const comments = i18n[lang].comments;
  
  // Обновляем комментарии для каждой секции документации
  Object.keys(comments).forEach(sectionId => {
    const sectionComments = comments[sectionId];
    Object.keys(sectionComments).forEach(funcName => {
      const commentText = sectionComments[funcName];
      if (commentText) {
        // Находим все элементы <p> которые содержат функцию
        const paragraphs = document.querySelectorAll(`#${sectionId} p`);
        paragraphs.forEach(p => {
          const text = p.textContent.trim();
          if (text.startsWith(`<code>${funcName}(`) || 
              text.startsWith(`<code>${sectionId}.${funcName}(`) ||
              text.includes(`${funcName}(`)) {
            // Находим элемент кода внутри параграфа
            const codeElement = p.querySelector('code');
            if (codeElement) {
              // Создаем новый контент с комментарием
              const funcCall = codeElement.textContent;
              const newContent = document.createElement('div');
              newContent.innerHTML = `<code>${funcCall}</code>`;
              
              // Добавляем комментарий только если он есть
              if (commentText.trim()) {
                const commentSpan = document.createElement('span');
                commentSpan.textContent = ` ${commentText}`;
                commentSpan.style.color = 'var(--muted)';
                commentSpan.style.fontSize = '14px';
                newContent.appendChild(commentSpan);
              }
              
              // Заменяем содержимое параграфа
              p.innerHTML = '';
              p.appendChild(newContent);
            }
          }
        });
      }
    });
  });
  
  // Обновляем специальные комментарии в секции buttons
  if (sectionId === 'buttons' && lang === 'ru') {
    const buttonsIntro = document.querySelector('#buttons p');
    if (buttonsIntro && buttonsIntro.textContent.includes('считывает состояния кнопок')) {
      buttonsIntro.innerHTML = `<code>buttons.read()</code> ${comments.buttons.read}`;
    }
  }
}

// Основная функция применения языка
function applyLanguage(lang) {
  if (!i18n[lang]) return;
  
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Обновляем все элементы с data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let text = i18n[lang];
    
    // Ищем вложенные свойства
    for (const k of keys) {
      if (text && text[k] !== undefined) {
        text = text[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        text = key;
        break;
      }
    }
    
    if (typeof text === 'string') {
      el.textContent = text;
    }
  });
  
  // Обновляем переключатель языка
  document.getElementById('langToggle').textContent = i18n[lang].langToggle;
  document.documentElement.lang = lang;
  
  // Обновляем комментарии к функциям
  updateFunctionComments(lang);
}

// Инициализация переводов
async function initTranslations() {
  // Загружаем оба перевода
  const [ruTranslations, enTranslations] = await Promise.all([
    loadTranslations('ru'),
    loadTranslations('en')
  ]);
  
  i18n = {
    ru: ruTranslations,
    en: enTranslations
  };
  
  // Сохраняем в localStorage для резервного использования
  localStorage.setItem('i18n_ru', JSON.stringify(ruTranslations));
  localStorage.setItem('i18n_en', JSON.stringify(enTranslations));
  
  // Инициализация темы
  body.dataset.theme = localStorage.getItem('theme') || 'dark';
  
  // Применяем текущий язык
  applyLanguage(currentLang);
}

// Обработчики событий
document.getElementById('themeToggle').onclick = () => {
  const t = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = t;
  localStorage.setItem('theme', t);
};

document.getElementById('langToggle').onclick = () => {
  const newLang = currentLang === 'ru' ? 'en' : 'ru';
  applyLanguage(newLang);
};

// Функции для вкладок
function openTab(id) {
  tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  subnav.style.display = id === 'docs' ? 'block' : 'none';
  location.hash = id;
}

tabs.forEach(b => b.onclick = () => openTab(b.dataset.tab));

document.querySelectorAll('.subnav button').forEach(b => {
  b.onclick = () => {
    openTab('docs');
    document.querySelectorAll('details').forEach(d => d.open = false);
    const d = document.getElementById(b.dataset.doc);
    d.open = true;
    d.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
});

// Инициализация при загрузке
initTranslations().then(() => {
  // Открываем вкладку из hash или по умолчанию
  const hash = location.hash.replace('#', '');
  openTab(hash || 'intro');
});

// Обработка хэша при загрузке
window.addEventListener('hashchange', () => {
  const hash = location.hash.replace('#', '');
  if (hash) openTab(hash);
});