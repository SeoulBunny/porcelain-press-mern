# Porcelain Press — MERN-style starter (React/Vite + Tailwind, Node/Express)

This is a **complete working demo** that matches your spec:
- React + Vite + Tailwind (NO TypeScript)
- Node/Express API (fake MERN style: in-memory data loaded from `server/data`)
- Pages: Home (interactive hero + site-wide search), Journals (list + detail + in-page PDF),
  Articles (list + detail + in-page PDF), About, Login
- Role-based access: **user / writer / editor / administrator**
- Admin dashboard: editors/admins can edit/delete content and manage submissions
- Submit Work page: writers upload a PDF + metadata, saved in `server/uploads/submissions`
- Writers can edit their own published items via **My work** page (`/my-work`)

> Security note: auth is demo-only (plaintext passwords + JWT). Replace before production.

---

## Quick start

### 1) Install
```bash
npm install
npm run install:all
```

### 2) Run both client + server
```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

### 3) Demo logins
- user@demo.com / user1234
- writer@demo.com / writer1234
- editor@demo.com / editor1234
- admin@demo.com / admin1234

---

## Where the dummy data lives
- `server/data/users.js`
- `server/data/journals.js` (5 journals)
- `server/data/articles.js` (10 articles)

PDF placeholders are in:
- `server/uploads/pdfs/`

Uploads go to:
- `server/uploads/submissions/`

---

## How to “make it real MERN”
- Add MongoDB + Mongoose models (User, Journal, Article, Submission)
- Replace in-memory arrays with DB reads/writes
- Hash passwords (bcrypt) + refresh token flow
- Store uploads in S3/GCS (or GridFS) instead of local disk
