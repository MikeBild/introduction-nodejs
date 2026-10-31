-- money as integer cents, never a float; the check keeps the stock honest even when two orders race
create table products (
  id text primary key,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  stock integer not null check (stock >= 0)
);
