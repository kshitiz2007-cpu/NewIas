-- NewIAS content management foundation.
-- Intended for the NEW, empty NewIAS Supabase project after migrations 0001 and 0002.
-- Review and test in staging before production. This migration does not insert content.

-- Keep a durable audit trail for editorial lifecycle actions.
alter table public.content_items
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists published_by uuid references public.profiles(id) on delete set null,
  add column if not exists version_number integer not null default 1 check (version_number > 0),
  add column if not exists visibility text not null default 'enrolled'
    check (visibility in ('public','enrolled','staff_only')),
  add column if not exists review_notes text;

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  title text not null,
  summary text,
  body jsonb,
  metadata_snapshot jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  change_note text,
  unique (content_item_id, version_number)
);
create index if not exists content_versions_item_idx
  on public.content_versions(institute_id, content_item_id, version_number desc);

create table if not exists public.content_assets (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references public.institutes(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  asset_kind text not null check (asset_kind in ('cover','attachment','pdf','image','video','audio','supplement')),
  storage_bucket text not null default 'newias-content',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  checksum_sha256 text,
  display_order integer not null default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);
create index if not exists content_assets_item_idx
  on public.content_assets(institute_id, content_item_id, display_order);

-- Useful for editorial queues and library sorting at scale.
create index if not exists content_draft_queue_idx
  on public.content_items(institute_id, status, updated_at desc);
create index if not exists content_published_browse_idx
  on public.content_items(institute_id, published_at desc, display_order)
  where status = 'published';

alter table public.content_versions enable row level security;
alter table public.content_assets enable row level security;

create policy "staff read content versions" on public.content_versions
for select to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor','reviewer','faculty']));

create policy "staff create content versions" on public.content_versions
for insert to authenticated
with check (
  public.has_institute_role(institute_id, array['admin','content_editor','reviewer'])
  and (created_by is null or created_by = auth.uid())
);

create policy "staff read content assets" on public.content_assets
for select to authenticated
using (
  public.has_institute_role(institute_id, array['admin','content_editor','reviewer','faculty'])
  or exists (
    select 1 from public.content_items c
    where c.id = content_assets.content_item_id
      and c.institute_id = content_assets.institute_id
      and c.status = 'published'
      and c.visibility = 'public'
  )
);

create policy "editors add content assets" on public.content_assets
for insert to authenticated
with check (
  public.has_institute_role(institute_id, array['admin','content_editor'])
  and (uploaded_by is null or uploaded_by = auth.uid())
);

create policy "editors update content assets" on public.content_assets
for update to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor']))
with check (public.has_institute_role(institute_id, array['admin','content_editor']));

create policy "editors delete content assets" on public.content_assets
for delete to authenticated
using (public.has_institute_role(institute_id, array['admin','content_editor']));

-- Private bucket: application should upload under {institute_id}/{content_item_id}/...
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'newias-content',
  'newias-content',
  false,
  52428800,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'audio/mpeg'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "institute editors upload content files" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'newias-content'
  and (storage.foldername(name))[1] is not null
  and public.has_institute_role(
    ((storage.foldername(name))[1])::uuid,
    array['admin','content_editor']
  )
);

create policy "institute members read permitted content files" on storage.objects
for select to authenticated
using (
  bucket_id = 'newias-content'
  and (
    public.has_institute_role(
      ((storage.foldername(name))[1])::uuid,
      array['admin','content_editor','reviewer','faculty']
    )
    or exists (
      select 1
      from public.content_assets a
      join public.content_items c
        on c.id = a.content_item_id and c.institute_id = a.institute_id
      where a.storage_bucket = storage.objects.bucket_id
        and a.storage_path = storage.objects.name
        and c.status = 'published'
        and c.visibility = 'public'
    )
  )
);

create policy "institute editors update content files" on storage.objects
for update to authenticated
using (
  bucket_id = 'newias-content'
  and public.has_institute_role(
    ((storage.foldername(name))[1])::uuid,
    array['admin','content_editor']
  )
)
with check (
  bucket_id = 'newias-content'
  and public.has_institute_role(
    ((storage.foldername(name))[1])::uuid,
    array['admin','content_editor']
  )
);

create policy "institute editors delete content files" on storage.objects
for delete to authenticated
using (
  bucket_id = 'newias-content'
  and public.has_institute_role(
    ((storage.foldername(name))[1])::uuid,
    array['admin','content_editor']
  )
);

-- Security note: private/enrolled assets should be delivered through short-lived
-- signed URLs after the app verifies membership/enrolment. Public bucket access
-- is intentionally disabled. Add content publishing RPCs and composite tenant
-- integrity constraints before production rollout.
