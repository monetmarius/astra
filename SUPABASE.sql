-- ASTRA OS V6 — Supabase
-- À exécuter dans Supabase > SQL Editor.

create table if not exists public.astra_data (
    user_id uuid primary key references auth.users(id) on delete cascade,
    data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table public.astra_data enable row level security;

drop policy if exists "Users can read their own Astra data" on public.astra_data;
drop policy if exists "Users can insert their own Astra data" on public.astra_data;
drop policy if exists "Users can update their own Astra data" on public.astra_data;

create policy "Users can read their own Astra data"
on public.astra_data for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own Astra data"
on public.astra_data for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own Astra data"
on public.astra_data for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists astra_data_updated_at_idx
on public.astra_data(updated_at);
