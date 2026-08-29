# Student Document Vault (SDV) 🚀
### *“Store Once. Verify Securely. Use Everywhere.”*

A modern, full-stack, enterprise-grade digital student document repository, verification system, secure sharing portal, and placement management application built for educational institutions and corporate recruitment.

---

## 🌟 Key Innovations & Features

1. **Centralized Digital Document Repository**:
   - Stores 10th/12th marksheets, semester grade sheets, degree certificates, internship completion letters, workshop certificates, hackathons, and multi-version resumes.
   - Categorized folder hierarchy (Academic, Certificates, Internship, Career, Other) + custom tagging (`#Java`, `#Placement`, `#SIH2025`).

2. **SHA-256 Duplicate Collision & Tamper Guard**:
   - Real-time cryptographic hashing via Web Crypto API on the client and Node `crypto` on the server.
   - Automatically blocks duplicate uploads and ensures 100% document immutability.

3. **Dynamic QR Code & Public Verification Portal**:
   - Every verified document receives an official identifier (e.g. `DOC-2026-CSE-000182`).
   - Scannable dynamic QR codes link to `/verify/:docId` with cryptographic authenticity seals without exposing private personal data.

4. **1-Click Campus Placement Integration**:
   - Integrates directly with campus recruitment drives (ABC Technologies, Zoho Corp, Google Cloud).
   - Automated document requirement matching against the student's verified vault without repeated uploads.

5. **Document Bundle Generator (Real ZIP Archives)**:
   - Packages multiple verified credentials into downloadable `.zip` archives with an official `BUNDLE_VERIFICATION_MANIFEST.txt` and cryptographic signatures.

6. **Secure Expiring Share Links & Instant Revocation**:
   - Create shareable links with custom expiration (24h, 7d, 30d), optional passcode protection, and 1-click instant access revocation.

7. **Multi-Version History**:
   - Track revisions (e.g. Resume v1.0, v2.0, v3.0) with change logs, diff notes, and automated re-verification workflows.

8. **Interactive 6-Role Persona Switcher**:
   - **Student**: Vault, Bundles, Verification Hub, Share Manager, Placement Drives, Digital Student ID, Academic Progress Charts, Emergency Contacts.
   - **Faculty**: Pending Review Queue, side-by-side evaluation, digital stamp approvals, rejection reasons.
   - **Placement Officer**: Drive creation wizard, student compliance & document completeness matrix.
   - **Recruiter**: Post hiring requirements, request candidate credentials with deadlines, verify candidate dossiers.
   - **Department Admin & Super Admin**: Department documentation metrics (CSE, ECE, IT, MECH), live system health monitor, immutable audit trail.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript, Multer, JWT, BcryptJS, Archiver, QRCode |
| **Database & ORM** | SQLite / PostgreSQL-ready, Prisma ORM with normalized schemas & indexes |
| **Cryptography** | Web Crypto API (SHA-256), Node.js `crypto` |
| **Packaging** | JSZip, FileSaver, Archiver |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# In the root directory:
npm install

# In the server directory:
cd server
npm install

# In the client directory:
cd ../client
npm install
```

### 2. Initialize Database & Seed
```bash
cd server
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 3. Run Backend & Frontend Concurrently
```bash
# From root directory:
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`
- **Public Verification Endpoint**: `http://localhost:5173/verify/DOC-2026-CSE-000182`

---

## 📂 Project Architecture

```
d:\project/
├── client/                     # Vite + React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin Dashboard, System Health & Audit
│   │   │   ├── common/         # Preview Modal, QR Modal, Receipt Modal, Upload & Share
│   │   │   ├── faculty/        # Faculty Verification Queue & Approvals
│   │   │   ├── layout/         # Navbar, Sidebar & RoleSwitcherBanner
│   │   │   ├── placement/      # Placement Officer Drive Management
│   │   │   ├── public/         # Landing Page, Public Verify & Share
│   │   │   ├── recruiter/      # Recruiter Portal & Candidate Review
│   │   │   └── student/        # Vault, Bundles, Placement, Academics, ID, Security
│   │   ├── context/            # VaultContext & Web Crypto SHA-256 Manager
│   │   ├── data/               # Seed & Mock Data
│   │   ├── types/              # Full TypeScript Interfaces
│   │   ├── App.tsx             # Root Application Router & Modals
│   │   └── main.tsx
│   └── vite.config.ts
├── server/                     # Express + TypeScript + Prisma Backend
│   ├── prisma/
│   │   └── schema.prisma       # Normalized Database Schema
│   ├── src/
│   │   ├── index.ts            # Full REST API Endpoints
│   │   └── seed.ts             # Realistic Database Seeder
│   └── tsconfig.json
└── package.json                # Root Concurrently Orchestrator
```

---

## 📜 License & Accreditation
Designed and developed for the **RTPS Project Specification** — Sri Sivasubramaniya Nadar College of Engineering.
*Store Once. Verify Securely. Use Everywhere.*
