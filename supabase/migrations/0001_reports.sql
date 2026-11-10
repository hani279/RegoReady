-- Paid vehicle reports. Written and read only by the server using the
-- service role key; row level security blocks all other access.
create table if not exists public.reports (
  id uuid primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;
