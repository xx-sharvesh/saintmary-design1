// Admin Panel — Modal-Based Content Management
// Both designs share this logic; only admin.html styling differs

const ADMIN_CREDS = { user: 'admin', pass: 'admin' };
let data = {};
let isLoggedIn = false;
let modalSection = null;
let modalEditIdx = null;

// ─── MODAL FIELD CONFIGS ────────────────────────────────────────────────────
const MODAL_CONFIGS = {
  clergy: {
    label: 'Clergy Member',
    fields: [
      { key: 'name',  label: 'Full Name',   type: 'text',     required: true  },
      { key: 'title', label: 'Title / Role', type: 'text',     required: true, placeholder: 'e.g. Senior Priest' },
      { key: 'image', label: 'Photo URL',    type: 'text',     placeholder: 'https://... or clergy/photo.jpg' },
      { key: 'bio',   label: 'Biography',    type: 'textarea' }
    ]
  },
  ministries: {
    label: 'Ministry',
    fields: [
      { key: 'icon',        label: 'Icon (emoji)',    type: 'text',     placeholder: '✝️' },
      { key: 'name',        label: 'Ministry Name',  type: 'text',     required: true },
      { key: 'description', label: 'Description',    type: 'textarea', required: true }
    ]
  },
  schedule: {
    label: 'Service',
    fields: [
      { key: 'day',      label: 'Day',          type: 'select',   required: true,
        options: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
      { key: 'time',     label: 'Time',         type: 'text',     required: true, placeholder: '10:00 AM' },
      { key: 'service',  label: 'Service Name', type: 'text',     required: true, placeholder: 'Divine Liturgy' },
      { key: 'duration', label: 'Duration',     type: 'text',     placeholder: '2 hours' }
    ]
  },
  sermons: {
    label: 'Sermon',
    fields: [
      { key: 'title',       label: 'Sermon Title',     type: 'text',     required: true },
      { key: 'speaker',     label: 'Speaker',          type: 'text',     required: true },
      { key: 'date',        label: 'Date',             type: 'date',     required: true },
      { key: 'youtubeId',   label: 'YouTube Video ID', type: 'text',     placeholder: 'e.g. dQw4w9WgXcQ' },
      { key: 'description', label: 'Description',      type: 'textarea' }
    ]
  },
  events: {
    label: 'Event',
    fields: [
      { key: 'title',       label: 'Event Title', type: 'text',     required: true },
      { key: 'date',        label: 'Date',        type: 'date',     required: true },
      { key: 'time',        label: 'Time',        type: 'text',     placeholder: '6:00 PM' },
      { key: 'location',    label: 'Location',    type: 'text',     placeholder: 'Church Hall' },
      { key: 'image',       label: 'Image URL',   type: 'text',     placeholder: 'https://... or events/photo.jpg' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]
  },
  gallery: {
    label: 'Gallery Photo',
    fields: [
      { key: 'title',    label: 'Photo Title', type: 'text', required: true },
      { key: 'image',    label: 'Image URL',   type: 'text', required: true, placeholder: 'https://... or gallery/photo.jpg' },
      { key: 'category', label: 'Category',    type: 'text', placeholder: 'Church, Services, Events...' }
    ]
  }
};

// ─── AUTH ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('sm_admin') === '1') {
    isLoggedIn = true;
    showPanel();
  }
});

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    isLoggedIn = true;
    sessionStorage.setItem('sm_admin', '1');
    showPanel();
  } else {
    shake(document.querySelector('.login-card'));
    toast('Invalid credentials. Try: admin / admin');
  }
}

function doLogout() {
  isLoggedIn = false;
  sessionStorage.removeItem('sm_admin');
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

async function showPanel() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  await loadData();
  renderAll();
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const r = await fetch('./data/content.json?t=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    data = await r.json();
  } catch (e) {
    toast('Could not load content.json — serve via a web server, not file://');
    data = { church: {}, live: {}, clergy: [], ministries: [], schedule: { events: [] }, sermons: [], events: [], gallery: [] };
  }
}

// ─── RENDER ALL SECTIONS ──────────────────────────────────────────────────────
function renderAll() {
  renderLiveForm();
  renderList('clergy',     'clergyList',     item => ({ primary: item.name, secondary: item.title, img: item.image }));
  renderList('ministries', 'ministriesList', item => ({ primary: item.name, secondary: item.description, icon: item.icon || '🙏' }));
  renderScheduleList();
  renderList('sermons',    'sermonsList',    item => ({ primary: item.title, secondary: item.speaker + ' · ' + fmtDate(item.date), icon: '🎙️' }));
  renderList('events',     'eventsList',     item => ({ primary: item.title, secondary: fmtDate(item.date) + (item.location ? ' · ' + item.location : ''), img: item.image }));
  renderList('gallery',    'galleryList',    item => ({ primary: item.title, secondary: item.category, img: item.image }));
}

function renderLiveForm() {
  const live = data.live || {};
  document.getElementById('liveTitle').value     = live.title      || '';
  document.getElementById('liveYoutubeId').value = live.youtubeId  || '';
  document.getElementById('liveNextStream').value= live.nextStream || '';
  document.getElementById('liveIsLive').checked  = !!live.isLive;
}

function saveLiveStream() {
  data.live = {
    ...data.live,
    title:      document.getElementById('liveTitle').value.trim(),
    youtubeId:  document.getElementById('liveYoutubeId').value.trim(),
    nextStream: document.getElementById('liveNextStream').value.trim(),
    isLive:     document.getElementById('liveIsLive').checked
  };
  toast('Live stream settings saved — export JSON to apply.');
}

// Generic list renderer
function renderList(section, containerId, getDisplay) {
  const items = section === 'schedule' ? (data.schedule?.events || []) : (data[section] || []);
  const el = document.getElementById(containerId);

  if (!items.length) {
    el.innerHTML = '<div class="empty-state"><em>📋</em>No items yet — click the + button to add one.</div>';
    return;
  }

  el.innerHTML = items.map((item, i) => {
    const d = getDisplay(item);
    const thumbHtml = d.img
      ? `<img class="record-thumb" src="${esc(d.img)}" alt="" onerror="this.style.display='none'">`
      : `<div class="record-icon">${d.icon || '📄'}</div>`;

    return `<div class="record-item">
      ${thumbHtml}
      <div class="record-info">
        <strong>${esc(d.primary || 'Untitled')}</strong>
        <span>${esc(d.secondary || '')}</span>
      </div>
      <div class="record-actions">
        <button class="btn-edit" onclick="openModal('${section}',${i})">Edit</button>
        <button class="btn-danger" onclick="deleteItem('${section}',${i})">Delete</button>
      </div>
    </div>`;
  }).join('');
}

function renderScheduleList() {
  const events = data.schedule?.events || [];
  const el = document.getElementById('scheduleList');
  if (!events.length) {
    el.innerHTML = '<div class="empty-state"><em>📅</em>No services yet — click + to add one.</div>';
    return;
  }
  el.innerHTML = events.map((ev, i) => `
    <div class="record-item">
      <div class="record-icon">📅</div>
      <div class="record-info">
        <strong>${esc(ev.day)} at ${esc(ev.time)} — ${esc(ev.service)}</strong>
        <span>${esc(ev.duration || '')}</span>
      </div>
      <div class="record-actions">
        <button class="btn-edit" onclick="openModal('schedule',${i})">Edit</button>
        <button class="btn-danger" onclick="deleteItem('schedule',${i})">Delete</button>
      </div>
    </div>
  `).join('');
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
function deleteItem(section, idx) {
  if (!confirm('Delete this record? This cannot be undone until you reload.')) return;
  if (section === 'schedule') {
    data.schedule.events.splice(idx, 1);
  } else {
    data[section].splice(idx, 1);
  }
  renderAll();
  toast('Record deleted — export JSON to save permanently.');
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal(section, editIdx = null) {
  modalSection = section;
  modalEditIdx = editIdx;

  const cfg = MODAL_CONFIGS[section];
  document.getElementById('modalTitle').textContent = (editIdx !== null ? 'Edit ' : 'Add ') + cfg.label;

  const existing = editIdx !== null
    ? (section === 'schedule' ? data.schedule.events[editIdx] : data[section][editIdx])
    : {};

  document.getElementById('modalBody').innerHTML = cfg.fields.map(f => {
    const val = existing[f.key] || '';
    const reqStar = f.required ? '<span class="req"> *</span>' : '';

    if (f.type === 'select') {
      const opts = (f.options || []).map(o =>
        `<option value="${esc(o)}" ${val === o ? 'selected' : ''}>${esc(o)}</option>`
      ).join('');
      return `<div class="form-group">
        <label>${f.label}${reqStar}</label>
        <select id="mf_${f.key}">${opts}</select>
      </div>`;
    }
    if (f.type === 'textarea') {
      return `<div class="form-group">
        <label>${f.label}${reqStar}</label>
        <textarea id="mf_${f.key}" placeholder="${f.placeholder || ''}">${esc(val)}</textarea>
      </div>`;
    }
    return `<div class="form-group">
      <label>${f.label}${reqStar}</label>
      <input type="${f.type}" id="mf_${f.key}" value="${esc(val)}" placeholder="${f.placeholder || ''}">
    </div>`;
  }).join('');

  document.getElementById('modalOverlay').classList.add('open');
  // Focus first field
  setTimeout(() => {
    const first = document.getElementById('modalBody').querySelector('input, textarea, select');
    if (first) first.focus();
  }, 80);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  modalSection = null;
  modalEditIdx = null;
}

function handleBgClick(e) {
  if (e.target.id === 'modalOverlay') closeModal();
}

function saveModal() {
  const cfg = MODAL_CONFIGS[modalSection];
  const record = {};
  let valid = true;

  cfg.fields.forEach(f => {
    const el = document.getElementById('mf_' + f.key);
    if (!el) return;
    const val = el.value.trim();
    if (f.required && !val) {
      el.style.borderColor = '#e74c3c';
      el.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.15)';
      valid = false;
    } else {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }
    record[f.key] = val;
  });

  if (!valid) {
    toast('Please fill in all required fields (marked *)');
    return;
  }

  if (modalSection === 'schedule') {
    if (!data.schedule) data.schedule = { title: 'Weekly Services', events: [] };
    if (modalEditIdx !== null) {
      data.schedule.events[modalEditIdx] = { ...data.schedule.events[modalEditIdx], ...record };
    } else {
      data.schedule.events.push(record);
    }
  } else {
    if (!data[modalSection]) data[modalSection] = [];
    if (modalEditIdx !== null) {
      data[modalSection][modalEditIdx] = { id: data[modalSection][modalEditIdx].id || Date.now(), ...data[modalSection][modalEditIdx], ...record };
    } else {
      data[modalSection].push({ id: Date.now(), ...record });
    }
  }

  closeModal();
  renderAll();
  toast('Saved! Click "Export JSON" to download your updated content file.');
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function downloadJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'content.json'; a.click();
  URL.revokeObjectURL(url);
  toast('Downloaded! Upload content.json to data/ folder on your server.');
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(str) {
  if (!str) return '';
  try {
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return str; }
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3500);
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
}
