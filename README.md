# 💊 MedTrack Pro — Pharmacy Medicine Expiry Tracker

A full-featured, multi-page pharmacy medicine expiry tracker. Runs 100% in the browser — no server, no login, no install required. Data is saved automatically using `localStorage`.

---

## 📁 Project Structure

```
medtrack-pro/
├── index.html          # Dashboard (overview + charts)
├── medicines.html      # Full inventory table with add/edit/delete
├── alerts.html         # Expired, expiring soon & low stock alerts
├── reports.html        # Analytics, category breakdown & CSV exports
├── settings.html       # Pharmacy profile, thresholds, backup/restore
├── css/
│   ├── style.css       # Global layout, sidebar, typography, colors
│   └── components.css  # Tables, modals, filters, badges, cards
├── js/
│   ├── db.js           # Data layer (localStorage CRUD + seed demo data)
│   ├── utils.js        # Shared helpers: date math, CSV, escape HTML
│   ├── ui.js           # Toast notifications, sidebar toggle
│   ├── dashboard.js    # Dashboard charts and summary widgets
│   ├── medicines.js    # Medicine list, add/edit modal, sort & filter
│   ├── alerts.js       # Alerts page rendering and export
│   ├── reports.js      # Reports & analytics rendering and export
│   └── settings.js     # Settings save, backup/restore, clear data
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Dashboard** | Live stats, donut chart, expiring-soon list, recently added |
| **Full inventory** | Add/edit/delete medicines with name, batch, category, manufacturer, rack location, price, quantity, notes |
| **Status tracking** | Safe / Expiring Soon / Expired with configurable thresholds |
| **Alerts page** | Dedicated view for expired, expiring soon (≤30d), and low stock (≤10 units) |
| **Reports** | Inventory value (total, expired, safe), category breakdown, value at risk |
| **4 CSV exports** | Full inventory, expired only, expiring soon, low stock |
| **JSON backup** | Full backup/restore via JSON file download/upload |
| **Settings** | Pharmacy name, pharmacist, license, warn threshold, low-stock threshold |
| **Demo data** | Auto-seeds 8 sample medicines on first load |
| **Mobile responsive** | Collapsible sidebar, fluid grid |
| **No dependencies** | Zero npm packages, zero build step |

---

## 🚀 Getting Started

### Option 1 — Open directly
Double-click `index.html` in any modern browser. Done.

### Option 2 — Serve locally (recommended for full functionality)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then open [http://localhost:8080](http://localhost:8080)

---

## 🌐 Deploy to GitHub Pages (free hosting)

1. Push this folder to a new GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Your app will be live at: `https://yourusername.github.io/medtrack-pro`

---

## 🛠 Tech Stack

- **HTML5** — semantic markup, multi-page SPA
- **CSS3** — custom properties, grid/flex, animations (zero frameworks)
- **Vanilla JavaScript** — modular JS files, no bundler needed
- **localStorage** — persistent client-side storage
- **Google Fonts** — Syne (display), DM Sans (body), DM Mono (data)

---

## 📋 Pages Overview

### 🏠 Dashboard (`index.html`)
- Stats: Total / Safe / Expiring Soon / Expired
- Donut chart with live category counts
- "Expiring in 30 days" quick-view list
- Recently added medicines table

### 💊 Medicines (`medicines.html`)
- Full searchable, filterable, sortable inventory table
- Add / Edit modal with 10 fields
- Delete with confirmation
- Filter by status and category
- Export current view as CSV

### 🔔 Alerts (`alerts.html`)
- Expired medicines (remove from shelves)
- Expiring soon (within threshold days)
- Low stock items (below threshold units)
- Export alerts as CSV

### 📋 Reports (`reports.html`)
- Total SKUs, inventory value, expired value (loss), low-stock count
- Category distribution bar chart
- Inventory value breakdown by status
- 4 export buttons (Full / Expired / Expiring Soon / Low Stock)

### ⚙️ Settings (`settings.html`)
- Pharmacy name, pharmacist, license, phone, address
- Alert threshold (days before expiry)
- Low stock threshold (units)
- Export JSON backup / Import JSON backup
- Clear all data

---

## 🤝 Contributing

Pull requests welcome! Potential improvements:
- [ ] PWA support (offline + install prompt)
- [ ] Barcode scanner via camera
- [ ] Print-friendly report layout
- [ ] Email/WhatsApp alert sharing
- [ ] Multi-branch support
- [ ] Dark/light theme toggle

---

## 📄 License

MIT — free to use, modify, and distribute.
