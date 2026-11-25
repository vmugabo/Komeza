create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null
    references public.students(student_id) on delete cascade,
  created_by uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  note text not null check (length(trim(note)) > 0),
  status text not null default 'Planned'
    check (status in ('Planned', 'In progress', 'Completed', 'Follow-up needed')),
  intervention_date date not null default current_date,
  follow_up_date date,
  created_at timestamptz not null default now()
);

create index if not exists interventions_student_date_idx
  on public.interventions(student_id, intervention_date desc, created_at desc);

alter table public.interventions enable row level security;

grant select, insert on public.interventions to authenticated;

drop policy if exists "Users can read interventions for assigned students"
  on public.interventions;
create policy "Users can read interventions for assigned students"
  on public.interventions for select to authenticated
  using (
    exists (
      select 1
      from public.students
      where students.student_id = interventions.student_id
        and public.can_access_school(students.school_id)
    )
  );

drop policy if exists "Users can record interventions for assigned students"
  on public.interventions;
create policy "Users can record interventions for assigned students"
  on public.interventions for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.students
      where students.student_id = interventions.student_id
        and public.can_access_school(students.school_id)
    )
  );
