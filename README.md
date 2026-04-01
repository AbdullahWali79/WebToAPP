# WebToAPP

Convert a website URL into an Android APK wrapper workflow starter.

This project is a **full-stack Next.js starter** that includes:
- marketing landing page
- dashboard with demo project
- create project flow
- build status tracking
- mock API routes
- build simulation queue

## Important architecture note

- The frontend can be hosted on Vercel.
- The backend stores project and build state.
- Real APK generation must run on a separate Android-capable build worker (CI, Docker host, VPS, or GitHub Actions runner).
- This starter includes a simulation mode for build jobs and does not claim Vercel builds APKs directly.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment notes

1. Deploy Next.js frontend/API to Vercel (or another Node host).
2. Replace `src/lib/mock-db.ts` with a real database layer (Supabase/Firebase/Postgres).
3. Replace local upload placeholders with cloud object storage (S3, Supabase Storage, etc.).
4. Implement a real build worker:
   - receive build job payload
   - generate Android wrapper (WebView/Capacitor template)
   - sign APK
   - upload APK and source ZIP
   - callback/update build status in backend
5. Secure API with authentication and per-user access controls.
