const body = document.body;
const toggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const tabs = document.querySelectorAll('.nav button[data-tab]');
const sections = document.querySelectorAll('main section');
const subnav = document.getElementById('docsSubnav');

const i18n = {
  ru: {
    title: "LuaPlayerYT",
    nav: {
      intro: "Основная информация",
      build: "Сборка",
      docs: "Документация движка",
      additional: "Дополнительная информация",
      buttons: "buttons — Кнопки",
      color: "Color — Цвет",
      image: "Image — Изображения",
      intrafont: "intraFont — Шрифты",
      system: "System — Система",
      screen: "screen — Экран",
      sound: "sound — Звук",
      pmp: "pmp — PMP видео",
      lua: "LUA — Базовые функции",
      timer: "timer — Таймеры"
    },
    intro: {
      title: "Основная информация",
      text: "LuaPlayerYT — современный LuaPlayer для PSP с открытым исходным кодом, ориентированный на расширяемость и широкий функционал.",
      repos: "Репозитории",
      mainRepo: "Основной репозиторий → ",
      forks: "Форки",
      fork1: "1. Форк движка от entitybtw, ориентированный на кастомизацию. Создается для порта Minecraft: Story Mode для PSP [mcsm_portable]. Форк сохраняет все оригинальные ассеты и добавляет гибкую настройку экрана ошибок (звук, шрифт, изображение), для сборки используется скрипт build.sh.",
      forkRepo: "Репозиторий → "
    },
    build: {
      title: "Сборка",
      mainRepo: "Основной репозиторий",
      step1: "1. Установите PSPSDK согласно ",
      step2: "2. Склонируйте репозиторий:",
      step3: "3. Выполните сборку:",
      autoBuild: "В репозитории настроена автосборка EBOOT.PBP при каждом изменении. Готовые сборки из актуального кода доступны в ",
      forkRepo: "Форк от entitybtw",
      fork1: "1. Установите PSPSDK.",
      fork2: "2. Склонируйте репозиторий:",
      fork3: "3. Запустите сборку:",
      forkAutoBuild: "Форк также использует автосборку EBOOT.PBP. Актуальные сборки доступны в "
    },
    docs: {
      title: "Документация движка",
      updated: {
        main: "LuaPlayerYT 0.5 beta 3 — документация основаная на LuaPlayerYT LLS от ильи' antim0118",
        date: "Обновлено: 31 декабря 2025"
      },
      buttons: "buttons — Кнопки",
      color: "Color — Цвет",
      image: "Image — Изображения",
      align: "Выравнивание",
      constant: "Константа",
      value: "Значение",
      functions: "Функции",
      intrafont: "intraFont — Шрифты",
      scroll: "Скроллинг",
      system: "System — Система",
      screen: "screen — Экран",
      sound: "sound — Звук",
      pmp: "pmp — PMP видео",
      lua: "LUA — Базовые функции",
      timer: "timer — Таймеры",
      name: "Имя"
    },
    additional: {
      title: "Дополнительная информация",
      projects: "Проекты которые делают на LuaPlayerYT:",
      lls: "LuaPlayerYT LLS для vscode от antim0118",
      install: "Установка",
      step1: "1. скачать расширение Lua (или Lua Language Server от sumneko)",
      step2: "2. распаковать архив с папкой LLS в удобное место (ССЫЛКА НА СКАЧКУ АРХИВА НАХОДИТСЯ НИЖЕ)",
      step3: "3. указать путь к распакованной папке LLS в настройках: File - Preferences - Settings - вкладка User. В поиске пишем Lua.workspace.library и в этом пункте вписываем путь.",
      link: "Ссылка на архив текущей версии LuaPlayerYT LLS:",
      credits: "Справка",
      credit1: "> движок сделан Иваном Kodilo",
      credit2: "> данный вебсайт сделан entitybtw / ",
      credit3: "> LuaPlayerYT LLS сделан ильей' antim0118",
      credit4: "> Основным репозиторием LuaPlayerYT владеет илья' antim0118",
      credit5: "> спасибо cxplay_1465 за помощь с комментами для документации движка"
    },
    themeToggle: "🌙 / ☀️",
    langToggle: "ru / en"
  },
  en: {
    title: "LuaPlayerYT",
    nav: {
      intro: "General Information",
      build: "Build",
      docs: "Engine Documentation",
      additional: "Additional Information",
      buttons: "buttons",
      color: "Color",
      image: "Image",
      intrafont: "intraFont",
      system: "System",
      screen: "screen",
      sound: "sound",
      pmp: "PMP",
      lua: "LUA",
      timer: "timer"
    },
    intro: {
      title: "General Information",
      text: "LuaPlayerYT is a modern open-source LuaPlayer for PSP focused on extensibility and rich functionality.",
      repos: "Repositories",
      mainRepo: "Main repository → ",
      forks: "Forks",
      fork1: "1. entitybtw's fork focused on customization. Created for Minecraft: Story Mode PSP port [mcsm_portable]. Keeps all original assets and adds flexible error screen customization (sound, font, image), uses build.sh script.",
      forkRepo: "Repository → "
    },
    build: {
      title: "Build",
      mainRepo: "Main Repository",
      step1: "1. Install PSPSDK according to ",
      step2: "2. Clone repository:",
      step3: "3. Build:",
      autoBuild: "Repository has auto-build EBOOT.PBP on every change. Latest builds available at ",
      forkRepo: "entitybtw Fork",
      fork1: "1. Install PSPSDK.",
      fork2: "2. Clone repository:",
      fork3: "3. Run build:",
      forkAutoBuild: "Fork also uses auto-build EBOOT.PBP. Latest builds available at "
    },
    docs: {
      title: "Engine Documentation",
      updated: {
        main: "LuaPlayerYT 0.5 beta 3 — documentation based on LuaPlayerYT LLS by илья' antim0118",
        date: "Updated: December 31, 2025"
      },
      buttons: "buttons",
      color: "Color",
      image: "Image",
      align: "Alignment",
      constant: "Constant",
      value: "Value",
      functions: "Functions",
      intrafont: "intraFont",
      scroll: "Scrolling",
      system: "System",
      screen: "screen",
      sound: "sound",
      pmp: "PMP video",
      lua: "LUA - Basic functions",
      timer: "timer",
      name: "Name"
    },
    additional: {
      title: "Additional Information",
      projects: "Projects using LuaPlayerYT:",
      lls: "LuaPlayerYT LLS for VSCode by antim0118",
      install: "Installation",
      step1: "1. Install Lua extension (or sumneko Lua Language Server)",
      step2: "2. Extract LLS folder archive to convenient location (DOWNLOAD LINK BELOW)",
      step3: "3. Set path to extracted LLS folder in settings: File → Preferences → Settings → User tab. Search Lua.workspace.library and enter the path.",
      link: "Link to current LuaPlayerYT LLS archive:",
      credits: "Credits",
      credit1: "> Engine made by Ivan Kodilo",
      credit2: "> This website made by entitybtw / ",
      credit3: "> LuaPlayerYT LLS made by илья' antim0118",
      credit4: "> Main LuaPlayerYT repository owned by илья' antim0118",
      credit5: "> Thanks to cxplay_1465 for helping with comments for the engine documentation."
    },
    themeToggle: "🌙 / ☀️",
    langToggle: "en / ru"
  }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let text = i18n[lang];
    keys.forEach(k => text = text[k]);
    el.textContent = text;
  });
  document.getElementById('langToggle').textContent = lang === 'ru' ? 'ru / en' : 'en / ru';
  document.documentElement.lang = lang;
}

body.dataset.theme = localStorage.getItem('theme') || 'dark';
applyLanguage(currentLang);

document.getElementById('themeToggle').onclick = () => {
  const t = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = t;
  localStorage.setItem('theme', t);
};

document.getElementById('langToggle').onclick = () => {
  applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
};

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

openTab(location.hash.replace('#', '') || 'intro');
