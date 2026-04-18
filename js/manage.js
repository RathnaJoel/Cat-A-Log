/* ============================================================
   Cat-A-Log! — manage.js
   Manage Content page:
     1. On load → check session via PHP
     2. If not logged in → show login screen
     3. If logged in → show full manage content panel
   All CRUD operations identical to old admin.js.
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */
const MGR = {
  activeCategory: 'characters',
  editId:         null,
  searchTimer:    null,
  adminEmail:     '',
};

const EXTRA_FIELDS = {
  characters: [
    { key: 'age',       label: 'Age',       type: 'text',     placeholder: 'e.g. 27' },
    { key: 'abilities', label: 'Abilities', type: 'textarea', placeholder: 'Comma-separated abilities' },
  ],
  places: [
    { key: 'location', label: 'Location', type: 'text',     placeholder: 'e.g. Northern Continent' },
    { key: 'climate',  label: 'Climate',  type: 'text',     placeholder: 'e.g. Alpine / Stormy' },
  ],
  monuments: [
    { key: 'location',                label: 'Location',               type: 'text',     placeholder: 'e.g. Valdara Peaks' },
    { key: 'historical_significance', label: 'Historical Significance', type: 'textarea', placeholder: 'Historical details...' },
  ],
};

const CAT_ICONS = { characters: '⚔️', places: '🗺️', monuments: '🏛️' };

/* ── App boot: check session first ──────────────────────────── */
$(document).ready(function () {
  $.getJSON('api/check_session.php', function (res) {
    if (res.logged_in) {
      MGR.adminEmail = res.email;
      showManagePanel();
    } else {
      showLoginScreen();
    }
  }).fail(function () {
    showLoginScreen(); // default to login on error
  });
});

/* ============================================================
   LOGIN SCREEN
   ============================================================ */
function showLoginScreen() {
  const html = `
    <div class="login-screen">
      <div class="login-card">
        <span class="login-icon">🗂</span>
        <h2>Manage Content</h2>
        <p class="login-subtitle">Authorized access only</p>
        <div class="login-divider"></div>

        <div class="login-error" id="login-error"></div>

        <div class="login-field">
          <label>Admin Email</label>
          <input type="email" id="login-email" placeholder="admin@catalog.com"
                 autocomplete="username" />
        </div>

        <div class="login-field">
          <label>Password</label>
          <div class="pw-wrap">
            <input type="password" id="login-password" placeholder="••••••••••"
                   autocomplete="current-password" />
            <button class="pw-toggle" type="button" id="pw-toggle-btn"
                    onclick="togglePwVisibility()">👁</button>
          </div>
        </div>

        <button class="btn-login" id="login-btn" onclick="doLogin()">
          Unlock Panel →
        </button>

        <a href="index.html" class="login-back">← Return to Cat-A-Log!</a>
      </div>
    </div>`;

  $('#app').html(html);

  // Allow Enter key to submit
  $('#login-email, #login-password').on('keydown', function (e) {
    if (e.key === 'Enter') doLogin();
  });
}

function togglePwVisibility() {
  const $inp = $('#login-password');
  const isHidden = $inp.attr('type') === 'password';
  $inp.attr('type', isHidden ? 'text' : 'password');
  $('#pw-toggle-btn').text(isHidden ? '🙈' : '👁');
}

function doLogin() {
  const email    = $('#login-email').val().trim();
  const password = $('#login-password').val();

  if (!email || !password) {
    showLoginError('Please enter your email and password.');
    return;
  }

  $('#login-btn').prop('disabled', true).text('Verifying…');
  $('#login-error').removeClass('show');

  $.ajax({
    url:         'api/login.php',
    method:      'POST',
    contentType: 'application/json',
    data:        JSON.stringify({ email, password }),
    dataType:    'json',
    success: function (res) {
      if (res.success) {
        MGR.adminEmail = res.email;
        // Fade out login, fade in panel
        $('#app').fadeOut(300, function () {
          showManagePanel();
          $('#app').fadeIn(400);
        });
      } else {
        showLoginError(res.message);
        $('#login-btn').prop('disabled', false).text('Unlock Panel →');
      }
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.message || 'Login failed. Check your credentials.';
      showLoginError(msg);
      $('#login-btn').prop('disabled', false).text('Unlock Panel →');
    },
  });
}

function showLoginError(msg) {
  $('#login-error').text(msg).addClass('show');
}

/* ── Logout ──────────────────────────────────────────────────── */
function doLogout() {
  $.post('api/logout.php', function () {
    $('#app').fadeOut(250, function () {
      showLoginScreen();
      $('#app').fadeIn(350);
    });
  });
}

/* ============================================================
   MANAGE CONTENT PANEL (shown after successful login)
   ============================================================ */
function showManagePanel() {
  const html = `
    <header class="site-header">
      <div class="site-logo">📖 Cat<span>-A-</span>Log!</div>
      <nav class="site-nav" style="display:flex;align-items:center;gap:.6rem;">
        <a href="index.html">← Back to Site</a>
        <span class="user-pill">
          <span class="user-dot"></span>
          ${escHtml(MGR.adminEmail)}
        </span>
        <button class="btn-logout" onclick="doLogout()">Log Out</button>
      </nav>
    </header>

    <main>
      <section class="page-hero">
        <h1>🗂 Manage Content</h1>
        <p class="subtitle">Add, edit, and delete catalogue entries.</p>
        <div class="hero-divider"></div>
      </section>

      <div class="admin-wrap">

        <!-- Stats row -->
        <div class="admin-stats" id="admin-stats">
          <div class="spinner-wrap"><div class="spinner"></div></div>
        </div>

        <!-- Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab-btn active" onclick="switchTab('add',this)">➕ Add Entry</button>
          <button class="admin-tab-btn"         onclick="switchTab('manage',this)">📋 Manage Entries</button>
        </div>

        <!-- ADD TAB -->
        <div id="tab-add" class="tab-panel">
          <div class="admin-form-card" id="entry-form-card">
            <h3 id="form-title">Add New Entry
              <span id="edit-badge" class="edit-mode-badge" style="display:none;">Editing</span>
            </h3>

            <div class="cat-toggle-group" id="cat-toggles">
              ${Object.keys(EXTRA_FIELDS).map(c => `
                <button class="cat-toggle ${c === MGR.activeCategory ? 'active' : ''}"
                        onclick="selectCategory('${c}')">${CAT_ICONS[c]} ${cap(c)}</button>
              `).join('')}
            </div>

            <div id="entry-form-fields"></div>

            <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem;">
              <button class="btn-submit" id="submit-btn" onclick="submitEntry()">➕ Add Entry</button>
              <button class="btn-cancel" id="cancel-edit-btn" style="display:none;" onclick="cancelEdit()">✕ Cancel Edit</button>
            </div>
          </div>
        </div>

        <!-- MANAGE TAB -->
        <div id="tab-manage" class="tab-panel" style="display:none;">
          <div class="admin-table-wrap">
            <div class="admin-table-header">
              <h3 id="manage-title">${CAT_ICONS[MGR.activeCategory]} ${cap(MGR.activeCategory)}</h3>
              <div class="search-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="manage-search" placeholder="Search…" />
              </div>
            </div>
            <div style="padding:.9rem 1.5rem;border-bottom:1px solid var(--border);">
              <div class="cat-toggle-group">
                ${Object.keys(EXTRA_FIELDS).map(c => `
                  <button class="cat-toggle ${c === MGR.activeCategory ? 'active' : ''}"
                          onclick="selectCategory('${c}',true)">${CAT_ICONS[c]} ${cap(c)}</button>
                `).join('')}
              </div>
            </div>
            <div id="manage-table-body">
              <div class="spinner-wrap"><div class="spinner"></div></div>
            </div>
          </div>
        </div>

      </div><!-- /admin-wrap -->
    </main>

    <footer class="site-footer">Cat-A-Log! &mdash; Manage Content &copy; ${new Date().getFullYear()}</footer>

    <!-- Delete modal -->
    <div class="modal-overlay" id="delete-modal">
      <div class="modal-box">
        <h3>🗑 Confirm Delete</h3>
        <p id="delete-modal-msg">Are you sure? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-cancel"      onclick="closeDeleteModal()">Cancel</button>
          <button class="btn-confirm-del" onclick="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>`;

  $('#app').html(html);
  renderFormFields();
  loadStats();

  // Manage-tab search
  $('#manage-search').on('input', function () {
    clearTimeout(MGR.searchTimer);
    MGR.searchTimer = setTimeout(() => loadManageTable($(this).val()), 350);
  });
}

/* ── Tab switching ──────────────────────────────────────────── */
function switchTab(tab, btn) {
  $('.tab-panel').hide();
  $('.admin-tab-btn').removeClass('active');
  $(`#tab-${tab}`).show();
  $(btn).addClass('active');
  if (tab === 'manage') loadManageTable($('#manage-search').val() || '');
}

/* ── Category selection ─────────────────────────────────────── */
function selectCategory(cat, fromManage = false) {
  MGR.activeCategory = cat;
  MGR.editId = null;

  $('.cat-toggle').removeClass('active');
  $('.cat-toggle').each(function () {
    if ($(this).text().toLowerCase().includes(cat)) $(this).addClass('active');
  });

  renderFormFields();
  cancelEdit();

  if (fromManage) {
    $('#manage-title').text(CAT_ICONS[cat] + ' ' + cap(cat));
    loadManageTable($('#manage-search').val() || '');
  }
}

/* ── Render add/edit form fields ────────────────────────────── */
function renderFormFields(prefill = {}) {
  const fields = EXTRA_FIELDS[MGR.activeCategory];
  let html = `<div class="form-grid">
    <div class="form-group">
      <label>Name *</label>
      <input type="text" id="f-name" placeholder="Entry name"
             value="${escHtml(prefill.name || '')}" />
    </div>
    <div class="form-group">
      <label>Image Path</label>
      <input type="text" id="f-image"
             placeholder="assets/images/${MGR.activeCategory}/filename.jpg"
             value="${escHtml(prefill.image || '')}" />
    </div>
    <div class="form-group full">
      <label>Description *</label>
      <textarea id="f-description" placeholder="Short description…">${escHtml(prefill.description || '')}</textarea>
    </div>`;

  fields.forEach(f => {
    const val = escHtml(prefill[f.key] || '');
    if (f.type === 'textarea') {
      html += `<div class="form-group full">
        <label>${f.label}</label>
        <textarea id="f-${f.key}" placeholder="${f.placeholder}">${val}</textarea>
      </div>`;
    } else {
      html += `<div class="form-group">
        <label>${f.label}</label>
        <input type="text" id="f-${f.key}" placeholder="${f.placeholder}" value="${val}" />
      </div>`;
    }
  });

  html += `</div>`;
  $('#entry-form-fields').html(html);
}

/* ── Submit entry (add or update) ───────────────────────────── */
function submitEntry() {
  const name        = $('#f-name').val().trim();
  const image       = $('#f-image').val().trim() || `assets/images/${MGR.activeCategory}/placeholder.jpg`;
  const description = $('#f-description').val().trim();

  if (!name || !description) {
    showToast('Name and description are required.', 'error');
    return;
  }

  const payload = { category: MGR.activeCategory, name, image, description };
  EXTRA_FIELDS[MGR.activeCategory].forEach(f => {
    payload[f.key] = $(`#f-${f.key}`).val().trim();
  });

  const isEdit = MGR.editId !== null;
  if (isEdit) payload.id = MGR.editId;

  $('#submit-btn').prop('disabled', true).text('Saving…');

  $.ajax({
    url:         isEdit ? 'api/update_item.php' : 'api/add_item.php',
    method:      'POST',
    contentType: 'application/json',
    data:        JSON.stringify(payload),
    dataType:    'json',
    success: function (res) {
      if (res.success) {
        showToast(res.message, 'success');
        cancelEdit();
        loadStats();
        loadManageTable();
      } else if (res.auth === false) {
        // Session expired
        showToast('Session expired. Please log in again.', 'error');
        setTimeout(() => { showLoginScreen(); }, 1500);
      } else {
        showToast(res.message, 'error');
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showToast('Session expired. Redirecting to login…', 'error');
        setTimeout(showLoginScreen, 1500);
      } else {
        showToast('Server error. Is XAMPP running?', 'error');
      }
    },
    complete: function () {
      $('#submit-btn').prop('disabled', false)
        .text(MGR.editId ? '💾 Save Changes' : '➕ Add Entry');
    },
  });
}

/* ── Edit ───────────────────────────────────────────────────── */
function startEdit(category, id) {
  switchTab('add', $('.admin-tab-btn').first()[0]);
  MGR.editId = id;
  selectCategory(category);

  $.ajax({
    url:      `api/get_detail.php?category=${encodeURIComponent(category)}&id=${id}`,
    method:   'GET',
    dataType: 'json',
    success: function (res) {
      if (!res.success) { showToast('Could not load entry.', 'error'); return; }
      renderFormFields(res.item);
      MGR.editId = id;

      $('#form-title').html(`Edit Entry <span id="edit-badge" class="edit-mode-badge">Editing ID #${id}</span>`);
      $('#submit-btn').text('💾 Save Changes');
      $('#cancel-edit-btn').show();
      $('#entry-form-card').addClass('edit-mode');
      $('html,body').animate({ scrollTop: $('#entry-form-card').offset().top - 100 }, 400);
    },
    error: function () { showToast('Failed to load entry.', 'error'); },
  });
}

function cancelEdit() {
  MGR.editId = null;
  $('#form-title').html('Add New Entry <span id="edit-badge" class="edit-mode-badge" style="display:none;"></span>');
  $('#submit-btn').text('➕ Add Entry');
  $('#cancel-edit-btn').hide();
  $('#entry-form-card').removeClass('edit-mode');
  renderFormFields();
}

/* ── Delete ─────────────────────────────────────────────────── */
let _deleteTarget = null;

function askDelete(category, id, name) {
  _deleteTarget = { category, id };
  $('#delete-modal-msg').text(`Delete "${name}" from ${cap(category)}? This cannot be undone.`);
  $('#delete-modal').addClass('open');
}

function closeDeleteModal() {
  $('#delete-modal').removeClass('open');
  _deleteTarget = null;
}

function confirmDelete() {
  if (!_deleteTarget) return;
  const { category, id } = _deleteTarget;
  closeDeleteModal();

  $.ajax({
    url:         'api/delete_item.php',
    method:      'POST',
    contentType: 'application/json',
    data:        JSON.stringify({ category, id }),
    dataType:    'json',
    success: function (res) {
      if (res.success) {
        showToast('Entry deleted.', 'success');
        loadStats();
        loadManageTable($('#manage-search').val() || '');
      } else if (res.auth === false) {
        showToast('Session expired. Please log in again.', 'error');
        setTimeout(showLoginScreen, 1500);
      } else {
        showToast(res.message, 'error');
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showToast('Session expired. Redirecting to login…', 'error');
        setTimeout(showLoginScreen, 1500);
      } else {
        showToast('Delete failed.', 'error');
      }
    },
  });
}

/* ── Stats ──────────────────────────────────────────────────── */
function loadStats() {
  const cats = ['characters', 'places', 'monuments'];
  let loaded = 0;
  const counts = {};

  cats.forEach(cat => {
    $.getJSON(`api/get_items.php?category=${cat}&page=1&search=`, function (d) {
      counts[cat] = d.total || 0;
    }).fail(function () {
      counts[cat] = '—';
    }).always(function () {
      loaded++;
      if (loaded === cats.length) renderStats(counts);
    });
  });
}

function renderStats(counts) {
  const total = Object.values(counts).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
  const html = Object.entries(counts).map(([cat, n]) => `
    <div class="admin-stat-card">
      <div class="stat-num">${CAT_ICONS[cat]} ${n}</div>
      <div class="stat-lbl">${cap(cat)}</div>
    </div>`).join('') + `
    <div class="admin-stat-card">
      <div class="stat-num">📚 ${total}</div>
      <div class="stat-lbl">Total Entries</div>
    </div>`;
  $('#admin-stats').html(html);
}

/* ── Manage table ───────────────────────────────────────────── */
function loadManageTable(search = '') {
  const cat = MGR.activeCategory;
  $('#manage-table-body').html('<div class="spinner-wrap"><div class="spinner"></div></div>');

  $.getJSON(`api/get_items.php?category=${cat}&page=1&search=${encodeURIComponent(search)}`, function (data) {
    if (!data.success || !data.items.length) {
      $('#manage-table-body').html('<div class="empty-state" style="padding:2rem;"><div class="empty-icon">🔎</div><p>No entries found.</p></div>');
      return;
    }

    const extraDefs = EXTRA_FIELDS[cat];
    const extraHeaders = extraDefs.map(f => `<th>${f.label}</th>`).join('');

    const rows = data.items.map(item => {
      const extras = extraDefs.map(f => `<td>${escHtml(item[f.key] || '—')}</td>`).join('');
      return `<tr>
        <td style="color:var(--text-muted);font-size:.8rem;">${item.id}</td>
        <td class="td-name">${escHtml(item.name)}</td>
        <td class="td-desc">${escHtml(item.description)}</td>
        ${extras}
        <td style="white-space:nowrap;">
          <button class="tbl-btn edit"   onclick="startEdit('${cat}',${item.id})">✏️ Edit</button>
          <button class="tbl-btn delete" onclick="askDelete('${cat}',${item.id},'${escHtml(item.name).replace(/'/g,"\\'")}')">🗑 Delete</button>
        </td>
      </tr>`;
    }).join('');

    $('#manage-table-body').html(`
      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead><tr>
            <th>ID</th><th>Name</th><th>Description</th>
            ${extraHeaders}<th>Actions</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:.75rem 1.2rem;font-size:.78rem;color:var(--text-muted);border-top:1px solid var(--border);">
        Showing ${data.items.length} of ${data.total} entries
      </div>`);
  }).fail(function () {
    $('#manage-table-body').html('<div class="empty-state" style="padding:2rem;"><div class="empty-icon">⚠️</div><p>Failed to load entries.</p></div>');
  });
}

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const $t = $('#toast');
  $t.text(msg).removeClass('success error').addClass(type + ' show');
  setTimeout(() => $t.removeClass('show'), 3200);
}

/* ── Helpers ────────────────────────────────────────────────── */
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
