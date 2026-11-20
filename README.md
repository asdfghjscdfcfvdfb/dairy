# Milk Distribution Management System — Modern Frontend Portal

A modern, responsive, high-efficiency web application built for daily milk distribution data entry.

---

## 🥛 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Store**: Local JSON (`src/data/customers.json`) + Browser `localStorage`
- **Responsive Layout**: Mobile, Tablet, and Desktop optimized

---

## 📋 Features

### 1. Instant Customer Code Lookup
- Real-time search across **163 verified customer records** converted directly from `Book11_Sequential_No_Blank_Rows (2).xlsx`.
- Typing a valid customer code (e.g. `3805`, `3825`, `3826`, `3882`) displays the customer name immediately without needing to click search.
- Prominent **read-only** customer name field with verified status badge.
- **Directory Search Modal**: Clerks can browse and search all 163 customers by name or code with 1-click selection.
- Validates nonexistent codes with a clear *"Customer Not Found"* notice.

### 2. Password Protection & Security Simulation
- Entry quantities remain locked and protected until authorized with a password.
- **Demo Password**: `milk123` *(configurable in-app via the top settings key icon)*.
- Show/Hide password toggle (`Eye` / `EyeOff` icons).
- Visual lock indicator and manual **Lock Form** button.
- **Automatic Auto-Lock**: Changing customer code or clearing the form automatically re-locks product inputs to prevent accidental cross-entry.
- Confirmation dialog alerts user if they attempt to switch customers while unsaved quantities are entered.

### 3. Complete 19 Dairy Product Entry Form
Fields are arranged in the exact sequential order requested:
1. **TM 1000** (Toned Milk 1000 ml)
2. **TM 500** (Toned Milk 500 ml)
3. **TM 200** (Toned Milk 200 ml)
4. **PURE 500** (Pure Milk 500 ml)
5. **PURE LOOSE** (Pure Loose Milk - Litres)
6. **GOLD 500** (Gold Milk 500 ml)
7. **GOLD LOOSE** (Gold Loose Milk - Litres)
8. **TM LOOSE** (TM Loose Milk - Litres)
9. **TEA SPL 500 ML** (Tea Special 500 ml)
10. **TM 120** (Toned Milk 120 ml)
11. **SPECIAL 500** (Special Milk 500 ml)
12. **SPECIAL LOOSE** (Special Loose Milk - Litres)
13. **TM 6 LTRS** (Toned Milk 6 Litres)
14. **PM 6 LTRS** (Pure Milk 6 Litres)
15. **GM 6 LTRS** (Gold Milk 6 Litres)
16. **COW MILK** (Fresh Cow Milk)
17. **STM 125** (Standard Milk 125 ml)
18. **THICK 500** (Thick Milk 500 ml)
19. **SPECIAL 6 LTRS** (Special Milk 6 Litres)

#### Input Rules:
- Inputs start **blank** (`""`) by default and are **not** auto-filled with zero.
- Numeric-only validation with negative number prevention.
- Mobile numeric keypad support (`inputMode="decimal"`).
- Keyboard navigation: Full sequential navigation using the **Tab** key (Tab 1 → 19).
- Prominent focus ring and active background highlight on the focused card.
- Live tally: Shows count of products entered and total aggregate quantity sum.
- **Clear All**: Resets values to blank with confirmation protection modal.
- **Save Entry**: Prevents duplicate submissions and auto-resets the form for the next customer entry.

### 4. Temporary Browser Storage (`localStorage`) & Entry History
- Entries are saved to `karimnagar_milk_entries` in `localStorage`.
- Each record stores:
  - Unique Entry ID
  - Customer Code & Customer Name
  - Timestamp (Formatted Date & Time)
  - Product Quantities Breakdown
  - Total Items & Total Quantity
- **Filter Tabs**: View *"All Saved Entries"* or filter to *"Current Customer Only"*.
- **Search Bar**: Quick text search by code, store name, or date.
- **Edit Entry**: 1-click loads any previously saved record into the form for updates.
- **View Details**: Full modal showing all products and quantities.
- **Delete Record**: Single or bulk history deletion with confirmation prompts.
- **CSV Export**: Instant download of distribution records as an Excel-compatible `.csv` file.

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the URL shown in terminal) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates production-ready assets in the `dist/` directory.

---

## 📂 Project Directory Structure

```text
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Header.jsx                 # Branding, live time, status badge & demo settings
│   │   ├── CustomerLookup.jsx         # Code lookup, read-only customer name & status
│   │   ├── CustomerSearchModal.jsx    # Browse/search all 163 customers
│   │   ├── PasswordUnlock.jsx         # Password protection, show/hide toggle & auto-fill
│   │   ├── PasswordSettingsModal.jsx  # Configurable demo password modal
│   │   ├── ProductInput.jsx           # Individual product input with validation & focus
│   │   ├── ProductEntryForm.jsx       # 19-product grid, live stats & action bar
│   │   ├── EntryHistory.jsx           # LocalStorage entries list, filters & actions
│   │   ├── EntryDetailModal.jsx       # Full product quantity breakdown modal
│   │   ├── ConfirmationModal.jsx      # Confirmation dialog for dangerous actions
│   │   └── Toast.jsx                  # Notifications for save, lock, and validation
│   ├── data/
│   │   ├── customers.json             # 163 cleaned records from Excel
│   │   └── products.js                # Exact 19 products definition & initial states
│   ├── hooks/
│   │   └── useLocalStorage.js         # Reactive hook for persistent browser state
│   └── utils/
│       └── formatters.js              # Date/time formatting, calculations & CSV export
└── Book11_Sequential_No_Blank_Rows (2).xlsx # Source Excel file
```

---

## 🔌 Future Backend Integration Architecture

The codebase has been designed for simple backend integration:
- Replace `src/hooks/useLocalStorage.js` calls in `App.jsx` with API calls (`fetch` / `axios` / Supabase client).
- Customer lookup can easily transition from local `customersData` to an endpoint query (`GET /api/customers?code=...`).
- Password validation in `PasswordUnlock.jsx` will post to an authentication endpoint (`POST /api/auth/verify-entry`) returning a temporary session token.
- Entries will persist into a central relational database (e.g., PostgreSQL / Supabase) with date-wise queries and daily summary reports.
