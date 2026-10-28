-- NewIAS initial schema proposal.
-- Review in a disposable development project before applying anywhere.
-- Uses Supabase Auth identities and institute-scoped membership.
create extension if not exists pgcrypto;

create table if not exists public.institutes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institute_memberships (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('student','faculty','content_editor','reviewer','admin')),
  status text not null default 'active' check (status in ('invited','active','suspended')),
  created_at timestamptz not null default now(),
  unique (institute_id, user_id)
);
create index if not exists memberships_user_idx on public.institute_memberships(user_id, status);
create index if not exists memberships_institute_role_idx on public.institute_memberships(institute_id, role, status);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(institute_id, slug)
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  name text not null,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('draft','active','completed','archived')),
  created_at timestamptz not null default now()
);
create index if not exists batches_institute_idx on public.batches(institute_id, status);

create table if not exists public.batch_enrollments (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  batch_id uuid not null references public.batches(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','paused','completed','withdrawn')),
  enrolled_at timestamptz not null default now(),
  unique(batch_id, student_id)
);
create index if not exists enrollment_student_idx on public.batch_enrollments(student_id, status);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  slug text not null,
  content_type text not null check (content_type in ('note','pdf','editorial','current_affairs','video','article','quiz','other')),
  language text not null default 'en',
  subject text,
  topic text,
  summary text,
  body jsonb,
  storage_path text,
  external_url text,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(institute_id, slug)
);
create index if not exists content_browse_idx on public.content_items(institute_id, status, content_type, subject);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  title text not null,
  description text,
  provider text not null check (provider in ('youtube','zoom','google_meet','external_url','uploaded_video')),
  mode text not null default 'live' check (mode in ('live','recorded','hybrid')),
  provider_reference text,
  join_url text,
  recording_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft','scheduled','live','completed','cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists class_schedule_idx on public.class_sessions(institute_id, starts_at, status);

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  duration_seconds integer not null check (duration_seconds > 0),
  total_marks numeric(8,2) not null default 0,
  negative_mark numeric(8,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','published','closed','archived')),
  opens_at timestamptz,
  closes_at timestamptz,
  answer_review_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  position integer not null check (position > 0),
  prompt jsonb not null,
  options jsonb not null,
  explanation jsonb,
  marks numeric(8,2) not null default 1,
  created_at timestamptz not null default now(),
  unique(test_id, position)
);
-- IMPORTANT: correct answers intentionally belong in a protected server-side table
-- or trusted scoring function, not in a client-readable question/options payload.

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  test_id uuid not null references public.tests(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress','submitted','timed_out','evaluated')),
  score numeric(8,2),
  created_at timestamptz not null default now()
);
create index if not exists attempts_student_idx on public.test_attempts(student_id, started_at desc);
create index if not exists attempts_test_idx on public.test_attempts(test_id, status);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.test_questions(id) on delete restrict,
  selected_answer jsonb,
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  saved_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid references public.institutes(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_institute_idx on public.audit_events(institute_id, created_at desc);

-- Security-definer membership helper avoids recursive RLS policy evaluation.
create or replace function public.has_institute_role(target_institute uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.institute_memberships m
    where m.institute_id = target_institute
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = any(allowed_roles)
  );
$$;
revoke all on function public.has_institute_role(uuid, text[]) from public;
grant execute on function public.has_institute_role(uuid, text[]) to authenticated;

alter table public.institutes enable row level security;
alter table public.profiles enable row level security;
alter table public.institute_memberships enable row level security;
alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.batch_enrollments enable row level security;
alter table public.content_items enable row level security;
alter table public.class_sessions enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.audit_events enable row level security;

create policy "members read their institutes" on public.institutes for select to authenticated
using (exists (select 1 from public.institute_memberships m where m.institute_id = id and m.user_id = auth.uid() and m.status = 'active'));

create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "members read membership in their institutes" on public.institute_memberships for select to authenticated
using (user_id = auth.uid() or public.has_institute_role(institute_id, array['admin']));

create policy "staff manage courses" on public.courses for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));
create policy "members read published courses" on public.courses for select to authenticated
using (status = 'published' and exists (select 1 from public.institute_memberships m where m.institute_id = courses.institute_id and m.user_id = auth.uid() and m.status = 'active'));

create policy "staff manage batches" on public.batches for all to authenticated
using (public.has_institute_role(institute_id, array['admin','faculty']))
with check (public.has_institute_role(institute_id, array['admin','faculty']));
create policy "enrolled students read own batch" on public.batch_enrollments for select to authenticated
using (student_id = auth.uid() or public.has_institute_role(institute_id, array['admin','faculty']));

create policy "read published or manage content" on public.content_items for select to authenticated
using ((status = 'published' and exists (select 1 from public.institute_memberships m where m.institute_id = content_items.institute_id and m.user_id = auth.uid() and m.status = 'active')) or public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));
create policy "editors manage content" on public.content_items for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));

create policy "members read scheduled classes" on public.class_sessions for select to authenticated
using (public.has_institute_role(institute_id, array['admin','faculty']) or exists (select 1 from public.batch_enrollments e where e.batch_id = class_sessions.batch_id and e.student_id = auth.uid() and e.status = 'active'));
create policy "staff manage classes" on public.class_sessions for all to authenticated
using (public.has_institute_role(institute_id, array['admin','faculty']))
with check (public.has_institute_role(institute_id, array['admin','faculty']));

create policy "members read published tests" on public.tests for select to authenticated
using ((status = 'published' and public.has_institute_role(institute_id, array['student','faculty','admin'])) or public.has_institute_role(institute_id, array['admin','faculty','reviewer']));
create policy "staff manage tests" on public.tests for all to authenticated
using (public.has_institute_role(institute_id, array['admin','faculty','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','faculty','reviewer']));
create policy "read questions for published tests" on public.test_questions for select to authenticated
using (exists (select 1 from public.tests t where t.id = test_id and t.status = 'published' and public.has_institute_role(t.institute_id, array['student','faculty','admin'])) or exists (select 1 from public.tests t where t.id = test_id and public.has_institute_role(t.institute_id, array['admin','faculty','reviewer'])));
create policy "staff manage questions" on public.test_questions for all to authenticated
using (exists (select 1 from public.tests t where t.id = test_id and public.has_institute_role(t.institute_id, array['admin','faculty','reviewer'])))
with check (exists (select 1 from public.tests t where t.id = test_id and public.has_institute_role(t.institute_id, array['admin','faculty','reviewer'])));

create policy "students read own attempts" on public.test_attempts for select to authenticated
using (student_id = auth.uid() or public.has_institute_role(institute_id, array['admin','faculty']));
create policy "students create own attempts" on public.test_attempts for insert to authenticated
with check (student_id = auth.uid() and public.has_institute_role(institute_id, array['student']));
create policy "students read own answers" on public.attempt_answers for select to authenticated
using (exists (select 1 from public.test_attempts a where a.id = attempt_id and (a.student_id = auth.uid() or public.has_institute_role(a.institute_id, array['admin','faculty']))));
create policy "students save own active answers" on public.attempt_answers for insert to authenticated
with check (exists (select 1 from public.test_attempts a where a.id = attempt_id and a.student_id = auth.uid() and a.status = 'in_progress' and now() < a.deadline_at));
create policy "students update own active answers" on public.attempt_answers for update to authenticated
using (exists (select 1 from public.test_attempts a where a.id = attempt_id and a.student_id = auth.uid() and a.status = 'in_progress' and now() < a.deadline_at))
with check (exists (select 1 from public.test_attempts a where a.id = attempt_id and a.student_id = auth.uid() and a.status = 'in_progress' and now() < a.deadline_at));

create policy "staff read audit events" on public.audit_events for select to authenticated
using (public.has_institute_role(institute_id, array['admin']));
create policy "staff insert audit events" on public.audit_events for insert to authenticated
with check (public.has_institute_role(institute_id, array['admin','reviewer','content_editor','faculty']));

-- Before production: add a protected answer-key table and trusted scoring RPC,
-- then test all policies with real authenticated roles in a disposable project.
