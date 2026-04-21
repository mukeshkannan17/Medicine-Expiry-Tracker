/**
 * medicines.js — MedTrack Pro
 * Full medicine list with add/edit/delete
 */

let currentFilter = 'all';
let sortKey = 'days';
let sortAsc = true;
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  DB.seedDemo();
  populateCategoryFilter();
  renderMedicineTable();
});

/* ---- FILTER & SORT ---- */

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMedicineTable();
}

function sortMeds(key) {
  sortAsc = (sortKey === key) ? !sortAsc : true;
  sortKey = key;
  renderMedicineTable();
}

function getFilteredMeds() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('categoryFilter')?.value || '';
  const settings = DB.getSettings();

  return DB.getMedicines()
    .map(enrichMedicine)
    .filter(m => {
      const statusMatch = currentFilter === 'all' || m.status === currentFilter;
      const searchMatch = !q || m.name.toLowerCase().includes(q) || (m.batch||'').toLowerCase().includes(q) || (m.category||'').toLowerCase().includes(q);
      const catMatch = !cat || m.category === cat;
      return statusMatch && searchMatch && catMatch;
    })
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'name' || sortKey === 'batch' || sortKey === 'category') {
        va = (va||'').toLowerCase(); vb = (vb||'').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      va = Number(va||0); vb = Number(vb||0);
      return sortAsc ? va - vb : vb - va;
    });
}

/* ---- RENDER TABLE ---- */

function renderMedicineTable() {
  const data = getFilteredMeds();
  const tbody = document.getElementById('medTableBody');
  const empty = document.getElementById('emptyState');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const settings = DB.getSettings();

  tbody.innerHTML = data.map(m => {
    const statusLabel = m.status === 'expired' ? 'Expired' : m.status === 'warn' ? 'Expiring Soon' : 'Safe';
    const daysCls = `days-val days-${m.status}`;
    const qtyHtml = m.qty > 0 && m.qty <= settings.lowStockQty
      ? `<span class="qty-low">${m.qty} ⚠</span>`
      : `<span>${m.qty || 0}</span>`;

    return `<tr>
      <td>
        <div class="med-name">${esc(m.name)}</div>
        <div class="med-sub">${esc(m.mfr || '—')}</div>
      </td>
      <td style="font-size:0.82rem;color:var(--muted2)">${esc(m.category || '—')}</td>
      <td style="font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--muted)">${esc(m.batch || '—')}</td>
      <td style="font-family:'DM Mono',monospace;font-size:0.82rem">${fmtExpiry(m.expiry)}</td>
      <td><span class="${daysCls}">${fmtDays(m.days)}</span></td>
      <td>${qtyHtml}</td>
      <td><span class="status-pill status-${m.status}">${statusLabel}</span></td>
      <td>
        <div class="tbl-btns">
          <button class="btn-edit" onclick="openModal(${m.id})">Edit</button>
          <button class="btn-del" onclick="deleteMed(${m.id})">Delete</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ---- CATEGORY FILTER POPULATE ---- */

function populateCategoryFilter() {
  const sel = document.getElementById('categoryFilter');
  const list = document.getElementById('catList');
  const meds = DB.getMedicines();
  const cats = [...new Set(meds.map(m => m.category).filter(Boolean))].sort();

  if (sel) {
    sel.innerHTML = '<option value="">All Categories</option>' +
      cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  }
  if (list) {
    list.innerHTML = cats.map(c => `<option value="${esc(c)}">`).join('');
  }
}

/* ---- MODAL ---- */

function openModal(id = null) {
  editingId = id;
  const overlay = document.getElementById('modalOverlay');
  const title   = document.getElementById('modalTitle');
  overlay.classList.add('open');

  if (id) {
    const m = DB.getMedicineById(id);
    title.textContent = 'Edit Medicine';
    document.getElementById('fId').value = m.id;
    document.getElementById('fName').value = m.name || '';
    document.getElementById('fCategory').value = m.category || '';
    document.getElementById('fBatch').value = m.batch || '';
    document.getElementById('fMfr').value = m.mfr || '';
    document.getElementById('fExpiry').value = m.expiry || '';
    document.getElementById('fQty').value = m.qty || '';
    document.getElementById('fPrice').value = m.price || '';
    document.getElementById('fLocation').value = m.location || '';
    document.getElementById('fNotes').value = m.notes || '';
  } else {
    title.textContent = 'Add Medicine';
    ['fId','fName','fCategory','fBatch','fMfr','fExpiry','fQty','fPrice','fLocation','fNotes']
      .forEach(id => { document.getElementById(id).value = ''; });
  }
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

function saveMedicine() {
  const name   = document.getElementById('fName').value.trim();
  const expiry = document.getElementById('fExpiry').value;
  if (!name) { showToast('⚠ Medicine name is required.'); return; }
  if (!expiry) { showToast('⚠ Expiry date is required.'); return; }

  const data = {
    name,
    category: document.getElementById('fCategory').value.trim(),
    batch:    document.getElementById('fBatch').value.trim(),
    mfr:      document.getElementById('fMfr').value.trim(),
    expiry,
    qty:      parseInt(document.getElementById('fQty').value) || 0,
    price:    parseFloat(document.getElementById('fPrice').value) || 0,
    location: document.getElementById('fLocation').value.trim(),
    notes:    document.getElementById('fNotes').value.trim(),
  };

  if (editingId) {
    DB.updateMedicine(editingId, data);
    showToast('✅ Medicine updated!');
  } else {
    DB.addMedicine(data);
    showToast('✅ Medicine added!');
  }

  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
  populateCategoryFilter();
  renderMedicineTable();
  updateAlertBadge();
}

function deleteMed(id) {
  if (!confirm('Delete this medicine? This cannot be undone.')) return;
  DB.deleteMedicine(id);
  renderMedicineTable();
  updateAlertBadge();
  showToast('🗑 Medicine deleted.');
}

/* ---- EXPORT ---- */

function exportCSV() {
  const meds = getFilteredMeds();
  if (!meds.length) { showToast('No data to export.'); return; }
  const csv = toCSV(meds, CSV_COLUMNS);
  downloadFile(`medtrack_medicines_${new Date().toISOString().slice(0,10)}.csv`, csv, 'text/csv');
  showToast('📥 CSV exported!');
}
