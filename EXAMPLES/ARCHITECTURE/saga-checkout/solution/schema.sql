CREATE TABLE IF NOT EXISTS processes (
 id text PRIMARY KEY, request_key text UNIQUE NOT NULL, mode text NOT NULL,
 state jsonb NOT NULL, version int NOT NULL DEFAULT 0, attention boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS jobs (
 id text PRIMARY KEY, process_id text NOT NULL REFERENCES processes(id),
 command text NOT NULL, payload jsonb NOT NULL, attempts int NOT NULL DEFAULT 0,
 available_at timestamptz NOT NULL DEFAULT now(), lease_until timestamptz,
 lease_token text, done boolean NOT NULL DEFAULT false, last_error text
);
CREATE TABLE IF NOT EXISTS stock (sku text PRIMARY KEY, available int NOT NULL CHECK (available >= 0));
CREATE TABLE IF NOT EXISTS reservations (
 id text PRIMARY KEY, process_id text NOT NULL, status text NOT NULL,
 expires_at timestamptz NOT NULL
);
-- The simulated provider commits independently of the process transaction.
CREATE TABLE IF NOT EXISTS payments (id text PRIMARY KEY, status text NOT NULL);
CREATE TABLE IF NOT EXISTS orders (id text PRIMARY KEY, status text NOT NULL);
CREATE TABLE IF NOT EXISTS receipts (key text PRIMARY KEY, result jsonb NOT NULL);
INSERT INTO stock(sku,available) VALUES ('brake',10) ON CONFLICT DO NOTHING;
