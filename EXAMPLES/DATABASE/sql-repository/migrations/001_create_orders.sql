create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  status text not null default 'open' check (status in ('open', 'paid', 'cancelled')),
  total numeric(12, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);
