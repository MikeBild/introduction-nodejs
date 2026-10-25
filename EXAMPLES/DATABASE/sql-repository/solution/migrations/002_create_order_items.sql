create table order_items (
  order_id uuid not null references orders (id) on delete cascade,
  sku text not null,
  quantity integer not null check (quantity > 0),
  primary key (order_id, sku)
);

create index orders_status_idx on orders (status);
