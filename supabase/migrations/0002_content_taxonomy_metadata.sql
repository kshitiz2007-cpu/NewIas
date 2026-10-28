-- NewIAS taxonomy and metadata layer.
-- Apply only after reviewing against a disposable Supabase project.
-- Existing content_items.subject/topic fields are preserved for compatibility.

create table if not exists public.exam_tracks (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (institute_id, slug),
  unique (id, institute_id)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  exam_track_id uuid references public.exam_tracks(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (institute_id, slug),
  unique (id, institute_id)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_topic_id uuid references public.topics(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  display_order integer not null default 0,
  depth smallint not null default 0 check (depth between 0 and 8),
  created_at timestamptz not null default now(),
  unique (subject_id, slug),
  unique (id, institute_id)
);

alter table public.content_items
  add column if not exists exam_track_id uuid references public.exam_tracks(id) on delete set null,
  add column if not exists subject_id uuid references public.subjects(id) on delete set null,
  add column if not exists primary_topic_id uuid references public.topics(id) on delete set null,
  add column if not exists paper_code text,
  add column if not exists difficulty text check (difficulty is null or difficulty in ('foundation','standard','advanced')),
  add column if not exists content_date date,
  add column if not exists source_name text,
  add column if not exists estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  add column if not exists syllabus_codes text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists display_order integer not null default 0,
  add column if not exists parent_content_id uuid references public.content_items(id) on delete set null;

create table if not exists public.content_item_topics (
  institute_id uuid not null references public.institutes(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  relation_type text not null default 'primary' check (relation_type in ('primary','related','prerequisite')),
  created_at timestamptz not null default now(),
  primary key (content_item_id, topic_id),
  unique (content_item_id, relation_type, topic_id)
);

create index if not exists exam_tracks_browse_idx on public.exam_tracks(institute_id, is_active, display_order);
create index if not exists subjects_browse_idx on public.subjects(institute_id, exam_track_id, display_order);
create index if not exists topics_subject_tree_idx on public.topics(institute_id, subject_id, parent_topic_id, display_order);
create index if not exists content_metadata_browse_idx on public.content_items(institute_id, status, exam_track_id, subject_id, primary_topic_id, content_type, language, content_date desc);
create index if not exists content_tags_gin_idx on public.content_items using gin(tags);
create index if not exists content_syllabus_gin_idx on public.content_items using gin(syllabus_codes);
create index if not exists content_metadata_gin_idx on public.content_items using gin(metadata);
create index if not exists content_item_topics_topic_idx on public.content_item_topics(institute_id, topic_id, relation_type);

alter table public.exam_tracks enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.content_item_topics enable row level security;

create policy "members read active exam tracks" on public.exam_tracks
for select to authenticated
using (is_active and exists (
  select 1 from public.institute_memberships m
  where m.institute_id = exam_tracks.institute_id and m.user_id = auth.uid() and m.status = 'active'
));

create policy "staff manage exam tracks" on public.exam_tracks
for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor']))
with check (public.has_institute_role(institute_id, array['admin','content_editor']));

create policy "members read subjects" on public.subjects
for select to authenticated
using (exists (
  select 1 from public.institute_memberships m
  where m.institute_id = subjects.institute_id and m.user_id = auth.uid() and m.status = 'active'
));

create policy "staff manage subjects" on public.subjects
for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));

create policy "members read topics" on public.topics
for select to authenticated
using (exists (
  select 1 from public.institute_memberships m
  where m.institute_id = topics.institute_id and m.user_id = auth.uid() and m.status = 'active'
));

create policy "staff manage topics" on public.topics
for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));

create policy "members read topics linked to visible content" on public.content_item_topics
for select to authenticated
using (exists (
  select 1 from public.content_items c
  join public.institute_memberships m on m.institute_id = c.institute_id
  where c.id = content_item_topics.content_item_id
    and m.user_id = auth.uid() and m.status = 'active'
    and (c.status = 'published' or public.has_institute_role(c.institute_id, array['admin','content_editor','reviewer']))
));

create policy "staff manage content topic links" on public.content_item_topics
for all to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']))
with check (public.has_institute_role(institute_id, array['admin','content_editor','reviewer']));

-- Tenant integrity must be checked in application writes or strengthened with
-- composite foreign keys before production. Validate topic institute/subject
-- consistency and test every RLS path in staging before publishing content.
