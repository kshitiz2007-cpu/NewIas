# NewIAS Implementation Roadmap

## Phase 0 — Web foundation
- [x] Create React/Vite/TypeScript entry point and responsive route shell.
- [x] Add project setup documentation and proposed initial schema.
- [ ] Install dependencies and run typecheck/build.
- [ ] Add linting, unit tests and CI.
- [ ] Verify direct route loads and responsive navigation.

Acceptance: clean install, typecheck and production build pass; no credentials in source.

## Phase 1 — Fresh backend and identity
- Create a dedicated new Supabase project.
- Review and apply versioned migrations.
- Implement sign-in, profiles, institute membership and staff roles.
- Enable RLS and add negative permission tests.

Acceptance: users cannot access other users' records; staff access is scoped to authorised institute data.

## Phase 2 — Content studio and library
- Taxonomy by exam, subject, topic, language and format.
- Upload assets, metadata, versions, drafts, review and publishing.
- Search, filtering, pagination and stable resource routes.
- Private file access and download metadata.

Acceptance: only published and entitled resources are visible; file access is protected.

## Phase 3 — Classes
- Schedule sessions and implement provider adapters.
- YouTube playback where allowed; secure Zoom/Meet joining.
- Recordings, reminders and attendance hooks.

Acceptance: links and playback work across supported devices; access follows enrolment.

## Phase 4 — Mock tests
- Question authoring/import and review.
- Test blueprint, sections, timing, marks and negative marking.
- Server-authoritative attempts, autosave, timeout and scoring.
- Controlled answer review.

Acceptance: no client-controlled score/deadline; attempts persist; answer keys stay protected.

## Phase 5 — Performance portal
- Student and faculty analytics.
- Subject/topic drilldowns, trend, accuracy, speed and consistency.
- Evidence-linked revision recommendations.

Acceptance: analytics reconcile with stored attempts; empty states are honest and access-controlled.

## Phase 6 — Administration
- Students, batches, courses and faculty assignments.
- Publishing calendar, audit log, notifications and operational reports.

Acceptance: permissions are tested and privileged actions are audited.

## Phase 7 — Android
- Add Expo/React Native client.
- Reuse domain schemas and API packages.
- Add class joining, tests, library downloads and offline/sync behavior.

Acceptance: Android build installs and core flows pass on a physical device.

## Phase 8 — Release hardening
- Accessibility, responsive QA, performance profiling, backups and monitoring.
- Security review and documented rollback process.

Acceptance: staging sign-off, no critical security issues and tested restore/rollback procedures.

Payments are excluded from the initial delivery scope.
