# NewIAS Architecture

## Web feature boundaries
- Student: overview, study plan, classes, tests, library, performance, notifications and profile.
- Administration: overview, content studio, classes, tests/question bank, students, batches, courses, analytics, audit log and settings.
- Faculty: a separate protected experience for assigned classes, resources and batch progress.
- Mobile: Expo/React Native client with shared domain types, schemas and API contracts.

## Route map
Student:
- `/`, `/study-plan`
- `/classes`, `/classes/:classId`, `/recordings/:recordingId`
- `/tests`, `/tests/:testId`, `/attempts/:attemptId`, `/attempts/:attemptId/review`
- `/library`, `/library/:collectionSlug`, `/resources/:resourceId`
- `/performance`, `/performance/subject/:subjectId`, `/performance/tests/:testId`
- `/notifications`, `/profile`

Administration:
- `/admin`
- `/admin/content`, `/admin/content/new`, `/admin/content/:contentId/edit`
- `/admin/classes`, `/admin/classes/new`, `/admin/classes/:classId/edit`
- `/admin/tests`, `/admin/tests/new`, `/admin/tests/:testId/questions`
- `/admin/students`, `/admin/students/:studentId`
- `/admin/batches`, `/admin/courses`, `/admin/analytics`, `/admin/audit-log`, `/admin/settings`

Use route-level lazy loading, stable deep links, reusable nested layouts, error boundaries and explicit loading/empty/error states. Route guards improve UX but are not a security boundary.

## Database domains
Identity: institutes, profiles, memberships.
Academics: courses, batches, enrolments, subjects, topics.
Content: content items, version snapshots, private file assets, exam tracks, subjects, hierarchical topics/subtopics and many-to-many resource-topic links. Each resource carries filterable metadata (format, language, paper, difficulty, date, source, syllabus codes, tags, estimated study time, display order and optional parent resource).
Classes: class sessions, provider metadata, recordings and attendance.
Assessment: tests, sections, questions, options, attempts, answers and results.
Analytics: activity events and performance snapshots.
Operations: notifications and audit events.

Every tenant-owned record should be scoped by institute ID or a verified parent relationship. Index common lookup/filter columns and test isolation between institutes.

## Metadata-first content organisation
- Treat taxonomy as structured records, not subject/topic text typed into each resource. The database is the source of truth; web and Android clients must fetch it rather than maintain separate hardcoded taxonomies.
- Browse hierarchy: exam track → paper → subject → topic → subtopic; allow a resource to be linked to multiple topics while retaining one primary topic.
- Store metadata as typed columns for common filters and a JSONB extension field only for evolving, non-critical attributes.
- Make search/filter/sort server-side and paginated once real content is connected; never load an entire large library into the browser.
- Show the same resource through relevant topic collections without duplicating the resource record.
- Use stable resource IDs and deep links so rearranging taxonomy does not break bookmarks.
- Require metadata validation on publish and offer explicit “Uncategorised” review queues for incomplete records.

## Empty-database bootstrap sequence
1. Create a dedicated Supabase project for NewIAS.
2. Apply migrations in order: `0001_initial_schema.sql`, `0002_content_taxonomy_metadata.sql`, `0003_content_management_foundation.sql`.
3. Create the first Auth user and provision the first institute/admin membership through a controlled one-time bootstrap procedure. Do not expose a service-role key in the client.
4. Sign in as the provisioned admin; create exam tracks, subjects, topics and subtopics through the admin UI.
5. Create resources, attach metadata/files, save drafts, review and publish through the app.
6. Verify RLS with separate admin, editor, reviewer, faculty and student accounts before using real learners.

The migrations establish schema and policies only. They intentionally do not seed real content or pretend that an empty database already contains a taxonomy.

## Class provider adapters
Keep provider-specific configuration separate from canonical class metadata. Support YouTube embed/playback where permitted, Zoom and Google Meet join/SDK/OAuth flows where needed, external URLs and uploaded recordings. Validate provider links and access on the server. Provide a safe open/join fallback for providers that do not permit embedding.

## Test integrity
- Verify enrolment, test window, attempt limit and deadline on the server.
- Store answers and timestamps durably; make autosave and timeout submission idempotent.
- Calculate marks on trusted server/database code.
- Keep answer keys unavailable until the configured review window.
- Preserve question/order snapshots for historical attempts.

## 360-degree performance
Derive accuracy, attempt/skip rate, time per question, topic mastery, progress trend, consistency and syllabus coverage from stored activity and attempt records. Recommendations must be explainable and tied to evidence. Do not show invented/demo metrics as real results.

## Security
- Enable and test RLS on all user and tenant-owned tables.
- Keep service-role credentials server-side.
- Use signed URLs for private files.
- Audit publishing, role changes, answer-key edits and result overrides.
- Rate-limit login, submission and expensive workflows.
- Define data export, retention and deletion processes before launch.
