-- Server-side project code generation for admin-created projects.
-- Project codes are generated in PostgreSQL and are never accepted as input.

alter table public.projects
  add column if not exists customer_phone text null check (
    customer_phone is null or char_length(customer_phone) <= 30
  );

update public.projects
set project_code = upper(project_code)
where project_code <> upper(project_code);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.projects'::regclass
      and conname = 'projects_project_code_uppercase_check'
  ) then
    alter table public.projects
      add constraint projects_project_code_uppercase_check
      check (project_code = upper(project_code));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_attribute a
      on a.attrelid = c.conrelid
     and a.attnum = any(c.conkey)
    where c.conrelid = 'public.projects'::regclass
      and c.contype = 'u'
      and array_length(c.conkey, 1) = 1
      and a.attname = 'project_code'
  ) then
    alter table public.projects
      add constraint projects_project_code_unique unique (project_code);
  end if;
end $$;

create table if not exists public.project_code_sequences (
  code_year integer primary key check (code_year between 2000 and 2099),
  last_number integer not null check (last_number between 0 and 999),
  updated_at timestamptz not null default now()
);

alter table public.project_code_sequences enable row level security;

revoke all on table public.project_code_sequences from anon, authenticated;

insert into public.project_code_sequences (code_year, last_number)
select
  2000 + substring(project_code from 5 for 2)::integer as code_year,
  max(substring(project_code from 7 for 3)::integer) as last_number
from public.projects
where project_code ~ '^ERD-[0-9]{5}$'
group by 1
on conflict (code_year) do update
set
  last_number = greatest(
    public.project_code_sequences.last_number,
    excluded.last_number
  ),
  updated_at = now();

create or replace function public.create_project(
  p_title text,
  p_customer_name text,
  p_customer_phone text,
  p_project_type text default null,
  p_location text default null,
  p_start_date date default null,
  p_estimated_completion date default null,
  p_current_stage text default 'pre_meeting',
  p_progress integer default 0,
  p_public_note text default null
)
returns public.projects
language plpgsql
security definer
set search_path = public
as $$
declare
  current_code_year integer := extract(
    year from timezone('Europe/Istanbul', now())
  )::integer;
  generated_code text;
  next_number integer;
  created_project public.projects%rowtype;
begin
  for attempt in 1..999 loop
    insert into public.project_code_sequences (code_year, last_number)
    values (current_code_year, 1)
    on conflict (code_year) do update
    set
      last_number = public.project_code_sequences.last_number + 1,
      updated_at = now()
    where public.project_code_sequences.last_number < 999
    returning last_number into next_number;

    if next_number is null then
      raise exception 'Annual project code sequence exhausted for %', current_code_year
        using errcode = 'P0001';
    end if;

    generated_code := upper(
      'ERD-' ||
      to_char(current_code_year % 100, 'FM00') ||
      to_char(next_number, 'FM000')
    );

    begin
      insert into public.projects (
        project_code,
        title,
        project_type,
        location,
        customer_name,
        customer_phone,
        start_date,
        estimated_completion,
        current_stage,
        progress,
        public_note
      )
      values (
        generated_code,
        p_title,
        nullif(p_project_type, ''),
        nullif(p_location, ''),
        p_customer_name,
        nullif(p_customer_phone, ''),
        p_start_date,
        p_estimated_completion,
        p_current_stage,
        p_progress,
        nullif(p_public_note, '')
      )
      returning * into created_project;

      return created_project;
    exception
      when unique_violation then
        next_number := null;
    end;
  end loop;

  raise exception 'Project code collision retry limit reached'
    using errcode = '23505';
end;
$$;

revoke execute on function public.create_project(
  text,
  text,
  text,
  text,
  text,
  date,
  date,
  text,
  integer,
  text
) from public, anon, authenticated;

grant execute on function public.create_project(
  text,
  text,
  text,
  text,
  text,
  date,
  date,
  text,
  integer,
  text
) to service_role;
