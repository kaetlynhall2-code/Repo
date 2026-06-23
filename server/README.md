# Phase 2: DB integration + JWT auth

This branch adds a Prisma-based SQLite DB for local development and a JWT-based auth scaffold.

Key points:
- Prisma schema (server/prisma/schema.prisma) uses sqlite by default for easy local testing.
- server/src/routes/auth.js provides /api/auth/signup and /api/auth/login endpoints and returns JWT tokens.
- server/src/routes/chat.js persists chats/messages to the database when a valid JWT is provided.
- Frontend pages for Login and Signup were added at src/pages/Login.tsx and src/pages/Signup.tsx
- ChatInterface now includes Authorization header when a JWT is present in localStorage.

Local dev instructions:
1. Checkout branch codex/012-backend-db
2. Install dependencies (root and server)
3. cd server && npx prisma generate && npx prisma migrate dev --name init
4. Start server: cd server && npm run dev
5. Start frontend: npm run dev

ENV:
- Create a .env file at repository root with values (see .env.example). For sqlite local dev you can omit DATABASE_URL and prisma will use file:./dev.db

Security:
- Do not commit real secrets. Use environment variables for OPENAI_API_KEY and JWT_SECRET.
