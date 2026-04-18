/* ============================================================
   Cat-A-Log! — main.js
   Handles: card animations, routing, AJAX catalogue loading,
            search, pagination, detail view, accordion (jQuery)
   ============================================================ */

/* ── Utility: render header HTML ─────────────────────────── */
function renderHeader(activeLink = '') {
  return `
  <header class="site-header">
    <div class="site-logo">📖 Cat<span>-A-</span>Log!</div>
    <nav class="site-nav">
      <a href="#home" class="${activeLink==='home'?'active':''}" onclick="showHome()">Home</a>
      <a href="#characters" class="${activeLink==='characters'?'active':''}"
         onclick="loadCatalogue('characters')">Characters</a>
      <a href="#places" class="${activeLink==='places'?'active':''}"
         onclick="loadCatalogue('places')">Places</a>
      <a href="#monuments" class="${activeLink==='monuments'?'active':''}"
         onclick="loadCatalogue('monuments')">Monuments</a>
      <a href="manage.html" class="manage-content-btn">🗂 Manage Content</a>
    </nav>
  </header>`;
}

function renderFooter() {
  return `<footer class="site-footer">Cat-A-Log! &mdash; A College Practical Project &copy; ${new Date().getFullYear()}</footer>`;
}

/* ── State ───────────────────────────────────────────────── */
let currentCategory = '';
let currentPage     = 1;
let searchTimeout   = null;

/* ── App entry point ─────────────────────────────────────── */
$(document).ready(function () {
  showHome();
});

/* ============================================================
   HOME PAGE
   ============================================================ */
function showHome() {
  currentCategory = '';
  const categories = [
    {
      key: 'characters', icon: '⚔️',
      title: 'Characters',
      desc: 'Warriors, mages, rogues & heroes from across the realm.',
      color: '#b5293a'
    },
    {
      key: 'places', icon: '🗺️',
      title: 'Places',
      desc: 'Mystical lands, hidden forests, and sprawling cities.',
      color: '#2e7d6e'
    },
    {
      key: 'monuments', icon: '🏛️',
      title: 'Monuments',
      desc: 'Ancient structures and legendary landmarks of history.',
      color: '#4a5a8a'
    },
    {
      key: null, icon: '🌄',
      title: 'Landscapes',
      desc: 'Sweeping vistas and natural wonders — coming soon.',
      color: '#6a4a2e',
      disabled: true
    }
  ];

  let cardsHtml = categories.map(c => `
    <div class="category-card" data-category="${c.key || ''}"
         onclick="${c.disabled ? '' : `loadCatalogue('${c.key}')`}"
         style="${c.disabled ? 'opacity:.45;cursor:not-allowed;' : ''}">
      <span class="category-icon">${c.icon}</span>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      ${c.disabled
        ? '<span class="cat-count">Coming Soon</span>'
        : `<span class="cat-count">Browse ${c.title} →</span>`}
    </div>
  `).join('');

  const html = `
    ${renderHeader('home')}
    <main>
      <section class="page-hero">
        <h1>Cat-A-Log!</h1>
        <p class="subtitle">Your gateway to every character, place, and monument across the known world.</p>
        <div class="hero-divider"></div>
      </section>
      <div class="catalogue-grid" id="home-grid">${cardsHtml}</div>
    </main>
    ${renderFooter()}`;

  $('#app').html(html);
  animateCards('.category-card');
}

/* ============================================================
   CATALOGUE PAGE (list view)
   ============================================================ */
function loadCatalogue(category, page = 1, search = '') {
  currentCategory = category;
  currentPage     = page;

  const categoryMeta = {
    characters: { icon: '⚔️', label: 'Characters', desc: 'The legends who shaped the world.' },
    places:     { icon: '🗺️', label: 'Places',     desc: 'Every corner of the known realm.' },
    monuments:  { icon: '🏛️', label: 'Monuments',  desc: 'Ancient relics and landmarks.' }
  }[category] || { icon: '📚', label: category, desc: '' };

  const html = `
    ${renderHeader(category)}
    <main>
      <section class="page-hero">
        <h1>${categoryMeta.icon} ${categoryMeta.label}</h1>
        <p class="subtitle">${categoryMeta.desc}</p>
        <div class="hero-divider"></div>
      </section>

      <div class="catalogue-toolbar">
        <a class="back-btn" href="#home" onclick="showHome()">← Back to Home</a>
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Search ${categoryMeta.label}…"
                 value="${search}" />
        </div>
        <select class="sort-select" id="sort-select">
          <option value="id">Default Order</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div class="catalogue-grid" id="items-grid">
        <div class="spinner-wrap"><div class="spinner"></div></div>
      </div>

      <div class="pagination" id="pagination"></div>
    </main>
    ${renderFooter()}`;

  $('#app').html(html);

  // Wire up search with debounce
  $('#search-input').on('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadCatalogue(currentCategory, 1, $(this).val().trim());
    }, 400);
  });

  fetchItems(category, page, search);
}

/* ── AJAX: fetch items from PHP backend ──────────────────── */
function fetchItems(category, page, search) {
  const params = new URLSearchParams({ category, page, search });

  $.ajax({
    url: `api/get_items.php?${params}`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if (!data.success) {
        showError(data.message);
        return;
      }
      renderItems(data.items, category);
      renderPagination(data.page, data.total_pages, category, search);
    },
    error: function (xhr) {
      showError('Failed to load items. Is your XAMPP server running?');
      console.error(xhr);
    }
  });
}

function renderItems(items, category) {
  if (!items || items.length === 0) {
    $('#items-grid').html(`
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <p>No results found. Try a different search.</p>
      </div>`);
    return;
  }

  const categoryIcons = { characters: '⚔️', places: '🗺️', monuments: '🏛️' };
  const badgeLabels   = { characters: 'Character', places: 'Place', monuments: 'Monument' };

  const html = items.map(item => {
    const imgHtml = item.image && item.image !== 'assets/images/placeholder.jpg'
      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">`
      : `<div class="card-img-placeholder">${categoryIcons[category] || '📚'}</div>`;

    // Extra meta per category
    let meta = '';
    if (category === 'characters' && item.age)      meta = `Age: ${escapeHtml(item.age)}`;
    if (category === 'places'     && item.climate)  meta = `Climate: ${escapeHtml(item.climate)}`;
    if (category === 'monuments'  && item.location) meta = `📍 ${escapeHtml(item.location)}`;

    return `
    <div class="cat-card" onclick="loadDetail('${category}', ${item.id})">
      <div class="card-img-wrap">
        ${imgHtml}
        <span class="card-badge">${badgeLabels[category] || category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(item.name)}</h3>
        ${meta ? `<p class="card-meta">${meta}</p>` : ''}
        <p class="card-desc">${escapeHtml(item.description)}</p>
        <span class="card-link-btn">View Details →</span>
      </div>
    </div>`;
  }).join('');

  $('#items-grid').html(html);
  animateCards('.cat-card');
}

function renderPagination(currentPg, totalPages, category, search) {
  if (totalPages <= 1) { $('#pagination').html(''); return; }

  let btns = '';
  for (let i = 1; i <= totalPages; i++) {
    btns += `<button class="${i === currentPg ? 'active' : ''}"
               onclick="loadCatalogue('${category}', ${i}, '${escapeHtml(search)}')">${i}</button>`;
  }

  const prevBtn = currentPg > 1
    ? `<button onclick="loadCatalogue('${category}', ${currentPg - 1}, '${escapeHtml(search)}')">‹ Prev</button>`
    : '';
  const nextBtn = currentPg < totalPages
    ? `<button onclick="loadCatalogue('${category}', ${currentPg + 1}, '${escapeHtml(search)}')">Next ›</button>`
    : '';

  $('#pagination').html(prevBtn + btns + nextBtn);
}

function showError(msg) {
  $('#items-grid').html(`<div class="empty-state">
    <div class="empty-icon">⚠️</div>
    <p>${escapeHtml(msg)}</p>
  </div>`);
}

/* ============================================================
   DETAIL PAGE
   ============================================================ */
function loadDetail(category, id) {
  // Show spinner while loading
  const html = `
    ${renderHeader(category)}
    <main>
      <div class="detail-wrap" id="detail-content">
        <div class="spinner-wrap"><div class="spinner"></div></div>
      </div>
    </main>
    ${renderFooter()}`;

  $('#app').html(html);

  $.ajax({
    url: `api/get_detail.php?category=${encodeURIComponent(category)}&id=${id}`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      if (!data.success) { showDetailError(data.message); return; }
      renderDetail(data.item, data.category);
    },
    error: function () { showDetailError('Could not load item details.'); }
  });
}

function renderDetail(item, category) {
  const icons = { characters: '⚔️', places: '🗺️', monuments: '🏛️' };
  const labels = { characters: 'Character', places: 'Place', monuments: 'Monument' };

  // Image or placeholder
  const imgHtml = item.image && item.image !== 'assets/images/placeholder.jpg'
    ? `<img class="detail-hero-img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">`
    : `<div class="detail-hero-placeholder">${icons[category] || '📚'}</div>`;

  // Meta pills based on category
  let metaPills = '';
  if (category === 'characters') {
    if (item.age)       metaPills += metaPill('⏳', 'Age', item.age);
    if (item.abilities) metaPills += metaPill('✨', 'Abilities', item.abilities);
  } else if (category === 'places') {
    if (item.location) metaPills += metaPill('📍', 'Location', item.location);
    if (item.climate)  metaPills += metaPill('🌤', 'Climate', item.climate);
  } else if (category === 'monuments') {
    if (item.location) metaPills += metaPill('📍', 'Location', item.location);
  }

  // Accordion sections
  let accordionItems = '';
  accordionItems += accordionSection('📜 Description', item.description);

  if (category === 'characters' && item.abilities) {
    accordionItems += accordionSection('✨ Abilities & Powers', item.abilities);
  }
  if (category === 'places' && item.climate) {
    accordionItems += accordionSection('🌤 Climate & Environment', item.climate);
  }
  if (category === 'monuments' && item.historical_significance) {
    accordionItems += accordionSection('🏺 Historical Significance', item.historical_significance);
  }

  const html = `
    <a class="back-btn" href="#" onclick="loadCatalogue('${category}')">← Back to ${labels[category] || category}</a>
    <div style="margin-top:2rem;"></div>
    ${imgHtml}
    <span class="detail-category-tag">${icons[category]} ${labels[category] || category}</span>
    <h1 class="detail-name">${escapeHtml(item.name)}</h1>
    <div class="detail-meta-row">${metaPills}</div>
    <div class="accordion">${accordionItems}</div>`;

  $('#detail-content').hide().html(html).fadeIn(500);
  initAccordion();
}

function metaPill(icon, label, value) {
  return `<span class="detail-meta-pill">${icon} <strong>${label}:</strong> ${escapeHtml(value)}</span>`;
}

function accordionSection(title, content) {
  return `
  <div class="accordion-item">
    <button class="accordion-header" type="button">
      ${title} <span class="acc-icon">▾</span>
    </button>
    <div class="accordion-body">${escapeHtml(content)}</div>
  </div>`;
}

function showDetailError(msg) {
  $('#detail-content').html(`<div class="empty-state"><div class="empty-icon">⚠️</div><p>${escapeHtml(msg)}</p></div>`);
}

/* ── jQuery Accordion ────────────────────────────────────── */
function initAccordion() {
  // Open first section by default
  $('.accordion-header').first().addClass('open').next('.accordion-body').show();

  $('.accordion-header').on('click', function () {
    const $body   = $(this).next('.accordion-body');
    const isOpen  = $(this).hasClass('open');

    // Close all
    $('.accordion-header').removeClass('open');
    $('.accordion-body').slideUp(300);

    // Open clicked (if it was closed)
    if (!isOpen) {
      $(this).addClass('open');
      $body.slideDown(350);
    }
  });
}

/* ── Card entrance animations (jQuery) ───────────────────── */
function animateCards(selector) {
  $(selector).each(function (i) {
    const $card = $(this);
    setTimeout(function () {
      $card.addClass('visible');
    }, i * 80);
  });
}

/* ── XSS helper ──────────────────────────────────────────── */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
