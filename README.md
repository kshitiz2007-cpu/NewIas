# NewIAS — Civil Services Learning Platform

A new, independently developed full-stack learning platform for civil-services preparation.

## Stack
- React + Vite + TypeScript for the web application
- React Router for nested/deep-linkable routes
- Tailwind CSS v4 and a reusable responsive design system
- TanStack Query for server-state management
- Zod for runtime validation contracts
- Supabase Auth, PostgreSQL, Storage and Row Level Security for the backend
- Expo + React Native planned as a separate native Android client sharing domain/API packages

## Current state
The repository contains the initial web shell, responsive dashboard, student/admin route placeholders, strict TypeScript configuration, architecture notes and a proposed database migration. It is **not yet a production-ready full-stack application**: authentication, persistent content, class providers, mock-test scoring and real analytics still need implementation and verification. Dashboard numbers are labelled illustrative.

## Run locally
```bash
npm install
npm run dev
```

Before deployment:
```bash
npm run typecheck
npm run build
```

The repository has not yet been built in a local environment, so build success is not claimed.

## Environment
Copy `.env.example` to `.env.local` and add credentials for a dedicated new Supabase project. Never expose the Supabase service-role key in frontend variables or client bundles.

## Product modules
1. Student dashboard and study planner
2. Live/recorded class studio with provider adapters for YouTube, Zoom, Google Meet and uploaded video
3. Mock-test engine with server-authoritative timing, scoring and answer-key protection
4. Digital library with taxonomy, document storage, search and access control
5. 360-degree performance analytics from verified activity and test results
6. Admin content studio with draft/review/publish/version history
7. Student, batch, course and faculty management
8. Notifications, audit logs and operational reporting
9. Expo Android app with offline library support

## Safety and delivery rules
- Use a dedicated, newly created database for this project.
- Review migrations and RLS policies before applying them.
- Enforce permissions in the database/server, not only in UI navigation.
- Keep answer keys and scoring logic on trusted server-side code.
- Never seed real student information.
- Payments and subscriptions are not included in the initial implementation.
- Zoom and Meet should use supported join or SDK workflows; do not assume all meetings can be embedded.

See `docs/architecture.md` and `docs/roadmap.md`.

## Authentication and role separation

The web app now uses Supabase Auth for email/password sign-in and sign-up. The authenticated email `kshitiz2007@gmail.com` is treated as the admin account; every other authenticated email receives the student workspace. Admin navigation is hidden from students and admin routes redirect non-admin users to the student home.

### Required Render environment variables

In **Render → NewIAS Web Service → Environment**, set:

- `VITE_SUPABASE_URL` — the Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — the Supabase publishable/anon key (never a service-role key)

Then trigger a new deploy. Vite environment variables are embedded at build time, so a redeploy is required after changing them. In Supabase Auth settings, configure the site URL and allowed redirect URLs for the deployed NewIAS domain. Enable email confirmation if desired.

### Create the admin account

1. Configure the two environment variables and redeploy.
2. In **Supabase Dashboard → Authentication → Users**, invite or create `kshitiz2007@gmail.com` as the administrator account. Do not create the reserved admin account through public sign-up.
3. Set a strong password / complete the invite and sign in through the NewIAS auth screen.
4. Other email addresses can sign up through the app and will only receive student navigation/routes.

### Security boundary

The email-based UI role gate separates the current frontend experience; it is **not a substitute for backend authorization**. Before storing or exposing real admin-managed data, enforce permissions with Supabase Row Level Security policies and/or server-side authorization. Never use a client-side email check alone to protect database rows, storage objects, or privileged operations. The frontend must only use the Supabase anon/publishable key.
