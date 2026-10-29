create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  status text not null default 'placed'
    check (status in ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
  created_at timestamptz not null default now()
);
