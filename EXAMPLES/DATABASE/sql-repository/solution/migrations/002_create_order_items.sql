-- money as integer cents: the price at the time of the order, never a float
create table order_items (
  order_id uuid not null references orders (id) on delete cascade,
  product_id text not null,
  quantity integer not null check (quantity >= 1),
  price_cents integer not null check (price_cents >= 0),
  primary key (order_id, product_id)
);

create index orders_status_idx on orders (status);
