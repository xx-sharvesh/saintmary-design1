// Design 1: Main JavaScript - Elegant Classic Style

let content = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  renderPage();
  setupMenuToggle();
  setupSmoothScroll();
});

// Load content from JSON
async function loadContent() {
  try {
    const response = await fetch('./data/content.json');
    content = await response.json();
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

// Render entire page
function renderPage() {
  renderHeader();
  renderHero();
  renderLiveStream();
  renderQuickNav();
  renderAbout();
  renderClergy();
  renderMinistries();
  renderSchedule();
  renderSermons();
  renderEvents();
  renderGallery();
  renderFooter();
}

// Header
function renderHeader() {
  const header = document.querySelector('header');
  header.innerHTML = `
    <div class="header-container">
      <div class="logo">
        <img src="${imgSrc(content.church.logo)}" alt="Church Logo" onerror="this.style.display='none'">
        <span>Saint Mary</span>
      </div>
      <nav id="nav">
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#clergy">Clergy</a></li>
          <li><a href="#ministries">Ministries</a></li>
          <li><a href="#schedule">Schedule</a></li>
          <li><a href="#sermons">Sermons</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="admin.html">Admin</a></li>
        </ul>
      </nav>
      <button class="menu-toggle" id="menuToggle">☰</button>
    </div>
  `;
}

// Hero Section
function renderHero() {
  const hero = document.querySelector('.hero');
  hero.innerHTML = `
    <div class="hero-content">
      <img src="${imgSrc(content.church.logo)}" alt="Church Logo" onerror="this.style.display='none'">
      <h1>${content.church.name}</h1>
      <p class="tagline">${content.church.tagline}</p>
    </div>
  `;
}

// Live Stream Section
function renderLiveStream() {
  const section = document.querySelector('.live-stream');
  const { title, youtubeId, nextStream } = content.live;

  // Always embed when a YouTube ID is set — YouTube shows LIVE automatically
  let streamHTML = '';
  if (youtubeId) {
    streamHTML = `
      <div class="stream-box stream-active">
        <iframe
          src="https://www.youtube.com/embed/${youtubeId}?rel=0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div class="stream-next-time">Regular stream: ${nextStream}</div>
    `;
  } else {
    streamHTML = `
      <div class="stream-box stream-inactive">
        <div class="icon">📺</div>
        <h3>Live Stream Coming Soon</h3>
        <p>${content.live.description || ''}</p>
        <div class="stream-next-time">${nextStream}</div>
      </div>
    `;
  }

  section.innerHTML = `
    <div class="live-stream-container">
      <h2>${title}</h2>
      ${streamHTML}
    </div>
  `;
}

// Quick Navigation
function renderQuickNav() {
  const section = document.querySelector('.quick-nav');
  const sections = [
    { name: 'About', icon: '📖', href: '#about' },
    { name: 'Ministries', icon: '🙏', href: '#ministries' },
    { name: 'Schedule', icon: '📅', href: '#schedule' },
    { name: 'Sermons', icon: '🎤', href: '#sermons' },
    { name: 'Events', icon: '🎉', href: '#events' },
    { name: 'Gallery', icon: '🖼️', href: '#gallery' }
  ];

  const navHTML = sections.map(s => `
    <div class="nav-card" onclick="document.location='${s.href}'">
      <div class="icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>Explore our ${s.name.toLowerCase()}</p>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="quick-nav-container">
      <h2>Explore Our Community</h2>
      <div class="nav-grid">
        ${navHTML}
      </div>
    </div>
  `;
}

// About Section
function renderAbout() {
  const section = document.querySelector('.about');
  const { title, description, vision, mission } = content.about;

  section.innerHTML = `
    <div class="container">
      <h2 id="about">${title}</h2>
      <div class="about-content">
        <div class="about-text">
          <h3>Our Story</h3>
          <p>${description}</p>
          <div class="about-boxes">
            <div class="info-box">
              <h4>Our Vision</h4>
              <p>${vision}</p>
            </div>
            <div class="info-box">
              <h4>Our Mission</h4>
              <p>${mission}</p>
            </div>
          </div>
        </div>
        <div class="about-text">
          <h3>Welcome</h3>
          <p>Whether you are a lifelong member or visiting for the first time, we welcome you with open hearts. Our church is a place of spiritual growth, fellowship, and service to God and our community.</p>
          <div class="about-boxes">
            <div class="info-box">
              <h4>Worship With Us</h4>
              <p>Join us for Sunday Divine Liturgy at 10:00 AM. All are welcome to participate in our sacred services.</p>
            </div>
            <div class="info-box">
              <h4>Get Involved</h4>
              <p>Discover ways to serve, grow spiritually, and build meaningful connections with our church community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Returns full URL or prefixes with ./images/ for local paths
function imgSrc(path) {
  if (!path) return '';
  return (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//'))
    ? path : './images/' + path;
}

// Clergy Section
function renderClergy() {
  const section = document.querySelector('.clergy');
  const clergyHTML = content.clergy.map(c => `
    <div class="clergy-card">
      <img src="${imgSrc(c.image)}" alt="${c.name}" onerror="this.style.background='linear-gradient(135deg, #05152d, #123b73)'; this.style.minHeight='220px';">
      <div class="clergy-info">
        <h3>${c.name}</h3>
        <div class="clergy-title">${c.title}</div>
        <p class="clergy-bio">${c.bio}</p>
      </div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 id="clergy">Our Clergy & Servants</h2>
      <div class="clergy-grid">
        ${clergyHTML}
      </div>
    </div>
  `;
}

// Ministries Section
function renderMinistries() {
  const section = document.querySelector('.ministries');
  const ministriesHTML = content.ministries.map(m => `
    <div class="ministry-card">
      <div class="icon">${m.icon}</div>
      <h3>${m.name}</h3>
      <p>${m.description}</p>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 id="ministries">${content.ministries && content.ministries.length ? 'Our Ministries' : 'Ministries'}</h2>
      <div class="ministries-grid">
        ${ministriesHTML}
      </div>
    </div>
  `;
}

// Schedule Section
function renderSchedule() {
  const section = document.querySelector('.schedule');
  const scheduleHTML = content.schedule.events.map(e => `
    <div class="schedule-item">
      <div class="schedule-day">${e.day}</div>
      <div class="schedule-service">
        <div class="schedule-service-name">${e.service}</div>
        <div class="schedule-service-time">${e.time}</div>
      </div>
      <div class="schedule-duration">${e.duration}</div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 id="schedule">${content.schedule.title}</h2>
      <div class="schedule-list">
        ${scheduleHTML}
      </div>
    </div>
  `;
}

// Sermons Section
function renderSermons() {
  const section = document.querySelector('.sermons');
  const sermonsHTML = content.sermons.map(s => `
    <div class="sermon-card">
      <div class="sermon-thumbnail">
        <span style="font-size: 3rem;">🎬</span>
      </div>
      <div class="sermon-info">
        <div class="sermon-date">${formatDate(s.date)}</div>
        <h3>${s.title}</h3>
        <div class="sermon-speaker">By ${s.speaker}</div>
        <p class="sermon-desc">${s.description}</p>
        <a href="https://youtube.com/watch?v=${s.youtubeId}" target="_blank" class="watch-btn">Watch Now</a>
      </div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 id="sermons">Recent Sermons</h2>
      <div class="sermons-grid">
        ${sermonsHTML}
      </div>
    </div>
  `;
}

// Events Section
function renderEvents() {
  const section = document.querySelector('.events');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = content.events.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  let eventsHTML = '';
  if (upcomingEvents.length > 0) {
    eventsHTML = upcomingEvents.map(e => `
      <div class="event-card">
        <div class="event-image">
          ${e.image ? `<img src="${imgSrc(e.image)}" alt="${e.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<span>🎊</span>'">` : '<span>🎊</span>'}
        </div>
        <div class="event-details">
          <div class="event-date">📅 ${formatDate(e.date)}</div>
          <h3>${e.title}</h3>
          <div class="event-time">⏰ ${e.time}</div>
          <div class="event-location">📍 ${e.location}</div>
          <p class="event-desc">${e.description}</p>
        </div>
      </div>
    `).join('');
  } else {
    eventsHTML = '<div class="no-events"><p>No upcoming events at this time. Check back soon!</p></div>';
  }

  section.innerHTML = `
    <div class="container">
      <h2 id="events">Upcoming Events</h2>
      <div class="events-grid">
        ${eventsHTML}
      </div>
    </div>
  `;
}

// Gallery Section
function renderGallery() {
  const section = document.querySelector('.gallery');
  const galleryHTML = content.gallery.map(g => `
    <div class="gallery-item">
      <img src="${imgSrc(g.image)}" alt="${g.title}" onerror="this.parentElement.innerHTML='<div class=\'gallery-placeholder\'>📷</div>'"  loading="lazy">
    </div>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 id="gallery">Photo Gallery</h2>
      <div class="gallery-grid">
        ${galleryHTML}
      </div>
    </div>
  `;
}

// Footer
function renderFooter() {
  const footer = document.querySelector('footer');
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>${content.church.name}</h3>
          <p>${content.church.tagline}</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <a href="#about">About</a>
          <a href="#clergy">Clergy</a>
          <a href="#ministries">Ministries</a>
          <a href="#schedule">Schedule</a>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>📧 Email: info@church.org</p>
          <p>📱 Phone: (555) 123-4567</p>
          <p>📍 Address: 123 Church Street</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ${content.church.name}. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Utility Functions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupMenuToggle() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
