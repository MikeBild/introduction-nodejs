import pg from 'pg'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { initial, react, status, type State, type Command, type Event, type Reaction } from './process.ts'
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL ?? 'postgres://workshop:workshop@localhost:55439/saga_checkout' })
export async function tx<T>(f: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect()
  try { await c.query('BEGIN'); const result = await f(c); await c.query('COMMIT'); return result }
  catch (e) { await c.query('ROLLBACK'); throw e } finally { c.release() }
}
export async function migrate() { await pool.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8')) }
export async function enqueue(c: pg.PoolClient, state: State, command?: Command) {
  if (!command) return
  const id = `${state.id}:${command}:${state.attempt}`
  await c.query('INSERT INTO jobs(id,process_id,command,payload) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING', [id,state.id,command,state])
}
export async function start(key: string, mode: State['mode']) {
  if (!key.trim() || key.length > 100) throw new Error('InvalidIdempotencyKey')
  return tx(async c => {
    const s = initial(randomUUID(), mode)
    const inserted = await c.query('INSERT INTO processes(id,request_key,mode,state) VALUES($1,$2,$3,$4) ON CONFLICT(request_key) DO NOTHING RETURNING id', [s.id,key,mode,s])
    if (!inserted.rowCount) {
      const old = (await c.query('SELECT id,mode FROM processes WHERE request_key=$1', [key])).rows[0]
      if (old.mode !== mode) throw new Error('IdempotencyConflict')
      return old.id as string
    }
    await c.query("INSERT INTO orders(id,status) VALUES($1,'pending')", [s.orderId])
    await enqueue(c,s,'ReserveStock')
    return s.id
  })
}
export async function advance(c: pg.PoolClient, id: string, event: Event, reducer = react) {
  const row = (await c.query('SELECT * FROM processes WHERE id=$1 FOR UPDATE', [id])).rows[0]
  if (!row) throw new Error('NotFound')
  const next: Reaction = reducer(row.state as State,event)
  await c.query('UPDATE processes SET state=$2,version=version+1 WHERE id=$1 AND version=$3',[id,next.state,row.version])
  await enqueue(c,next.state,next.command)
}
export async function input(id: string, type: 'Approve' | 'Cancel', reducer = react) {
  await tx(c => advance(c,id,{type},reducer))
  return read(id)
}
export async function read(id: string) {
  const row = (await pool.query('SELECT * FROM processes WHERE id=$1',[id])).rows[0]
  if (!row) throw new Error('NotFound')
  return { id, status: status(row.state,row.attention), state: row.state as State, version: row.version as number }
}
export async function resume(id: string) {
  await tx(async c => {
    // Operator action, not a public customer mutation. Preserve the command's idempotency key.
    await c.query('SELECT id FROM processes WHERE id=$1 FOR UPDATE',[id])
    await c.query('UPDATE processes SET attention=false WHERE id=$1',[id])
    await c.query("UPDATE jobs SET attempts=0,available_at=now(),last_error=null WHERE process_id=$1 AND NOT done AND lease_until IS NULL",[id])
  })
}
