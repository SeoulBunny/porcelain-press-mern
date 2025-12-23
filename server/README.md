# Porcelain Press (Server)

Fake MERN-style API using Node/Express with in-memory data loaded from `server/data/*.js`.
Edits are NOT persisted (restart resets to the dummy data).

## Run
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server runs at http://localhost:5000
Uploads are stored in `server/uploads/` and served at `/uploads/...`
