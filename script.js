const body = document.body
const toggle = document.getElementById('themeToggle')
const langToggle = document.getElementById('langToggle')
const tabs = document.querySelectorAll('.nav button[data-tab]')
const sections = document.querySelectorAll('main section')
const subnavButtons = document.querySelectorAll('.subnav button[data-doc]')
const subnav = document.getElementById('docsSubnav')
const mobileMenuToggle = document.getElementById('mobileMenuToggle')
const mobileOverlay = document.getElementById('mobileOverlay')
const sidebar = document.getElementById('sidebar')
const mobileThemeToggle = document.getElementById('mobileThemeToggle')
const mobileLangToggle = document.getElementById('mobileLangToggle')
const downloadBtn = document.getElementById('downloadBtn')
const downloadMobileBtn = document.getElementById('downloadMobileBtn')
const downloadModal = document.getElementById('downloadModal')
const closeModalBtn = document.querySelector('.download-modal-close')
const versionSelect = document.getElementById('versionSelect')
const langSelect = document.getElementById('langSelect')
const offlineFiles = document.getElementById('offlineFiles')
let currentLang = localStorage.getItem('lang') || 'ru'
let i18n = {}
let offlineDocsData = null

function parseHash() {
  const parts = location.hash.replace('#', '').split('/').filter(Boolean)
  const state = {}
  parts.forEach(p => {
    if (p === 'dark' || p === 'light') state.theme = p
    else if (p === 'ru' || p === 'en') state.lang = p
    else state.tab = p
  })
  return state
}

function updateHash(state) {
  const parts = []
  if (state.tab) parts.push(state.tab)
  if (state.theme) parts.push(state.theme)
  if (state.lang) parts.push(state.lang)
  const h = '#' + parts.join('/')
  if (location.hash !== h) location.hash = h
}

async function loadTranslations(lang) {
  const r = await fetch(`locales/${lang}.js`)
  const t = await r.text()
  const s = document.createElement('script')
  s.textContent = t
  document.head.appendChild(s)
  document.head.removeChild(s)
  return window.i18n[lang]
}

function updateFunctionComments(lang) {
  if (!i18n[lang]?.comments) return
  const comments = i18n[lang].comments
  Object.keys(comments).forEach(sectionId => {
    const sectionComments = comments[sectionId]
    Object.keys(sectionComments).forEach(funcName => {
      const commentText = sectionComments[funcName]
      if (!commentText) return
      const paragraphs = document.querySelectorAll(`#${sectionId} p`)
      paragraphs.forEach(p => {
        const codeElement = p.querySelector('code')
        if (codeElement && codeElement.textContent.includes(funcName + '(')) {
          const funcCall = codeElement.textContent
          p.innerHTML = `<code>${funcCall}</code> <span style="color:var(--muted);font-size:14px">${commentText}</span>`
        }
      })
    })
  })
}

function applyLanguage(lang, skipHash) {
  if (!i18n[lang]) return
  currentLang = lang
  localStorage.setItem('lang', lang)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const path = el.dataset.i18n.split('.')
    let v = i18n[lang]
    for (const k of path) {
      if (v?.[k] !== undefined) v = v[k]
      else return
    }
    if (typeof v === 'string') el.textContent = v
  })
  document.documentElement.lang = lang
  if (mobileLangToggle) mobileLangToggle.textContent = lang
  updateFunctionComments(lang)
  if (!skipHash) {
    const st = parseHash()
    st.lang = lang
    updateHash(st)
  }
}

function setTheme(theme, skipHash) {
  body.dataset.theme = theme
  localStorage.setItem('theme', theme)
  toggle.textContent = theme === 'dark' ? '🌙 / ☀️' : '☀️ / 🌙'
  if (mobileThemeToggle) mobileThemeToggle.textContent = theme === 'dark' ? '🌙' : '☀️'
  if (!skipHash) {
    const st = parseHash()
    st.theme = theme
    updateHash(st)
  }
}

async function initTranslations() {
  const [ru, en] = await Promise.all([loadTranslations('ru'), loadTranslations('en')])
  i18n = { ru, en }
}

function openTab(id, skipHash) {
  tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id))
  sections.forEach(s => s.classList.toggle('active', s.id === id))
  subnav.style.display = id === 'docs' ? 'block' : 'none'
  if (!skipHash) {
    const st = parseHash()
    st.tab = id
    updateHash(st)
  }
}
subnavButtons.forEach(b =>
  b.addEventListener('click', () => {
    openTab('docs')
    const target = document.getElementById(b.dataset.doc)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.innerWidth <= 768) toggleMobileMenu()
  })
)


function toggleTheme() {
  setTheme(body.dataset.theme === 'dark' ? 'light' : 'dark')
}

function toggleMobileMenu() {
  const v = sidebar.classList.toggle('mobile-visible')
  if (mobileOverlay) mobileOverlay.classList.toggle('visible', v)
  body.style.overflow = v ? 'hidden' : ''
}

function openDownloadModal() {
  downloadModal.classList.add('active')
  body.style.overflow = 'hidden'
  loadOfflineDocs()
}

function closeDownloadModal() {
  downloadModal.classList.remove('active')
  body.style.overflow = ''
}

async function loadOfflineDocs() {
  try {
    const r = await fetch('offline-docs/manifest.json')
    offlineDocsData = await r.json()
    versionSelect.innerHTML = `<option value="">${i18n[currentLang].download.selectVersion}</option>`
    offlineDocsData.versions.forEach(d => {
      const o = document.createElement('option')
      o.value = d.folder
      o.textContent = d.display
      versionSelect.appendChild(o)
    })
  } catch {
    offlineFiles.textContent = i18n[currentLang].download.offline.error
  }
}

function updateFilesList() {
  if (!offlineDocsData) return
  const d = versionSelect.value
  const l = langSelect.value
  if (!d) {
    offlineFiles.textContent = i18n[currentLang].download.selectVersionPrompt
    return
  }
  const data = offlineDocsData.versions.find(x => x.folder === d)
  const files = data?.files?.[l]
  offlineFiles.innerHTML = ''
  if (!files || !files.length) {
    offlineFiles.textContent = i18n[currentLang].download.noFiles
    return
  }
  files.forEach(f => {
    const a = document.createElement('a')
    a.href = f.url
    a.download = f.name
    a.className = 'download-file-item'
    a.innerHTML = `<span>${f.name}</span><span>${f.size || ''}</span>`
    offlineFiles.appendChild(a)
  })
}

toggle.addEventListener('click', toggleTheme)
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme)
langToggle.addEventListener('click', () => applyLanguage(currentLang === 'ru' ? 'en' : 'ru'))
if (mobileLangToggle) mobileLangToggle.addEventListener('click', () => applyLanguage(currentLang === 'ru' ? 'en' : 'ru'))
tabs.forEach(b => b.addEventListener('click', () => openTab(b.dataset.tab)))
if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu)
if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu)
if (downloadBtn) downloadBtn.addEventListener('click', openDownloadModal)
if (downloadMobileBtn) downloadMobileBtn.addEventListener('click', openDownloadModal)
if (closeModalBtn) closeModalBtn.addEventListener('click', closeDownloadModal)
downloadModal.addEventListener('click', e => { if (e.target === downloadModal) closeDownloadModal() })
versionSelect.addEventListener('change', updateFilesList)
langSelect.addEventListener('change', updateFilesList)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('mobile-visible')
    if (mobileOverlay) mobileOverlay.classList.remove('visible')
    body.style.overflow = ''
  }
})

initTranslations().then(() => {
  const st = parseHash()
  const theme = st.theme || localStorage.getItem('theme') || 'dark'
  const lang = st.lang || localStorage.getItem('lang') || 'ru'
  const tab = st.tab || 'intro'
  setTheme(theme, true)
  applyLanguage(lang, true)
  openTab(tab, true)
  updateHash({ tab, theme, lang })
})

window.addEventListener('hashchange', () => {
  const st = parseHash()
  if (st.theme && st.theme !== body.dataset.theme) setTheme(st.theme, true)
  if (st.lang && st.lang !== currentLang) applyLanguage(st.lang, true)
  if (st.tab) openTab(st.tab, true)
})
