/**
 * utils.js — MedTrack Pro
 * Shared helper functions
 */

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Returns number of days between today and the last day of the expiry month.
 * Negative = already expired.
 */
function getDaysLeft(expiryMonth) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [yr, mo] = expiryMonth.split('-').map(Number);
  const lastDay = new Date(yr, mo, 0); // day 0 of next month = last day of this month
  return Math.floor((lastDay - today) / (1000 * 60 * 60 * 24));
}

/**
 * Returns 'expired' | 'warn' | 'safe' based on days left.
 */
function getStatus(days, warnDays = 30) {
  if (days < 0) return 'expired';
  if (days <= warnDays) return 'warn';
  return 'safe';
}

/**
 * Returns enriched medicine object with computed days/status.
 */
function enrichMedicine(m) {
  const settings = DB.getSettings();
  const days = getDaysLeft(m.expiry);
  return {
    ...m,
    days,
    status: getStatus(days, settings.warnDays),
  };
}

/**
 * Format expiry month string "2025-03" → "Mar 2025"
 */
function fmtExpiry(expiryMonth) {
  const [yr, mo] = expiryMonth.split('-').map(Number);
  return `${MONTHS[mo - 1]} ${yr}`;
}

/**
 * Format days number to human-readable string.
 */
function fmtDays(days) {
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  return `${days}d`;
}

/**
 * Escape HTML to prevent XSS.
 */
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Download a text file.
 */
function downloadFile(filename, content, mime = 'text/plain') {
  const a = document.createElement('a');
  a.href = `data:${mime};charset=utf-8,` + encodeURIComponent(content);
  a.download = filename;
  a.click();
}

/**
 * Convert array of objects to CSV string.
 */
function toCSV(rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const v = c.fn ? c.fn(row) : (row[c.key] ?? '');
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  return header + '\n' + body;
}

const CSV_COLUMNS = [
  { label: 'Medicine Name',   key: 'name' },
  { label: 'Category',        key: 'category' },
  { label: 'Batch No.',       key: 'batch' },
  { label: 'Manufacturer',    key: 'mfr' },
  { label: 'Expiry',          fn: m => fmtExpiry(m.expiry) },
  { label: 'Days Left',       fn: m => getDaysLeft(m.expiry) },
  { label: 'Status',          fn: m => getStatus(getDaysLeft(m.expiry)) },
  { label: 'Quantity',        key: 'qty' },
  { label: 'Unit Price (₹)',  key: 'price' },
  { label: 'Location',        key: 'location' },
  { label: 'Notes',           key: 'notes' },
];

/**
 * Show sidebar badge if there are alerts.
 */
function updateAlertBadge() {
  const settings = DB.getSettings();
  const badge = document.getElementById('alertBadge');
  if (!badge) return;
  const count = DB.getMedicines().filter(m => {
    const d = getDaysLeft(m.expiry);
    return d < 0 || d <= settings.warnDays;
  }).length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

/**
 * Update pharmacy name in sidebar footer.
 */
function updateSidebarPharmacy() {
  const el = document.getElementById('sidebarPharmacyName');
  if (el) el.textContent = DB.getSettings().pharmacyName || 'My Pharmacy';
}
