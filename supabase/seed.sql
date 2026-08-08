-- DEMO DATA ONLY.
-- Use for local development and manual verification after running the initial schema.

do $$
declare
  demo_project_id uuid;
begin
  insert into public.projects (
    project_code,
    title,
    project_type,
    location,
    customer_name,
    start_date,
    estimated_completion,
    current_stage,
    progress,
    public_note
  )
  values (
    'ERD-24018',
    'Villa Yenileme',
    'Konut Yenileme',
    'İstanbul / Ataşehir',
    'Demo Müşteri',
    '2026-08-12',
    '2026-10-30',
    'implementation',
    64,
    'Uygulama ekibi sahada çalışmaya devam ediyor. Bir sonraki aşama son kontroller olacak.'
  )
  on conflict (project_code) do update
  set
    title = excluded.title,
    project_type = excluded.project_type,
    location = excluded.location,
    customer_name = excluded.customer_name,
    start_date = excluded.start_date,
    estimated_completion = excluded.estimated_completion,
    current_stage = excluded.current_stage,
    progress = excluded.progress,
    public_note = excluded.public_note
  returning id into demo_project_id;

  delete from public.project_updates where project_id = demo_project_id;

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
      demo_project_id,
      'pre_meeting',
      'Ön Görüşme',
      'İhtiyaçlar ve mekanın mevcut durumu değerlendirildi.',
      true,
      '2026-08-12 10:00:00+03',
      1
    ),
    (
      demo_project_id,
      'design',
      'Tasarım',
      'Plan, malzeme ve ana uygulama kararları hazırlandı.',
      true,
      '2026-08-20 16:00:00+03',
      2
    ),
    (
      demo_project_id,
      'approval',
      'Onay',
      'Tasarım kapsamı müşteriyle netleştirildi.',
      true,
      '2026-08-25 14:00:00+03',
      3
    ),
    (
      demo_project_id,
      'preparation',
      'Uygulama Hazırlığı',
      'Malzeme ve saha planlaması tamamlandı.',
      true,
      '2026-09-01 09:30:00+03',
      4
    ),
    (
      demo_project_id,
      'implementation',
      'Uygulama',
      'Uygulama devam ediyor.',
      false,
      null,
      5
    ),
    (
      demo_project_id,
      'final_checks',
      'Son Kontroller',
      'Uygulama tamamlandığında detay ve kalite kontrolleri yapılacak.',
      false,
      null,
      6
    ),
    (
      demo_project_id,
      'ready',
      'Teslime Hazır',
      'Son kontrollerin ardından proje teslim için hazır olacak.',
      false,
      null,
      7
    );
end $$;
