-- Global Supply 600 — orders table
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  payment_intent    text unique not null,
  email             text,
  customer_name     text,
  customer_phone    text,
  shipping_address  jsonb,
  items             jsonb not null,
  amount_total      numeric not null,
  currency          text not null,
  status            text not null default 'paid',
  created_at        timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_email_idx on public.orders (email);

-- Row Level Security: keep the table locked down. The webhook writes using the
-- service role key, which bypasses RLS, so no public policies are needed.
alter table public.orders enable row level security;
