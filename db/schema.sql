-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- RESUMES TABLE
create table if not exists resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null, -- User ID (Supabase Auth UUID or demo-user string)
  title text not null,
  template_id text not null,
  sections jsonb not null default '[]'::jsonb, -- Contains all resume sections including contact with photo
  job_description text, -- Target JD for tailoring
  ats_score integer, -- Cached ATS score (0-100)
  jd_match_score integer, -- JD match percentage (0-100)
  is_ai_generated boolean default false, -- Flag if resume was AI-generated
  version integer default 1, -- Version number for history tracking
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEX for faster user queries
create index if not exists resumes_user_id_idx on resumes(user_id);
create index if not exists resumes_created_at_idx on resumes(created_at desc);
create index if not exists resumes_template_id_idx on resumes(template_id);

-- COVER LETTERS TABLE (Optional - for saving generated cover letters)
create table if not exists cover_letters (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references resumes(id) on delete cascade,
  user_id text not null,
  content text not null,
  job_description text,
  company_name text,
  role_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists cover_letters_resume_id_idx on cover_letters(resume_id);
create index if not exists cover_letters_user_id_idx on cover_letters(user_id);

-- TEMPLATES TABLE (Optional if hardcoded, but good to have for custom templates)
create table if not exists templates (
  id text primary key,
  name text not null,
  description text,
  category text not null,
  layout text not null default 'single-column',
  has_photo boolean default false,
  is_premium boolean default false,
  colors jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER PROFILES TABLE (for storing user preferences and saved info)
create table if not exists user_profiles (
  id text primary key, -- Same as auth.uid() or demo-user string
  email text,
  full_name text,
  phone text,
  location text,
  linkedin text,
  github text,
  portfolio text,
  photo_url text, -- Default profile photo
  default_template_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JD ANALYSIS CACHE (Optional - to avoid re-analyzing same JDs)
create table if not exists jd_analysis_cache (
  id uuid default uuid_generate_v4() primary key,
  jd_hash text unique not null, -- MD5 hash of JD text
  analysis jsonb not null, -- Cached analysis result
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists jd_analysis_hash_idx on jd_analysis_cache(jd_hash);

-- RLS POLICIES (Row Level Security) - Only if using Supabase Auth
-- Commented out for flexibility with demo users

-- alter table resumes enable row level security;
-- 
-- create policy "Users can view their own resumes"
--   on resumes for select
--   using (auth.uid()::text = user_id);
-- 
-- create policy "Users can insert their own resumes"
--   on resumes for insert
--   with check (auth.uid()::text = user_id);
-- 
-- create policy "Users can update their own resumes"
--   on resumes for update
--   using (auth.uid()::text = user_id);
-- 
-- create policy "Users can delete their own resumes"
--   on resumes for delete
--   using (auth.uid()::text = user_id);

-- Function to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at on resumes
drop trigger if exists update_resumes_updated_at on resumes;
create trigger update_resumes_updated_at
  before update on resumes
  for each row
  execute function update_updated_at_column();

-- Trigger to auto-update updated_at on user_profiles
drop trigger if exists update_user_profiles_updated_at on user_profiles;
create trigger update_user_profiles_updated_at
  before update on user_profiles
  for each row
  execute function update_updated_at_column();
