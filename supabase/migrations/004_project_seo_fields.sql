-- Add optional SEO fields to admin-managed projects.
-- These fields are intentionally simple: metadata text, a clean slug, and an OG image path/URL.

alter table public.projects
  add column if not exists seo_meta_title text null check (
    seo_meta_title is null or char_length(seo_meta_title) <= 160
  ),
  add column if not exists seo_meta_description text null check (
    seo_meta_description is null or char_length(seo_meta_description) <= 320
  ),
  add column if not exists seo_slug text null check (
    seo_slug is null or seo_slug ~ '^[a-z0-9-]{1,120}$'
  ),
  add column if not exists seo_og_image text null check (
    seo_og_image is null
    or (
      char_length(seo_og_image) <= 500
      and (seo_og_image like '/%' or seo_og_image ~* '^https?://')
    )
  );

create unique index if not exists projects_seo_slug_unique_idx
  on public.projects (seo_slug)
  where seo_slug is not null;

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
  p_public_note text default null,
  p_seo_meta_title text default null,
  p_seo_meta_description text default null,
  p_seo_slug text default null,
  p_seo_og_image text default null
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
        public_note,
        seo_meta_title,
        seo_meta_description,
        seo_slug,
        seo_og_image
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
        nullif(p_public_note, ''),
        nullif(p_seo_meta_title, ''),
        nullif(p_seo_meta_description, ''),
        nullif(p_seo_slug, ''),
        nullif(p_seo_og_image, '')
      )
      returning * into created_project;

      perform public.ensure_default_project_updates(created_project.id);

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
  text,
  text,
  text,
  text,
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
  text,
  text,
  text,
  text,
  text
) to service_role;
