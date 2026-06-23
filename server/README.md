# Phase 1: Backend chat proxy + frontend chat

This branch adds a minimal Node/Express server that provides:

- POST /api/chat — secure proxy to OpenAI Chat Completions (server must have OPENAI_API_KEY set)
- GET /api/user/1 and PATCH /api/user/1 — simple user settings persistence backed by server/db.json

How to run locally (quick):

1. Install dependencies
   - root: npm install
   - server: cd server && npm install

2. Copy .env.example to .env and set OPENAI_API_KEY and VITE_API_BASE if needed.

3. Start server (in a separate terminal)
   cd server
   npm run dev

4. Start frontend
   npm run dev

5. Open the app in the browser (Vite default port 5173). The front-end will call the server at VITE_API_BASE (default http://localhost:3002).

Notes:
- The server persists simple data to server/db.json. For production use, replace with a proper DB (Postgres + Prisma) and secure auth.
- The chat endpoint rate-limits requests. Keep OPENAI_API_KEY secure and do not expose it in the frontend.
