create table if not exists public.news (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text not null default '',
  content text not null default '',
  thumbnail text not null default '',
  author text not null default '',
  views integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  "publishedAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  description text not null default '',
  "eventDate" text not null,
  location text not null default '',
  poster text not null default '',
  "createdAt" timestamptz not null default now()
);

create table if not exists public.photos (
  id text primary key,
  title text not null,
  "imageUrl" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.videos (
  id text primary key,
  title text not null,
  "youtubeUrl" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  name text not null,
  category text not null,
  "fileUrl" text not null,
  "downloadCount" integer not null default 0,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.statistics (
  key text primary key,
  label text not null,
  value text not null default ''
);

create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique
);
