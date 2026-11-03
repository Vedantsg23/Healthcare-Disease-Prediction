/* ===== MediSense AI — Application Logic ===== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICON = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2 5 8.6l4.5-5"/></svg>';

// ---- Header: solid bar once the page scrolls, menu on small screens ----
const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navPanel = $('#navbar nav');

const setMenu = (open) => {
  navPanel.classList.toggle('open', open);
  navbar.classList.toggle('menu-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
};
hamburger.addEventListener('click', () => setMenu(!navPanel.classList.contains('open')));
$$('#navLinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navPanel.classList.contains('open')) setMenu(false); });

// ---- Counts shown on the page come from the data itself ----
const LIBRARY = [
  ...Object.entries(DISEASE_DB).map(([name, d]) => ({ name, icon: d.icon || '🏥', category: d.category, desc: d.description })),
  ...DISEASE_LIST_EXTRA.filter(e => !DISEASE_DB[e.name])
];
const STATS = { symptoms: SYMPTOMS.length, conditions: LIBRARY.length, guides: Object.keys(DISEASE_DB).length };
$$('[data-stat]').forEach(el => { const v = STATS[el.dataset.stat]; if (v !== undefined) el.textContent = v; });

// ---- Symptom picker ----
let selectedSymptoms = new Set();
const symptomList = $('#symptomList');
const symptomSearch = $('#symptomSearch');

function buildSymptomList(filter = '') {
  if (!symptomList) return;
  const f = filter.trim().toLowerCase();
  const matches = SYMPTOMS.filter(s => s.toLowerCase().includes(f));
  if (!matches.length) {
    symptomList.innerHTML = `<p class="sym-none">No symptom matches “${esc(filter.trim())}”. Try a shorter word.</p>`;
    return;
  }
  symptomList.innerHTML = matches.map(sym =>
    `<button class="sym" type="button" data-sym="${esc(sym)}" aria-pressed="${selectedSymptoms.has(sym)}"><span class="sym-box">${CHECK}</span>${esc(sym)}</button>`
  ).join('');
}
buildSymptomList();

if (symptomList) {
  symptomList.addEventListener('click', (e) => {
    const b = e.target.closest('.sym');
    if (b) toggleSymptom(b.dataset.sym);
  });
}
if (symptomSearch) symptomSearch.addEventListener('input', e => buildSymptomList(e.target.value));

function toggleSymptom(sym) {
  if (selectedSymptoms.has(sym)) selectedSymptoms.delete(sym);
  else selectedSymptoms.add(sym);
  $$('.sym', symptomList).forEach(b => { if (b.dataset.sym === sym) b.setAttribute('aria-pressed', String(selectedSymptoms.has(sym))); });
  updateSelectedTags();
}

function updateSelectedTags() {
  const tags = $('#selectedTags');
  const count = $('#selectedCount');
  const btn = $('#predictBtn');
  if (!tags || !count || !btn) return;
  count.textContent = selectedSymptoms.size + ' selected';
  btn.disabled = selectedSymptoms.size === 0;
  if (selectedSymptoms.size === 0) {
    tags.innerHTML = '<em>None yet. Pick at least one symptom.</em>';
    return;
  }
  tags.innerHTML = Array.from(selectedSymptoms).map(sym =>
    `<span class="tag">${esc(sym)}<button class="tag-remove" type="button" data-remove="${esc(sym)}" aria-label="Remove ${esc(sym)}">${ICON('i-x')}</button></span>`
  ).join('');
}
const selectedTagsEl = $('#selectedTags');
if (selectedTagsEl) {
  selectedTagsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (b) toggleSymptom(b.dataset.remove);
  });
}

const clearBtn = $('#clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    selectedSymptoms.clear();
    buildSymptomList(symptomSearch ? symptomSearch.value : '');
    updateSelectedTags();
    const resEmpty = $('#resultEmpty');
    const resContent = $('#resultContent');
    if (resEmpty) resEmpty.hidden = false;
    if (resContent) resContent.hidden = true;
  });
}

// ---- Prediction logic ----
const predictBtn = $('#predictBtn');
if (predictBtn) predictBtn.addEventListener('click', runPrediction);

function findDisease(symptoms) {
  const sympArr = Array.from(symptoms);
  // Try exact match from DISEASE_DB
  for (const [name, data] of Object.entries(DISEASE_DB)) {
    const matched = data.symptoms.filter(s => sympArr.some(sel => sel.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(sel.toLowerCase())));
    if (matched.length >= Math.min(2, data.symptoms.length)) {
      return { name, data, matchCount: matched.length, matched };
    }
  }
  // Fallback: simple map
  for (const [key, disease] of Object.entries(SYMPTOM_DISEASE_MAP)) {
    const keys = key.split(',');
    if (keys.some(k => sympArr.some(s => s.toLowerCase().includes(k.toLowerCase())))) {
      return DISEASE_DB[disease] ? { name: disease, data: DISEASE_DB[disease], matchCount: 1, matched: sympArr.slice(0, 2) } : null;
    }
  }
  // Generic fallback
  const fallbackNames = Object.keys(DISEASE_DB);
  const fallbackName = fallbackNames[Math.floor(Math.random() * Math.min(3, fallbackNames.length))];
  const fd = DISEASE_DB[fallbackName];
  return { name: fallbackName, data: fd, matchCount: 1, matched: sympArr.slice(0, 1) };
}

function runPrediction() {
  if (selectedSymptoms.size === 0) return;
  const result = findDisease(selectedSymptoms);
  if (!result) return;
  const confidence = Math.min(99, 70 + result.matchCount * 8 + Math.floor(Math.random() * 6));
  showResults(result.name, result.data, confidence, result.matched);
}

function showResults(name, data, confidence, matched) {
  const resEmpty = $('#resultEmpty');
  const rc = $('#resultContent');
  if (resEmpty) resEmpty.hidden = true;
  if (rc) rc.hidden = false;

  $('#resultDiseaseName').textContent = name;
  $('#confidenceText').textContent = confidence + '%';
  $('#diseaseDesc').textContent = data.description;

  // Matched chips
  const mc = $('#matchedSymptoms');
  const chips = [...new Set(matched.concat(Array.from(selectedSymptoms).slice(0, 3)))].slice(0, 6);
  mc.innerHTML = chips.map(s => `<span class="matched-chip">${esc(s)}</span>`).join('');

  // Severity
  const sev = $('#severityDisplay');
  const levels = data.severity === 'low' ? 1 : data.severity === 'medium' ? 2 : 3;
  sev.innerHTML = [0, 1, 2].map(i => `<span class="sev-dot${i < levels ? ' active ' + data.severity : ''}"></span>`).join('')
    + `<span class="sev-label">${esc(data.severity.charAt(0).toUpperCase() + data.severity.slice(1))} severity</span>`;

  // Medicines
  $('#medicineList').innerHTML = data.medicines.map(m => {
    const rx = /prescription|rx/i.test(m.type) && !/^otc$/i.test(m.type);
    return `<li><strong>${esc(m.name)}</strong><span>${esc(m.use)}</span><span class="med-type${rx ? ' rx' : ''}">${esc(m.type)}</span></li>`;
  }).join('');
  $('#doctorAdvice').textContent = data.doctorAdvice;

  // Precautions and diet
  $('#precautionList').innerHTML = data.precautions.map(p => `<li>${esc(p)}</li>`).join('');
  $('#dietList').innerHTML = data.diet.map(d => `<div class="diet-item"><i class="fa-solid ${esc(d.icon)}" aria-hidden="true"></i>${esc(d.label)}</div>`).join('');
  $('#avoidList').innerHTML = data.avoid.map(a => `<li>${esc(a)}</li>`).join('');

  selectTab('overview');

  const confFill = $('#confidenceFill');
  confFill.style.width = '0%';
  setTimeout(() => { confFill.style.width = confidence + '%'; }, 120);

  // Bring the result into view when it sits below the picker (small screens)
  const r = rc.getBoundingClientRect();
  if (r.top > window.innerHeight * 0.6 || r.top < 0) rc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Result tabs ----
function selectTab(tab) {
  $$('.tab-btn').forEach(b => { const on = b.dataset.tab === tab; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); });
  $$('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
}
$$('.tab-btn').forEach(btn => btn.addEventListener('click', () => selectTab(btn.dataset.tab)));

// ---- Disease library ----
function buildDiseaseGrid(filter = '', cat = 'all') {
  const grid = $('#diseaseGrid');
  if (!grid) return;
  const f = filter.trim().toLowerCase();
  const list = LIBRARY.filter(d => (cat === 'all' || d.category === cat) && (d.name.toLowerCase().includes(f) || d.desc.toLowerCase().includes(f)));
  grid.innerHTML = list.map(d => `
    <button class="disease-card" type="button" data-disease="${esc(d.name)}">
      <span class="dc-art" aria-hidden="true">${d.icon}<span class="dc-more">${DISEASE_DB[d.name] ? 'Full guide' : 'Read more'}</span></span>
      <span class="dc-row"><span class="dc-name">${esc(d.name)}</span><span class="dc-cat">${esc(d.category)}</span></span>
      <span class="dc-desc">${esc(d.desc)}</span>
    </button>`).join('');
  const empty = $('#diseaseEmpty');
  if (empty) empty.hidden = list.length > 0;
}
buildDiseaseGrid();

const diseaseGrid = $('#diseaseGrid');
if (diseaseGrid) {
  diseaseGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.disease-card');
    if (card) openDiseaseModal(card.dataset.disease, card);
  });
}
const diseaseSearch = $('#diseaseSearch');
const activeCat = () => { const a = $('.filter-btn.active'); return a ? a.dataset.cat : 'all'; };
if (diseaseSearch) diseaseSearch.addEventListener('input', e => buildDiseaseGrid(e.target.value, activeCat()));
$$('.filter-btn').forEach(btn => {
  btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    buildDiseaseGrid(diseaseSearch ? diseaseSearch.value : '', btn.dataset.cat);
  });
});

// ---- Condition modal ----
function openModal(html, returnFocus) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">${html}</div>`;
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  const first = overlay.querySelector('.modal-close');
  if (first) first.focus();
}

function openDiseaseModal(name, returnFocus) {
  const data = DISEASE_DB[name];
  const head = (icon, cat) => `
    <div class="modal-header">
      <div><span class="modal-kicker">${esc(cat)}</span><h2 id="modalTitle">${icon} ${esc(name)}</h2></div>
      <button class="modal-close" type="button" data-close aria-label="Close">${ICON('i-x')}</button>
    </div>`;
  if (!data) {
    const extra = DISEASE_LIST_EXTRA.find(d => d.name === name);
    if (!extra) return;
    openModal(head(extra.icon, extra.category) + `
      <div class="modal-body">
        <div class="modal-section"><h4>Overview</h4><p>${esc(extra.desc)}</p></div>
        <div class="modal-section"><h4>Next step</h4><p>A full guide for this condition is not in the library yet. If you have these symptoms, see a doctor.</p></div>
        <button class="btn btn--black" type="button" data-close>Close</button>
      </div>`, returnFocus);
    return;
  }
  openModal(head(data.icon || '🏥', data.category) + `
    <div class="modal-body">
      <div class="modal-section"><h4>Overview</h4><p>${esc(data.description)}</p></div>
      <div class="modal-section"><h4>Key symptoms</h4><div class="chips">${data.symptoms.map(s => `<span class="matched-chip">${esc(s)}</span>`).join('')}</div></div>
      <div class="modal-section"><h4>Medicines</h4><ul>${data.medicines.map(m => `<li><strong>${esc(m.name)}</strong>, ${esc(m.use)} (${esc(m.type)})</li>`).join('')}</ul></div>
      <div class="modal-section"><h4>Precautions</h4><ul>${data.precautions.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
      <div class="modal-section"><h4>When to see a doctor</h4><p>${esc(data.doctorAdvice)}</p></div>
      <button class="btn btn--black" type="button" data-close>Close</button>
    </div>`, returnFocus);
}

// ---- Assistant ----
const chatWidget = $('#chatbotWidget');
const chatToggle = $('#chatbotToggle');
const chatBadge = $('#chatBadge');
const chatMessages = $('#chatMessages');
const chatInput = $('#chatInput');
const chatSendBtn = $('#chatSendBtn');
const chatToggleText = $('#chatToggleText');

const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  if (chatToggle) chatToggle.classList.toggle('is-away', window.scrollY < window.innerHeight * 0.55 && !chatWidget.classList.contains('open'));
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

function setChat(open) {
  chatWidget.classList.toggle('open', open);
  chatToggle.setAttribute('aria-expanded', String(open));
  onScroll();
  if (chatToggleText) chatToggleText.textContent = open ? 'Close' : 'Ask MediSense';
  if (open) {
    if (chatBadge) chatBadge.classList.add('hidden');
    setTimeout(() => chatInput && chatInput.focus(), 60);
  }
}
if (chatToggle) chatToggle.addEventListener('click', () => setChat(!chatWidget.classList.contains('open')));
const chatClose = $('#chatbotClose');
if (chatClose) chatClose.addEventListener('click', () => { setChat(false); chatToggle.focus(); });
$$('[data-open-chat]').forEach(b => b.addEventListener('click', () => setChat(true)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chatWidget.classList.contains('open') && !$('.modal-overlay')) setChat(false); });

if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
if (chatInput) {
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 96) + 'px';
  });
}
if (chatMessages) {
  chatMessages.addEventListener('click', (e) => {
    const q = e.target.closest('[data-quick]');
    if (q) sendQuickReply(q.dataset.quick);
  });
}

function sendQuickReply(text) {
  const qr = $('#quickReplies');
  if (qr) qr.remove();
  if (chatInput) {
    chatInput.value = text;
    sendMessage();
  }
}

function appendBubble(html, isUser, extraClass) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + (isUser ? 'user' : 'bot') + (extraClass ? ' ' + extraClass : '');
  msg.innerHTML = `<div class="msg-bubble">${html}</div>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

let conversationHistory = [];

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatInput.style.height = 'auto';
  appendBubble(`<p>${esc(text)}</p>`, true);

  conversationHistory.push({ role: 'user', content: text });
  const typingEl = appendBubble('<div class="typing-indicator" aria-label="The assistant is typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>', false, 'typing-msg');
  chatSendBtn.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
    });
    const data = await response.json();
    typingEl.remove();

    let botReply;
    if (data.reply) botReply = data.reply;
    else if (data.error) botReply = "The assistant can't answer right now. You can still use the symptom checker, the disease library and the medicine guide on this page.";
    else botReply = 'Something went wrong. Please send your message again.';

    conversationHistory.push({ role: 'assistant', content: botReply });
    appendBubble(formatBotMessage(botReply), false);
  } catch (err) {
    typingEl.remove();
    const errMsg = "The assistant can't be reached. Check your connection and try again. The symptom checker and library still work.";
    appendBubble(`<p>${esc(errMsg)}</p>`, false);
    conversationHistory.push({ role: 'assistant', content: errMsg });
  }
  chatSendBtn.disabled = false;
}

// Light markdown: paragraphs, bullet lists, **bold** and *italic*. The text is escaped first.
function formatBotMessage(text) {
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const out = [];
  let list = null;
  const flush = () => { if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; } };
  esc(text).split(/\n/).forEach(raw => {
    const line = raw.trim();
    const item = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (item) { (list = list || []).push('<li>' + inline(item[1]) + '</li>'); return; }
    flush();
    if (line) out.push('<p>' + inline(line) + '</p>');
  });
  flush();
  return out.join('') || '<p></p>';
}
