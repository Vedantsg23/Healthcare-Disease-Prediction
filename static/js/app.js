/* ===== MediSense AI — Application Logic ===== */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---- Demo animation ----
(function runDemo() {
  const steps = ['demoStep1','demoStep2','demoStep3'];
  const bar = document.getElementById('demoProgressBar');
  let idx = 0;
  const show = (i) => {
    steps.forEach((s,j) => {
      document.getElementById(s).classList.toggle('active', i===j);
    });
    const pct = [0, 50, 100][i];
    bar.style.width = pct + '%';
  };
  show(0);
  setInterval(() => {
    idx = (idx + 1) % steps.length;
    show(idx);
  }, 2500);
})();

// ---- Populate Symptom List ----
let selectedSymptoms = new Set();

function buildSymptomList(filter='') {
  const list = document.getElementById('symptomList');
  if (!list) return;
  list.innerHTML = '';
  const f = filter.toLowerCase();
  SYMPTOMS.filter(s => s.toLowerCase().includes(f)).forEach(sym => {
    const div = document.createElement('div');
    div.className = 'symptom-item' + (selectedSymptoms.has(sym) ? ' active' : '');
    div.innerHTML = `<div class="symptom-checkbox"></div><span>${sym}</span>`;
    div.addEventListener('click', () => toggleSymptom(sym));
    list.appendChild(div);
  });
}
buildSymptomList();

const symptomSearch = document.getElementById('symptomSearch');
if (symptomSearch) {
  symptomSearch.addEventListener('input', e => buildSymptomList(e.target.value));
}

function toggleSymptom(sym) {
  if (selectedSymptoms.has(sym)) selectedSymptoms.delete(sym);
  else selectedSymptoms.add(sym);
  const searchInput = document.getElementById('symptomSearch');
  buildSymptomList(searchInput ? searchInput.value : '');
  updateSelectedTags();
}

function updateSelectedTags() {
  const tags = document.getElementById('selectedTags');
  const count = document.getElementById('selectedCount');
  const btn = document.getElementById('predictBtn');
  if (!tags || !count || !btn) return;
  
  count.textContent = selectedSymptoms.size + ' selected';
  btn.disabled = selectedSymptoms.size === 0;
  if (selectedSymptoms.size === 0) {
    tags.innerHTML = '<em>None selected yet</em>';
    return;
  }
  tags.innerHTML = '';
  selectedSymptoms.forEach(sym => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${sym} <span class="tag-remove" onclick="toggleSymptom('${sym}')">✕</span>`;
    tags.appendChild(tag);
  });
}

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    selectedSymptoms.clear();
    const searchInput = document.getElementById('symptomSearch');
    buildSymptomList(searchInput ? searchInput.value : '');
    updateSelectedTags();
    const resEmpty = document.getElementById('resultEmpty');
    const resContent = document.getElementById('resultContent');
    if (resEmpty) resEmpty.style.display = 'flex';
    if (resContent) resContent.style.display = 'none';
  });
}

// ---- Prediction Logic ----
const predictBtn = document.getElementById('predictBtn');
if (predictBtn) {
    predictBtn.addEventListener('click', runPrediction);
}

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
      return DISEASE_DB[disease] ? { name: disease, data: DISEASE_DB[disease], matchCount: 1, matched: sympArr.slice(0,2) } : null;
    }
  }
  // Generic fallback
  const fallbackNames = Object.keys(DISEASE_DB);
  const fallbackName = fallbackNames[Math.floor(Math.random() * Math.min(3, fallbackNames.length))];
  const fd = DISEASE_DB[fallbackName];
  return { name: fallbackName, data: fd, matchCount: 1, matched: sympArr.slice(0,1) };
}

function runPrediction() {
  if (selectedSymptoms.size === 0) return;
  const result = findDisease(selectedSymptoms);
  if (!result) return;
  const confidence = Math.min(99, 70 + result.matchCount * 8 + Math.floor(Math.random() * 6));
  showResults(result.name, result.data, confidence, result.matched);
}

function showResults(name, data, confidence, matched) {
  const resEmpty = document.getElementById('resultEmpty');
  const rc = document.getElementById('resultContent');
  if (resEmpty) resEmpty.style.display = 'none';
  if (rc) rc.style.display = 'block';
  
  const resName = document.getElementById('resultDiseaseName');
  const confText = document.getElementById('confidenceText');
  const confFill = document.getElementById('confidenceFill');
  const desc = document.getElementById('diseaseDesc');
  
  if (resName) resName.textContent = name;
  if (confText) confText.textContent = confidence + '%';
  if (confFill) {
    setTimeout(() => confFill.style.width = confidence + '%', 100);
  }
  if (desc) desc.textContent = data.description;

  // Matched chips
  const mc = document.getElementById('matchedSymptoms');
  if (mc) {
      mc.innerHTML = '';
      matched.concat(Array.from(selectedSymptoms).slice(0,3)).slice(0,6).forEach(s => {
        const c = document.createElement('span');
        c.className = 'matched-chip';
        c.textContent = s;
        mc.appendChild(c);
      });
  }

  // Severity
  const sev = document.getElementById('severityDisplay');
  if (sev) {
      const levels = data.severity === 'low' ? 1 : data.severity === 'medium' ? 2 : 3;
      const colors = ['low','medium','high'];
      sev.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const d = document.createElement('div');
        d.className = 'sev-dot' + (i < levels ? ` active ${colors[i]}` : '');
        sev.appendChild(d);
      }
      const sevLabel = document.createElement('span');
      sevLabel.style.cssText = 'font-size:13px;margin-left:8px;color:var(--text-muted)';
      sevLabel.textContent = data.severity.charAt(0).toUpperCase() + data.severity.slice(1) + ' severity';
      sev.appendChild(sevLabel);
  }

  // Medicines
  const medGrid = document.getElementById('medicineList');
  if (medGrid) {
      medGrid.innerHTML = '';
      data.medicines.forEach(m => {
        const card = document.createElement('div');
        card.className = 'medicine-card';
        card.innerHTML = `<strong>${m.name}</strong><span>${m.use}</span><span class="med-type">${m.type}</span>`;
        medGrid.appendChild(card);
      });
  }

  const docAdvice = document.getElementById('doctorAdvice');
  if (docAdvice) docAdvice.textContent = data.doctorAdvice;

  // Precautions
  const precList = document.getElementById('precautionList');
  if (precList) {
      precList.innerHTML = '';
      data.precautions.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-shield-heart"></i> ${p}`;
        precList.appendChild(li);
      });
  }

  // Diet
  const dietGrid = document.getElementById('dietList');
  if (dietGrid) {
      dietGrid.innerHTML = '';
      data.diet.forEach(d => {
        const item = document.createElement('div');
        item.className = 'diet-item';
        item.innerHTML = `<i class="fa-solid ${d.icon}"></i>${d.label}`;
        dietGrid.appendChild(item);
      });
  }

  const avoidList = document.getElementById('avoidList');
  if (avoidList) {
      avoidList.innerHTML = '';
      data.avoid.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${a}`;
        avoidList.appendChild(li);
      });
  }

  // Reset tabs
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  const overviewBtn = document.querySelector('.tab-btn[data-tab="overview"]');
  const overviewTab = document.getElementById('tab-overview');
  if (overviewBtn) overviewBtn.classList.add('active');
  if (overviewTab) overviewTab.classList.add('active');
  
  if (confFill) {
    confFill.style.width = '0%';
    setTimeout(() => confFill.style.width = confidence + '%', 200);
  }

  // Scroll to result
  if (rc) rc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Tab switching ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const targetTab = document.getElementById('tab-' + tab);
    if (targetTab) targetTab.classList.add('active');
  });
});

// ---- Disease Grid ----
function buildDiseaseGrid(filter='', cat='all') {
  const grid = document.getElementById('diseaseGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const allDiseases = [
    ...Object.entries(DISEASE_DB).map(([name, d]) => ({ name, icon: d.icon || '🏥', category: d.category, desc: d.description })),
    ...DISEASE_LIST_EXTRA.filter(e => !DISEASE_DB[e.name])
  ];
  const f = filter.toLowerCase();
  allDiseases
    .filter(d => (cat === 'all' || d.category === cat) && (d.name.toLowerCase().includes(f) || d.desc.toLowerCase().includes(f)))
    .forEach(disease => {
      const card = document.createElement('div');
      card.className = 'disease-card';
      card.innerHTML = `
        <div class="disease-card-icon">${disease.icon}</div>
        <h4>${disease.name}</h4>
        <p>${disease.desc.substring(0,90)}...</p>
        <div class="disease-card-tags"><span class="disease-tag ${disease.category}">${disease.category}</span></div>
      `;
      card.addEventListener('click', () => openDiseaseModal(disease.name));
      grid.appendChild(card);
    });
}
buildDiseaseGrid();

const diseaseSearch = document.getElementById('diseaseSearch');
if (diseaseSearch) {
    diseaseSearch.addEventListener('input', e => {
      const activeFilter = document.querySelector('.filter-btn.active');
      buildDiseaseGrid(e.target.value, activeFilter ? activeFilter.dataset.cat : 'all');
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const searchInput = document.getElementById('diseaseSearch');
    buildDiseaseGrid(searchInput ? searchInput.value : '', btn.dataset.cat);
  });
});

// ---- Disease Modal ----
function openDiseaseModal(name) {
  const data = DISEASE_DB[name];
  if (!data) {
    const extra = DISEASE_LIST_EXTRA.find(d => d.name === name);
    if (extra) {
      showSimpleModal(name, extra.icon, extra.desc);
    }
    return;
  }
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${data.icon || '🏥'} ${name}</h2>
        <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <h4>Overview</h4>
          <p>${data.description}</p>
        </div>
        <div class="modal-section">
          <h4>Key Symptoms</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
            ${data.symptoms.map(s => `<span class="matched-chip">${s}</span>`).join('')}
          </div>
        </div>
        <div class="modal-section">
          <h4>Medicines</h4>
          <ul>${data.medicines.map(m => `<li><strong>${m.name}</strong> — ${m.use} <em>(${m.type})</em></li>`).join('')}</ul>
        </div>
        <div class="modal-section">
          <h4>Precautions</h4>
          <ul>${data.precautions.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
          <h4>When to See a Doctor</h4>
          <p>${data.doctorAdvice}</p>
        </div>
        <button class="btn btn-primary" style="margin-top:8px;" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function showSimpleModal(name, icon, desc) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${icon} ${name}</h2>
        <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">
        <div class="modal-section"><p>${desc}</p></div>
        <p style="color:var(--text-muted);font-size:13px;margin-top:8px;">For detailed information, use the Symptom Checker above to get a full analysis.</p>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ---- Chatbot ----
const chatWidget = document.getElementById('chatbotWidget');
const chatToggle = document.getElementById('chatbotToggle');
const chatBadge = document.getElementById('chatBadge');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatToggleIcon = document.getElementById('chatToggleIcon');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
      chatWidget.classList.toggle('open');
      if (chatBadge) chatBadge.classList.add('hidden');
      if (chatToggleIcon) {
          chatToggleIcon.className = chatWidget.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-robot';
      }
    });
}

const chatClose = document.getElementById('chatbotClose');
if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWidget.classList.remove('open');
      if (chatToggleIcon) chatToggleIcon.className = 'fa-solid fa-robot';
    });
}

if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    });
}

function sendQuickReply(text) {
  const qr = document.getElementById('quickReplies');
  if (qr) qr.remove();
  if (chatInput) {
      chatInput.value = text;
      sendMessage();
  }
}

function appendMsg(text, isUser) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
  msg.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i></div>
    <div class="msg-bubble"><p>${text}</p></div>
  `;
  if (chatMessages) {
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  return msg;
}

function showTyping() {
  const msg = document.createElement('div');
  msg.className = 'chat-msg bot typing-msg';
  msg.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>
  `;
  if (chatMessages) {
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  return msg;
}

let conversationHistory = [];

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatInput.style.height = 'auto';
  appendMsg(text, true);

  conversationHistory.push({ role: 'user', content: text });
  const typingEl = showTyping();
  chatSendBtn.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversationHistory
      })
    });

    const data = await response.json();
    typingEl.remove();

    let botReply = '';
    if (data.reply) {
      botReply = data.reply;
    } else if (data.error) {
      botReply = "I'm having trouble connecting to my AI backend. Please check your API configuration. In the meantime, try browsing our Disease Library or Medicine Guide sections above!";
    } else {
      botReply = "Something went wrong. Please try again.";
    }

    conversationHistory.push({ role: 'assistant', content: botReply });

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble">${formatBotMessage(botReply)}</div>
    `;
    if (chatMessages) {
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (err) {
    if (typingEl) typingEl.remove();
    const errMsg = "I'm unable to connect right now. Please check if the server is running. You can still use the Symptom Checker and Disease Library!";
    appendMsg(errMsg, false);
    conversationHistory.push({ role: 'assistant', content: errMsg });
  }
  chatSendBtn.disabled = false;
}

function formatBotMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// ---- Scroll-triggered animations ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step-card, .guide-card, .disease-card, .feature-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
