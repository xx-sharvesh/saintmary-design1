// Design 1 — Modern Luminous — Main JS

let content = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  renderAll();
  setupNav();
});

async function loadContent() {
  try {
    const r = await fetch('./data/content.json?t=' + Date.now());
    content = await r.json();
  } catch(e) { console.error('Failed to load content.json:', e); }
}

function renderAll() {
  renderNav();
  renderHero();
  renderLive();
  renderAbout();
  renderClergy();
  renderMinistries();
  renderSchedule();
  renderSermons();
  renderEvents();
  renderGallery();
  renderFooter();
}

// ── NAV SCROLL BEHAVIOUR ──────────────────────────────────────────
function setupNav() {
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }
}

// ── NAV AUTH LINK ──────────────────────────────────────────────────
function renderNav() {
  const user = getCurrentUser();
  const link = document.getElementById('navAuthLink');
  if (!link) return;
  if (user && user.role === 'admin') { link.href = 'admin.html'; link.textContent = 'Admin'; }
  else if (user) { link.textContent = 'My Account'; }
}

// ── HERO ───────────────────────────────────────────────────────────
function renderHero() {
  const ch = content.church || {};
  const nameEl = document.getElementById('heroName');
  const tagEl  = document.getElementById('heroTagline');
  if (nameEl) nameEl.textContent = 'Saint Mary';
  if (tagEl)  tagEl.textContent  = ch.tagline || 'Living the Orthodox Faith';
}

// ── LIVE ───────────────────────────────────────────────────────────
function renderLive() {
  const el = document.getElementById('live');
  if (!el) return;
  const live = content.live || {};
  const embedSrc = live.channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${esc(live.channelId)}&rel=0`
    : live.youtubeId
      ? `https://www.youtube.com/embed/${esc(live.youtubeId)}?rel=0`
      : null;

  if (embedSrc) {
    el.innerHTML = `
      <div class="live-inner">
        <span class="eyebrow">Live Worship</span>
        <h2>${esc(live.title || 'Sunday Liturgy')}</h2>
        <div class="live-frame">
          <iframe src="${embedSrc}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        <p class="live-next" style="margin-top:1.25rem">
          Regular stream: <strong style="color:var(--gold-light)">${esc(live.nextStream || 'Sunday, 10:00 AM')}</strong>
        </p>
      </div>`;
  } else {
    el.innerHTML = `
      <div class="live-inner">
        <span class="eyebrow">Live Worship</span>
        <h2>${esc(live.title || 'Sunday Liturgy')}</h2>
        <p class="live-next">Next stream: <strong style="color:var(--gold-light)">${esc(live.nextStream || 'Sunday, 10:00 AM')}</strong></p>
        <p style="color:rgba(255,255,255,0.35);font-size:0.88rem;margin-top:0.5rem">No stream configured — add a YouTube Channel ID in the admin panel.</p>
      </div>`;
  }
}

// ── ABOUT ──────────────────────────────────────────────────────────
function renderAbout() {
  const el = document.getElementById('about');
  if (!el) return;
  const ab = content.about || {};
  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Our Parish</span>
      <div class="about-grid">
        <div class="about-text">
          <h2 class="section-title">${esc(ab.title || 'About Our Church')}</h2>
          <hr class="gold-bar">
          <p>${esc(ab.description || '')}</p>
        </div>
        <div class="about-panels">
          <div class="about-panel">
            <h4>Our Vision</h4>
            <p>${esc(ab.vision || '')}</p>
          </div>
          <div class="about-panel">
            <h4>Our Mission</h4>
            <p>${esc(ab.mission || '')}</p>
          </div>
        </div>
      </div>
    </div>`;
}

// ── CLERGY ─────────────────────────────────────────────────────────
function renderClergy() {
  const el = document.getElementById('clergy');
  if (!el) return;
  const clergy = content.clergy || [];
  const cards = clergy.map(p => {
    const photo = p.image
      ? `<div class="clergy-photo-wrap"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'clergy-placeholder\\'>✝</div>'"></div>`
      : `<div class="clergy-placeholder">✝</div>`;
    return `
      <div class="clergy-card">
        ${photo}
        <div class="clergy-info">
          <div class="clergy-role">${esc(p.title || '')}</div>
          <div class="clergy-name">${esc(p.name || '')}</div>
          <p class="clergy-bio">${esc(p.bio || '')}</p>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Leadership</span>
      <h2 class="section-title">Clergy &amp; Staff</h2>
      <hr class="gold-bar">
      <div class="clergy-grid">${cards || '<p style="color:var(--text-muted)">Clergy information coming soon.</p>'}</div>
    </div>`;
}

// ── MINISTRIES ─────────────────────────────────────────────────────
function renderMinistries() {
  const el = document.getElementById('ministries');
  if (!el) return;
  const mins = content.ministries || [];
  const cards = mins.map(m => {
    const img = m.image
      ? `<div class="ministry-img-wrap"><img src="${esc(m.image)}" alt="${esc(m.name)}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
      : `<div class="ministry-img-placeholder">✝</div>`;
    return `
      <div class="ministry-card">
        ${img}
        <div class="ministry-body">
          <div class="ministry-name">${esc(m.name || '')}</div>
          <p class="ministry-desc">${esc(m.description || '')}</p>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Community</span>
      <h2 class="section-title">Our Ministries</h2>
      <hr class="gold-bar">
      <div class="ministries-grid">${cards}</div>
    </div>`;
}

// ── SCHEDULE ───────────────────────────────────────────────────────
function renderSchedule() {
  const el = document.getElementById('schedule');
  if (!el) return;
  const events = content.schedule?.events || [];
  const dayOrder = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const byDay = {};
  events.forEach(ev => { if (!byDay[ev.day]) byDay[ev.day] = []; byDay[ev.day].push(ev); });
  const days = dayOrder.filter(d => byDay[d]);

  const tabs = days.map((d, i) => `
    <button class="sched-tab${i === 0 ? ' active' : ''}" onclick="switchSchedTab('${d}', this)">${d}</button>
  `).join('');

  const panels = days.map((d, i) => {
    const rows = byDay[d].map(ev => `
      <div class="sched-row">
        <div class="sched-time">${esc(ev.time)}</div>
        <div class="sched-service">${esc(ev.service)}</div>
        ${ev.duration ? `<div class="sched-dur">${esc(ev.duration)}</div>` : ''}
      </div>`).join('');
    return `<div class="sched-panel${i === 0 ? ' active' : ''}" id="sched-${d}">${rows}</div>`;
  }).join('');

  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Worship</span>
      <h2 class="section-title" style="color:var(--white)">Weekly Services</h2>
      <hr class="gold-bar">
      <div class="sched-tabs">${tabs}</div>
      <div class="sched-panels">${panels}</div>
    </div>`;
}

function switchSchedTab(day, btn) {
  document.querySelectorAll('.sched-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sched-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('sched-' + day);
  if (panel) panel.classList.add('active');
}

// ── SERMONS ────────────────────────────────────────────────────────
function renderSermons() {
  const el = document.getElementById('sermons');
  if (!el) return;
  const sermons = content.sermons || [];
  const rows = sermons.map(s => {
    const d = s.date ? new Date(s.date + 'T00:00:00') : null;
    const month = d ? d.toLocaleDateString('en-US',{month:'short'}).toUpperCase() : '';
    const day   = d ? d.getDate() : '';
    const year  = d ? d.getFullYear() : '';
    const btn = s.youtubeId
      ? `<a class="btn-watch" href="https://www.youtube.com/watch?v=${esc(s.youtubeId)}" target="_blank" rel="noopener">▶ Watch</a>`
      : '';
    return `
      <div class="sermon-row">
        <div class="sermon-date-col">
          <div class="sermon-month">${month}</div>
          <div class="sermon-day-num">${day}</div>
          <div class="sermon-year">${year}</div>
        </div>
        <div>
          <div class="sermon-title">${esc(s.title || '')}</div>
          <div class="sermon-speaker">${esc(s.speaker || '')}</div>
          ${s.description ? `<div class="sermon-desc">${esc(s.description)}</div>` : ''}
        </div>
        <div>${btn}</div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Teaching</span>
      <h2 class="section-title">Sermon Archive</h2>
      <hr class="gold-bar">
      <div class="sermons-list">${rows || '<p style="color:var(--text-muted)">Sermons coming soon.</p>'}</div>
    </div>`;
}

// ── EVENTS ─────────────────────────────────────────────────────────
function renderEvents() {
  const el = document.getElementById('events');
  if (!el) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const events = (content.events || []).filter(ev => !ev.date || new Date(ev.date + 'T00:00:00') >= today);

  const cards = events.map(ev => {
    const dateStr = ev.date ? new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'}) : '';
    const img = ev.image
      ? `<div class="event-img-wrap"><img src="${esc(ev.image)}" alt="${esc(ev.title)}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
      : '';
    return `
      <div class="event-card">
        ${img}
        <div class="event-body">
          <span class="event-date-badge">${esc(dateStr)}</span>
          <div class="event-title">${esc(ev.title || '')}</div>
          <div class="event-meta">${ev.time ? esc(ev.time) + ' ' : ''}${ev.location ? '· ' + esc(ev.location) : ''}</div>
          ${ev.description ? `<p class="event-desc">${esc(ev.description)}</p>` : ''}
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="section-inner">
      <span class="eyebrow">Calendar</span>
      <h2 class="section-title">Upcoming Events</h2>
      <hr class="gold-bar">
      ${events.length ? `<div class="events-grid">${cards}</div>` : '<p style="color:var(--text-muted)">No upcoming events at this time.</p>'}
    </div>`;
}

// ── GALLERY ────────────────────────────────────────────────────────
function renderGallery() {
  const el = document.getElementById('gallery');
  if (!el) return;
  const photos = content.gallery || [];
  const items = photos.map(p => `
    <div class="g-item">
      <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.parentElement.style.display='none'">
      <div class="g-caption">
        <div class="g-caption-title">${esc(p.title || '')}</div>
        ${p.category ? `<div class="g-caption-cat">${esc(p.category)}</div>` : ''}
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="gallery-header">
      <span class="eyebrow" style="text-align:center;display:block">Life of the Parish</span>
      <h2 class="section-title" style="text-align:center">Photo Gallery</h2>
    </div>
    <div class="gallery-cols">${items}</div>`;
}

// ── FOOTER ─────────────────────────────────────────────────────────
function renderFooter() {
  const el = document.getElementById('siteFooter');
  if (!el) return;
  const ch = content.church || {};
  el.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <img src="images/logo.jpeg" alt="Saint Mary" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid rgba(215,178,74,0.4);margin-bottom:1rem;">
          <div class="footer-brand">${esc(ch.name || 'Saint Mary Coptic Orthodox Church')}</div>
          <div class="footer-sub">Coptic Orthodox Diocese</div>
          <p class="footer-desc">A vibrant community of faith rooted in the ancient traditions of the Coptic Orthodox Church.</p>
          <div style="margin-top:1.5rem">
            <a href="login.html" style="color:var(--gold);font-size:0.78rem;letter-spacing:1px;text-transform:uppercase">Member Portal →</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Navigate</div>
          <ul class="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#clergy">Clergy</a></li>
            <li><a href="#ministries">Ministries</a></li>
            <li><a href="#schedule">Schedule</a></li>
            <li><a href="#sermons">Sermons</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">Contact</div>
          <div class="footer-contact">
            <div class="footer-contact-row">
              <span class="footer-contact-icon">✉</span>
              <span class="footer-contact-text">info@saintmarychurch.org</span>
            </div>
            <div class="footer-contact-row">
              <span class="footer-contact-icon">☎</span>
              <span class="footer-contact-text">(555) 123-4567</span>
            </div>
            <div class="footer-contact-row">
              <span class="footer-contact-icon">⛪</span>
              <span class="footer-contact-text">123 Church Street<br>Your City, State 00000</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">© ${new Date().getFullYear()} ${esc(ch.name || 'Saint Mary Coptic Orthodox Church')}. All rights reserved.</span>
        <span class="footer-copy">Coptic Orthodox Church</span>
      </div>
    </div>`;
}

// ── UTIL ───────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('sm_user') || 'null'); } catch { return null; }
}
