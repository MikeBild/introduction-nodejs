create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  status text not null
    check (status in ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
  created_at timestamptz not null
);

-- the price at the time of the order: a later price change must not change old orders
create table order_items (
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null references products (id),
  quantity integer not null check (quantity >= 1),
  price_cents integer not null check (price_cents >= 0)
);

create index order_items_order_id_idx on order_items (order_id);
