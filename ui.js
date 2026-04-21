/**
 * ui.js — MedTrack Pro
 * Shared UI utilities: toast, sidebar toggle
 */

let _toastTimer = null;

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sb = document.getElementById('sidebar');
  const btn = document.querySelector('.mobile-menu-btn');
  if (!sb || !btn) return;
  if (sb.classList.contains('open') && !sb.contains(e.target) && e.target !== btn) {
    sb.classList.remove('open');
  }
});

// Init common elements
document.addEventListener('DOMContentLoaded', () => {
  updateAlertBadge();
  updateSidebarPharmacy();
});
