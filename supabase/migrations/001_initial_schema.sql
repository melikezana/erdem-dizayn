-- Erdem Dizayn & Mekanik initial backend schema.
-- Public visitors must use controlled Next.js API routes, not direct table access.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text null check (phone is null or char_length(phone) <= 30),
  project_type text not null check (char_length(project_type) between 1 and 80),
  preferred_date date not null,
  preferred_time text not null check (char_length(preferred_time) between 1 and 30),
  note text null check (note is null or char_length(note) <= 1000),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')
  ),
  source text not null default 'website' check (char_length(source) <= 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  project_code text unique not null check (project_code ~ '^ERD-[0-9]{5}$'),
  title text not null check (char_length(title) between 2 and 160),
  project_type text null check (project_type is null or char_length(project_type) <= 100),
  location text null check (location is null or char_length(location) <= 160),
  customer_name text null check (customer_name is null or char_length(customer_name) <= 120),
  start_date date null,
  estimated_completion date null,
  current_stage text not null check (
    current_stage in (
      'pre_meeting',
      'design',
      'approval',
      'preparation',
      'implementation',
      'final_checks',
      'ready'
    )
  ),
  progress integer not null default 0 check (progress between 0 and 100),
  public_note text null check (public_note is null or char_length(public_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage text not null check (
    stage in (
      'pre_meeting',
      'design',
      'approval',
      'preparation',
      'implementation',
      'final_checks',
      'ready'
    )
  ),
  title text not null check (char_length(title) between 2 and 160),
  description text null check (description is null or char_length(description) <= 1000),
  completed boolean not null default false,
  completed_at timestamptz null,
  sort_order integer not null check (sort_order > 0),
  created_at timestamptz not null default now(),
  unique (project_id, sort_order)
);

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create index if not exists appointments_status_created_at_idx
  on public.appointments (status, created_at desc);

create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc);

create index if not exists projects_project_code_idx
  on public.projects (project_code);

create index if not exists projects_current_stage_idx
  on public.projects (current_stage);

create index if not exists project_updates_project_sort_idx
  on public.project_updates (project_id, sort_order);

alter table public.appointments enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;

-- No public RLS policies are created here.
-- Browser users cannot list, create, update, or delete table rows directly.
-- The website writes appointments and reads customer-facing project fields
-- through Next.js route handlers using the server-only service-role key.
-- Add narrow authenticated admin policies only after Supabase Auth roles are configured.
