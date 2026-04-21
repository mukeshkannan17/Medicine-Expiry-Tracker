/**
 * settings.js — MedTrack Pro
 * Settings page logic
 */

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
});

function loadSettings() {
  const s = DB.getSettings();
  document.getElementById('sPharmacyName').value = s.pharmacyName || '';
  document.getElementById('sLicense').value      = s.license      || '';
  document.getElementById('sPharmacist').value   = s.pharmacist   || '';
  document.getElementById('sPhone').value        = s.phone        || '';
  document.getElementById('sAddress').value      = s.address      || '';
  document.getElementById('sWarnDays').value     = s.warnDays     || 30;
  document.getElementById('sLowStock').value     = s.lowStockQty  || 10;
}

function saveSettings() {
  const warnDays   = parseInt(document.getElementById('sWarnDays').value) || 30;
  const lowStockQty = parseInt(document.getElementById('sLowStock').value) || 10;

  if (warnDays < 1 || warnDays > 365) {
    showToast('⚠ Warn days must be between 1 and 365.'); return;
  }
  if (lowStockQty < 1) {
    showToast('⚠ Low stock threshold must be at least 1.'); return;
  }

  DB.saveSettings({
    pharmacyName: document.getElementById('sPharmacyName').value.trim(),
    license:      document.getElementById('sLicense').value.trim(),
    pharmacist:   document.getElementById('sPharmacist').value.trim(),
    phone:        document.getElementById('sPhone').value.trim(),
    address:      document.getElementById('sAddress').value.trim(),
    warnDays,
    lowStockQty,
  });

  updateSidebarPharmacy();
  showToast('✅ Settings saved!');
}

function exportBackup() {
  const json = DB.exportBackup();
  const ts = new Date().toISOString().slice(0,10);
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  a.download = `medtrack_backup_${ts}.json`;
  a.click();
  showToast('📥 Backup exported!');
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const count = DB.importBackup(e.target.result);
      showToast(`✅ Imported ${count} medicines successfully!`);
      updateAlertBadge();
    } catch (err) {
      showToast('❌ Invalid backup file. Please use a valid MedTrack JSON export.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function clearAllData() {
  if (!confirm('Are you sure? This will permanently delete ALL medicines. This cannot be undone.')) return;
  if (!confirm('Last warning — really delete everything?')) return;
  DB.clearAll();
  updateAlertBadge();
  showToast('🗑 All data cleared.');
}
