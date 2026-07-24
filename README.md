# 🔐 PaSS-MaN - Zero-Knowledge Developer Vault Suite

<div align="center">

![Security](https://img.shields.io/badge/Security-AES--256--GCM-00d4a4?style=for-the-badge&logo=shield&logoColor=black)
![Architecture](https://img.shields.io/badge/Architecture-Zero--Knowledge%20Client--Side-0a0a0a?style=for-the-badge&logo=lock&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Design](https://img.shields.io/badge/Design-Mintlify%20Dark-00d4a4?style=for-the-badge&logo=tailwindcss&logoColor=black)

*Zero-Knowledge • Client-Side AES-256-GCM • Mintlify Dark Design System*

[🚀 Launch Live Vault](https://bhagirathsinhrana378.github.io/PaSS---MaN/)

</div>

---

## 🌟 Overview

**PaSS-MaN** (Password & Secret Manager) is an open-source, browser-native **Zero-Knowledge Developer Vault** built for maximum privacy, speed, and aesthetic excellence. Designed around the **Mintlify Dark System** (`#0a0a0a` canvas, `#00d4a4` mint green accents, and `Geist Mono` typography), PaSS-MaN allows you to store logins, custom text notes, credit cards, Wi-Fi keys, and API secrets entirely on your local machine with military-grade client-side encryption.

---

## 🚀 Key Features & Capabilities

### 🔐 1. Client-Side AES-256-GCM Encryption
- **Native Web Crypto API**: Sensitive fields (passwords, notes, card numbers, API keys) are encrypted in your browser before touching local storage.
- **PBKDF2 Key Derivation**: Uses 100,000 hashing rounds on your Master Passphrase to derive a 256-bit key.
- **Authenticated Encryption (GCM)**: Detects and rejects any local file tampering or unauthorized modification.

### 🗂️ 2. Flexible Multi-Type Vault
- **Logins & Passwords**: Non-compulsory password fields (save usernames or URLs independently).
- **Secure Text Notes**: Multi-line textarea for recovery phrases, code snippets, and private keys.
- **Payment Cards**: Cardholder name, card number, expiry, and CVV protection.
- **Wi-Fi Credentials**: Network SSID and security passphrase tracking.
- **API Keys & Tokens**: Secret key value storage with instant copy actions.

### 🛡️ 3. Security Audit & Vault Health
- Real-time vault scanning engine that identifies weak passwords (`< 8` characters), missing security parameters, and reused credentials.
- Instant visual health score (`0-100%`) with actionable recommendation alerts.

### ⚡ 4. Developer Tools & Ergonomics
- **Custom Password Generator**: Customizable length (`4-64` chars), uppercase, lowercase, numbers, and special symbols.
- **Backup & Sync**: Export encrypted/decrypted JSON backups and import data with merge or replace modes.
- **Master Security PIN Lock**: Set a local numeric PIN code to lock your vault during inactivity.
- **Auto-Clearing Clipboard**: Automatically wipes copied secrets from the system clipboard after 30 seconds.
- **Keyboard Shortcuts**: `Ctrl + K` (Focus Search HUD) and `Ctrl + N` (Jump to Form).

---

## 🎨 Design System (Mintlify Dark)

Built according to the official **Mintlify Design Specification**:
- **Canvas Dark**: `#0a0a0a`
- **Surface Cards**: `#141416` & `#1c1c1e` with `#1f1f1f` hairline borders
- **Signature Mint Accent**: `#00d4a4` pill buttons (`rounded-full`) & active state indicators
- **Typography**: **Inter** for headings & UI prose; **Geist Mono** for code blocks, passwords, and secret tokens

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Core Framework** | React 19.x | Component-driven user interface |
| **Build System** | Vite 7.x | Fast HMR & production bundle compiler |
| **Cryptography** | Web Crypto API | Client-side AES-256-GCM + PBKDF2 |
| **Styling** | Tailwind CSS v4 | Mintlify utility design system |
| **Icons** | Custom SVG Icons | High-contrast vector icon library |
| **Notifications** | React-Toastify | Responsive toast notification feedback |

---

## ⚡ Quick Start

### Prerequisites
- Node.js (`v18.x` or higher)
- npm package manager

### 1. Clone & Install
```bash
# Clone repository
git clone https://github.com/BhagirathsinhRana378/PaSS---MaN.git

# Navigate to project directory
cd PaSS---MaN

# Install dependencies
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Production Build & Deployment
```bash
# Compile production bundle
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📁 Repository Structure

```
PaSS---MaN/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── ExportImportModal.jsx     # JSON Backup & Restore Modal
│   │   ├── FOOTER.jsx                # Mintlify Footer Component
│   │   ├── Icons.jsx                 # SVG Icon Set
│   │   ├── MANAGER.jsx               # Main Vault Workspace & Form
│   │   ├── MasterLockModal.jsx       # PIN Lock Modal
│   │   ├── nav_bar.jsx               # Sticky Top Navigation Bar
│   │   ├── PasswordGeneratorModal.jsx # Password Generator Modal
│   │   └── VaultAuditModal.jsx       # Security Health Scan Modal
│   ├── 📁 utils/
│   │   └── crypto.js                 # Web Crypto AES-256-GCM Module
│   ├── App.jsx                       # Root Application State & Modals
│   ├── main.jsx                      # Entrypoint
│   └── index.css                     # Mintlify Dark CSS Design Tokens
├── DESIGN.md                         # Mintlify Design Specification
├── vite.config.js                    # Vite Config (base: './')
└── README.md                         # Documentation
```

---

## 🔒 Security & Privacy Policy

- **100% Local-First Data**: All vault items are stored in your browser's `localStorage`. No data is ever sent to external cloud servers.
- **Zero Knowledge Architecture**: Encryption keys are generated in memory from your passphrase using PBKDF2. If you do not enable a session key, items stay strictly in local storage.
- **GitHub Pages Ready**: Assets resolve relatively (`base: './'`) for hosted subfolder deployments.

---

## 👨‍💻 Author & Credits

**Bhagirath Singh Rana**
- GitHub: [@BhagirathsinhRana378](https://github.com/BhagirathsinhRana378)
- Live Site: [bhagirathsinhrana378.github.io/PaSS---MaN](https://bhagirathsinhrana378.github.io/PaSS---MaN/)

*Built with ❤️ using React, Vite, and the Mintlify Design System.*
