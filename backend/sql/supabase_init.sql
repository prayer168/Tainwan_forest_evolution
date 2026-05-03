create table if not exists public.lesson_plans (
  id bigserial primary key,
  lesson_plan_id text not null unique,
  title text not null,
  stage text not null,
  grade text not null,
  subject text not null,
  topic text not null,
  duration_minutes integer not null check (duration_minutes between 20 and 120),
  generation_mode text not null check (generation_mode in ('daily', 'deep_public')),
  locale text not null default 'zh-TW',
  script text not null default 'traditional_chinese',
  status text not null check (status in ('draft', 'completed', 'failed')),
  lesson_plan_json jsonb not null,
  quality_report_json jsonb,
  language_check_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lesson_plans_lesson_plan_id on public.lesson_plans(lesson_plan_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_lesson_plans_updated_at on public.lesson_plans;
create trigger trg_lesson_plans_updated_at
before update on public.lesson_plans
for each row execute function public.set_updated_at();
