/**
 * reports.js — MedTrack Pro
 * Reports & analytics page
 */

document.addEventListener('DOMContentLoaded', () => {
  renderReports();
});

function renderReports() {
  const settings = DB.getSettings();
  const meds = DB.getMedicines().map(enrichMedicine);

  const expired  = meds.filter(m => m.status === 'expired');
  const warn     = meds.filter(m => m.status === 'warn');
  const safe     = meds.filter(m => m.status === 'safe');
  const lowStock = meds.filter(m => m.qty <= settings.lowStockQty);
  const totalValue = meds.reduce((sum, m) => sum + (m.price || 0) * (m.qty || 0), 0);
  const expiredValue = expired.reduce((sum, m) => sum + (m.price || 0) * (m.qty || 0), 0);

  // Report cards
  const grid = document.getElementById('reportGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="report-card">
        <div class="report-card-title">Total SKUs</div>
        <div class="report-card-value" style="color:var(--info)">${meds.length}</div>
      </div>
      <div class="report-card">
        <div class="report-card-title">Total Inventory Value</div>
        <div class="report-card-value" style="color:var(--accent)">₹${totalValue.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
      </div>
      <div class="report-card">
        <div class="report-card-title">Expired Value (loss)</div>
        <div class="report-card-value" style="color:var(--danger)">₹${expiredValue.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
      </div>
      <div class="report-card">
        <div class="report-card-title">Low Stock Items</div>
        <div class="report-card-value" style="color:var(--warn)">${lowStock.length}</div>
      </div>
    `;
  }

  // Category breakdown
  const catEl = document.getElementById('categoryBreakdown');
  if (catEl) {
    const cats = {};
    meds.forEach(m => {
      const c = m.category || 'Uncategorised';
      cats[c] = (cats[c] || 0) + 1;
    });
    const sorted = Object.entries(cats).sort((a,b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;

    catEl.innerHTML = sorted.length
      ? sorted.map(([cat, count]) => `
          <div class="category-row">
            <div class="cat-name">${esc(cat)}</div>
            <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round(count/max*100)}%"></div></div>
            <div class="cat-count">${count}</div>
          </div>`).join('')
      : '<p style="color:var(--muted);padding:20px;font-size:0.85rem">No data yet.</p>';
  }

  // Inventory value breakdown
  const valEl = document.getElementById('inventoryValue');
  if (valEl) {
    const rows = [
      { label:'Safe stock value',       val: safe.reduce((s,m)   => s + (m.price||0)*(m.qty||0), 0), color:'var(--safe)' },
      { label:'Expiring soon value',    val: warn.reduce((s,m)   => s + (m.price||0)*(m.qty||0), 0), color:'var(--warn)' },
      { label:'Expired stock (at risk)', val: expiredValue,                                            color:'var(--danger)' },
      { label:'Total inventory value',  val: totalValue,                                               color:'var(--info)' },
    ];
    valEl.innerHTML = rows.map(r => `
      <div class="value-row">
        <span class="value-label">${r.label}</span>
        <span class="value-num" style="color:${r.color}">₹${r.val.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
      </div>`).join('');
  }
}

/* ---- EXPORT FUNCTIONS ---- */

function exportAll() {
  const meds = DB.getMedicines().map(enrichMedicine);
  if (!meds.length) { showToast('No data to export.'); return; }
  downloadFile(`medtrack_full_${ts()}.csv`, toCSV(meds, CSV_COLUMNS), 'text/csv');
  showToast('📥 Full inventory CSV exported!');
}

function exportExpired() {
  const meds = DB.getMedicines().map(enrichMedicine).filter(m => m.status === 'expired');
  if (!meds.length) { showToast('No expired medicines.'); return; }
  downloadFile(`medtrack_expired_${ts()}.csv`, toCSV(meds, CSV_COLUMNS), 'text/csv');
  showToast('📥 Expired CSV exported!');
}

function exportExpiringSoon() {
  const meds = DB.getMedicines().map(enrichMedicine).filter(m => m.status === 'warn');
  if (!meds.length) { showToast('No expiring-soon medicines.'); return; }
  downloadFile(`medtrack_expiring_${ts()}.csv`, toCSV(meds, CSV_COLUMNS), 'text/csv');
  showToast('📥 Expiring-soon CSV exported!');
}

function exportLowStock() {
  const settings = DB.getSettings();
  const meds = DB.getMedicines().map(enrichMedicine).filter(m => m.qty <= settings.lowStockQty);
  if (!meds.length) { showToast('No low-stock medicines.'); return; }
  downloadFile(`medtrack_lowstock_${ts()}.csv`, toCSV(meds, CSV_COLUMNS), 'text/csv');
  showToast('📥 Low stock CSV exported!');
}

function printReport() {
  window.print();
}

function ts() {
  return new Date().toISOString().slice(0,10);
}
