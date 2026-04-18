/* ============================================================
   Cat-A-Log! — admin.js
   Admin Panel: Add / Edit / Delete entries via AJAX + jQuery
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */
const ADMIN = {
  activeCategory: 'characters',
  editId:         null,      // non-null when editing an existing entry
  searchTimer:    null,
};

/* ── Extra fields per category ──────────────────────────────── */
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

const CATEGORY_ICONS = { characters: '⚔️', places: '🗺️', monuments: '🏛️' };

/* ── Entry point ─────────────────────────────────────────────── */
$(document).ready(function () {
  showAdmin();
});

/* ============================================================
   RENDER ADMIN SHELL
   ============================================================ */
function showAdmin() {
  const html = `
    <header class="site-header">
      <div class="site-logo">📖 Cat<span>-A-</span>Log! <span style="font-size:.8rem;color:var(--text-muted);margin-left:.5rem;">Admin</span></div>
      <nav class="site-nav">
        <a href="/Cat-A-Log/">← Back to Home</a>
      </nav>
    </header>

    <main>
      <section class="page-hero">
        <h1>⚙️ Admin Panel</h1>
        <p class="subtitle">Add, edit, and delete catalogue entries.</p>
        <div class="hero-divider"></div>
      </section>

      <div class="admin-wrap">

        <!-- Stats -->
        <div class="admin-stats" id="admin-stats">
          <div class="spinner-wrap"><div class="spinner"></div></div>
        </div>

        <!-- Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab-btn active" data-tab="add"    onclick="switchTab('add',this)">➕ Add Entry</button>
          <button class="admin-tab-btn"         data-tab="manage" onclick="switchTab('manage',this)">📋 Manage Entries</button>
        </div>

        <!-- ADD TAB -->
        <div id="tab-add" class="tab-panel">
          <div class="admin-form-card" id="entry-form-card">
            <h3 id="form-title">Add New Entry <span id="edit-badge" class="edit-mode-badge" style="display:none;">Editing</span></h3>

            <!-- Category selector -->
            <div class="cat-toggle-group" id="cat-toggles">
              ${Object.keys(EXTRA_FIELDS).map(c => `
                <button class="cat-toggle ${c === ADMIN.activeCategory ? 'active' : ''}"
                        onclick="selectCategory('${c}')">${CATEGORY_ICONS[c]} ${cap(c)}</button>
              `).join('')}
            </div>

            <!-- Dynamic form -->
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
              <h3 id="manage-title">⚔️ Characters</h3>
              <div class="search-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="manage-search" class="srch" placeholder="Search…" />
              </div>
            </div>
            <!-- Category selector for manage tab -->
            <div style="padding:.9rem 1.5rem;border-bottom:1px solid var(--border);">
              <div class="cat-toggle-group" id="manage-cat-toggles">
                ${Object.keys(EXTRA_FIELDS).map(c => `
                  <button class="cat-toggle ${c === ADMIN.activeCategory ? 'active' : ''}"
                          onclick="selectCategory('${c}',true)">${CATEGORY_ICONS[c]} ${cap(c)}</button>
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

    <footer class="site-footer">Cat-A-Log! Admin Panel &copy; ${new Date().getFullYear()}</footer>

    <!-- Delete confirm modal -->
    <div class="modal-overlay" id="delete-modal">
      <div class="modal-box">
        <h3>🗑 Confirm Delete</h3>
        <p id="delete-modal-msg">Are you sure you want to delete this entry? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-cancel"      onclick="closeDeleteModal()">Cancel</button>
          <button class="btn-confirm-del" onclick="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>
  `;

  $('#app').html(html);
  renderFormFields();
  loadStats();
  loadManageTable();

  // Wire up manage search
  $('#manage-search').on('input', function () {
    clearTimeout(ADMIN.searchTimer);
    ADMIN.searchTimer = setTimeout(() => loadManageTable($(this).val()), 350);
  });
}

/* ── Tab switching ───────────────────────────────────────────── */
function switchTab(tab, btn) {
  $('.tab-panel').hide();
  $('.admin-tab-btn').removeClass('active');
  $(`#tab-${tab}`).show();
  $(btn).addClass('active');
  if (tab === 'manage') loadManageTable($('#manage-search').val());
}

/* ── Category selection ──────────────────────────────────────── */
function selectCategory(cat, fromManage = false) {
  ADMIN.activeCategory = cat;
  ADMIN.editId = null;

  // Sync both toggle groups
  $('.cat-toggle').removeClass('active');
  $(`.cat-toggle`).each(function () {
    if ($(this).text().toLowerCase().includes(cat)) $(this).addClass('active');
  });

  renderFormFields();
  if (fromManage) {
    $('#manage-title').text(CATEGORY_ICONS[cat] + ' ' + cap(cat));
    loadManageTable($('#manage-search').val());
  }
  cancelEdit();
}

/* ── Render form fields ──────────────────────────────────────── */
function renderFormFields(prefill = {}) {
  const fields = EXTRA_FIELDS[ADMIN.activeCategory];
  let html = `<div class="form-grid">
    <div class="form-group">
      <label>Name *</label>
      <input type="text" id="f-name" placeholder="Entry name" value="${escHtml(prefill.name || '')}" />
    </div>
    <div class="form-group">
      <label>Image Path</label>
      <input type="text" id="f-image" placeholder="assets/images/${ADMIN.activeCategory}/filename.jpg"
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

/* ── Submit (Add or Update) ──────────────────────────────────── */
function submitEntry() {
  const name        = $('#f-name').val().trim();
  const image       = $('#f-image').val().trim() || `assets/images/${ADMIN.activeCategory}/placeholder.jpg`;
  const description = $('#f-description').val().trim();

  if (!name || !description) {
    showToast('Name and description are required.', 'error');
    return;
  }

  const payload = { category: ADMIN.activeCategory, name, image, description };

  EXTRA_FIELDS[ADMIN.activeCategory].forEach(f => {
    payload[f.key] = $(`#f-${f.key}`).val().trim();
  });

  const isEdit  = ADMIN.editId !== null;
  const url     = isEdit ? 'api/update_item.php' : 'api/add_item.php';
  if (isEdit) payload.id = ADMIN.editId;

  $('#submit-btn').prop('disabled', true).text('Saving…');

  $.ajax({
    url,
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
      } else {
        showToast(res.message, 'error');
      }
    },
    error: function () { showToast('Server error. Is XAMPP running?', 'error'); },
    complete: function () { $('#submit-btn').prop('disabled', false).text(ADMIN.editId ? '💾 Save Changes' : '➕ Add Entry'); },
  });
}

/* ── Edit mode ───────────────────────────────────────────────── */
function startEdit(category, id) {
  // Switch to Add tab
  switchTab('add', $('.admin-tab-btn[data-tab="add"]')[0]);
  ADMIN.editId = id;
  selectCategory(category);

  $.ajax({
    url:      `api/get_detail.php?category=${encodeURIComponent(category)}&id=${id}`,
    method:   'GET',
    dataType: 'json',
    success: function (res) {
      if (!res.success) { showToast('Could not load entry.', 'error'); return; }
      renderFormFields(res.item);
      ADMIN.editId = id; // selectCategory resets it, restore after

      $('#form-title').html(`Edit Entry <span id="edit-badge" class="edit-mode-badge">Editing ID #${id}</span>`);
      $('#submit-btn').text('💾 Save Changes');
      $('#cancel-edit-btn').show();
      $('#entry-form-card').addClass('edit-mode');

      $('html, body').animate({ scrollTop: $('#entry-form-card').offset().top - 100 }, 400);
    },
    error: function () { showToast('Failed to load entry data.', 'error'); },
  });
}

function cancelEdit() {
  ADMIN.editId = null;
  $('#form-title').html('Add New Entry <span id="edit-badge" class="edit-mode-badge" style="display:none;">Editing</span>');
  $('#submit-btn').text('➕ Add Entry');
  $('#cancel-edit-btn').hide();
  $('#entry-form-card').removeClass('edit-mode');
  renderFormFields();
}

/* ── Delete flow ─────────────────────────────────────────────── */
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
        loadManageTable($('#manage-search').val());
      } else {
        showToast(res.message, 'error');
      }
    },
    error: function () { showToast('Delete failed.', 'error'); },
  });
}

/* ── Load stats ──────────────────────────────────────────────── */
function loadStats() {
  const categories = ['characters', 'places', 'monuments'];
  let loaded = 0;
  const counts = {};

  categories.forEach(cat => {
    $.getJSON(`api/get_items.php?category=${cat}&page=1&search=`, function (data) {
      counts[cat] = data.total || 0;
      loaded++;
      if (loaded === categories.length) renderStats(counts);
    }).fail(function () {
      counts[cat] = '—';
      loaded++;
      if (loaded === categories.length) renderStats(counts);
    });
  });
}

function renderStats(counts) {
  const total = Object.values(counts).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);
  const html = `
    ${Object.entries(counts).map(([cat, n]) => `
      <div class="admin-stat-card">
        <div class="stat-num">${CATEGORY_ICONS[cat]} ${n}</div>
        <div class="stat-lbl">${cap(cat)}</div>
      </div>`).join('')}
    <div class="admin-stat-card">
      <div class="stat-num">📚 ${total}</div>
      <div class="stat-lbl">Total Entries</div>
    </div>`;
  $('#admin-stats').html(html);
}

/* ── Load manage table ───────────────────────────────────────── */
function loadManageTable(search = '') {
  const cat = ADMIN.activeCategory;
  $('#manage-table-body').html('<div class="spinner-wrap"><div class="spinner"></div></div>');

  $.getJSON(`api/get_items.php?category=${cat}&page=1&search=${encodeURIComponent(search)}&limit=50`, function (data) {
    if (!data.success || !data.items.length) {
      $('#manage-table-body').html('<div class="empty-state" style="padding:2rem;"><div class="empty-icon">🔎</div><p>No entries found.</p></div>');
      return;
    }

    // Determine extra col headers
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
          <button class="tbl-btn edit"   onclick="startEdit('${cat}', ${item.id})">✏️ Edit</button>
          <button class="tbl-btn delete" onclick="askDelete('${cat}', ${item.id}, '${escHtml(item.name).replace(/'/g,"\\'")}')">🗑 Delete</button>
        </td>
      </tr>`;
    }).join('');

    const html = `
      <div style="overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Description</th>
              ${extraHeaders}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:.75rem 1.2rem;font-size:.78rem;color:var(--text-muted);border-top:1px solid var(--border);">
        Showing ${data.items.length} of ${data.total} entries
      </div>`;

    $('#manage-table-body').html(html);
  }).fail(function () {
    $('#manage-table-body').html('<div class="empty-state" style="padding:2rem;"><div class="empty-icon">⚠️</div><p>Failed to load. Is XAMPP running?</p></div>');
  });
}

/* ── Toast ───────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const $t = $('#toast');
  $t.text(msg).removeClass('success error').addClass(type).addClass('show');
  setTimeout(() => $t.removeClass('show'), 3200);
}

/* ── Helpers ─────────────────────────────────────────────────── */
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
