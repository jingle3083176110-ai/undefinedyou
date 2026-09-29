create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  descriptions text[] not null default '{}',
  year text not null default '',
  preview_url text not null default '',
  code_url text not null default '',
  thumbnail_url text not null default '',
  images text[] not null default '{}',
  technologies text[] not null default '{}',
  categories integer[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  term_id text not null,
  term_year text not null default '',
  term_name text not null default '',
  term_name_zh text not null default '',
  institution text not null default '',
  instructor text not null default '',
  description text not null default '',
  notes_url text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  entry_date date,
  title text not null,
  photo_url text not null default '',
  short_note text not null default '',
  location text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photo_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  collection_type text not null check (collection_type in ('theme', 'workshop')),
  title text not null,
  title_zh text not null default '',
  intro text not null default '',
  intro_zh text not null default '',
  date_range text not null default '',
  location text not null default '',
  location_zh text not null default '',
  cover_photo_id text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photos (
  id text primary key,
  storage_path text not null,
  alt text not null default '',
  photo_date date,
  location text not null default '',
  location_zh text not null default '',
  note text not null default '',
  note_zh text not null default '',
  aspect text not null default 'landscape' check (aspect in ('portrait', 'landscape', 'square')),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists collection_photos (
  collection_id uuid not null references photo_collections(id) on delete cascade,
  photo_id text not null references photos(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, photo_id)
);

create index if not exists projects_published_idx on projects (published);
create index if not exists courses_term_id_idx on courses (term_id);
create index if not exists courses_published_idx on courses (published);
create index if not exists journal_entries_published_date_idx on journal_entries (published, entry_date desc);
create index if not exists photo_collections_type_idx on photo_collections (collection_type);
create index if not exists photos_published_date_idx on photos (published, photo_date desc);
create index if not exists collection_photos_order_idx on collection_photos (collection_id, sort_order);

alter table projects enable row level security;
alter table courses enable row level security;
alter table journal_entries enable row level security;
alter table photo_collections enable row level security;
alter table photos enable row level security;
alter table collection_photos enable row level security;

create policy "Public can read published projects" on projects for select to anon, authenticated using (published = true);
create policy "Public can read published courses" on courses for select to anon, authenticated using (published = true);
create policy "Public can read published journal entries" on journal_entries for select to anon, authenticated using (published = true);
create policy "Public can read published photo collections" on photo_collections for select to anon, authenticated using (published = true);
create policy "Public can read published photos" on photos for select to anon, authenticated using (published = true);
create policy "Public can read published collection photos" on collection_photos for select to anon, authenticated using (
  exists (select 1 from photo_collections c where c.id = collection_id and c.published = true)
  and exists (select 1 from photos p where p.id = photo_id and p.published = true)
);
