-- Complete admin panel support without exposing direct public table access.
-- Existing rows are preserved; missing project timeline rows are backfilled.

alter table public.project_updates
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_project_updates_updated_at on public.project_updates;
create trigger set_project_updates_updated_at
before update on public.project_updates
for each row
execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.project_updates'::regclass
      and conname = 'project_updates_project_stage_unique'
  ) then
    alter table public.project_updates
      add constraint project_updates_project_stage_unique unique (project_id, stage);
  end if;
end $$;

create or replace function public.ensure_default_project_updates(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_updates (
    project_id,
    stage,
    title,
    description,
    completed,
    completed_at,
    sort_order
  )
  values
    (
      p_project_id,
      'pre_meeting',
      'Ön Görüşme',
      'İhtiyaçlarınız ve mekanınız değerlendiriliyor.',
      false,
      null,
      1
    ),
    (
      p_project_id,
      'design',
      'Tasarım',
      'Plan, malzeme ve mekansal kararlar hazırlanıyor.',
      false,
      null,
      2
    ),
    (
      p_project_id,
      'approval',
      'Onay',
      'Tasarım detayları sizinle birlikte netleştiriliyor.',
      false,
      null,
      3
    ),
    (
      p_project_id,
      'preparation',
      'Uygulama Hazırlığı',
      'Malzeme ve saha planlaması tamamlanıyor.',
      false,
      null,
      4
    ),
    (
      p_project_id,
      'implementation',
      'Uygulama',
      'Projeniz sahada hayata geçiriliyor.',
      false,
      null,
      5
    ),
    (
      p_project_id,
      'final_checks',
      'Son Kontroller',
      'Detaylar, kalite ve uygulama kontrolleri yapılıyor.',
      false,
      null,
      6
    ),
    (
      p_project_id,
      'ready',
      'Teslime Hazır',
      'Projeniz son dokunuşların ardından teslim için hazır.',
      false,
      null,
      7
    )
  on conflict (project_id, stage) do update
  set
    title = excluded.title,
    sort_order = excluded.sort_order;
end;
$$;

revoke execute on function public.ensure_default_project_updates(uuid)
  from public, anon, authenticated;
grant execute on function public.ensure_default_project_updates(uuid)
  to service_role;

select public.ensure_default_project_updates(id)
from public.projects;

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

comment on table public.appointments is
  'No public RLS policies. Website writes through server route handlers; admin reads and updates only after server-side Supabase Auth validation.';

comment on table public.projects is
  'No public RLS policies. Customer tracking uses a narrow server route handler DTO; admin mutations require a validated Supabase Auth session.';

comment on table public.project_updates is
  'Customer-facing project timeline rows. Direct browser access remains blocked by RLS.';
