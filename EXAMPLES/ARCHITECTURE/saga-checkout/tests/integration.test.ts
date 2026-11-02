import { beforeAll, beforeEach, afterAll, expect, test } from 'vitest'
import { migrate, pool, start, read, input, resume, tx, advance } from '../solution/store.ts'
import { tick, claim, finish } from '../solution/worker.ts'
import { execute, expireReservations } from '../solution/participants.ts'
import { request } from '../solution/api.ts'
beforeAll(async()=>{
  if (process.env.DATABASE_URL && new URL(process.env.DATABASE_URL).pathname !== '/saga_checkout')
    throw new Error('Tests require the dedicated saga_checkout database')
  await migrate()
})
beforeEach(async()=>{
  await pool.query('TRUNCATE jobs,processes,reservations,payments,orders,receipts,stock CASCADE')
  await pool.query("INSERT INTO stock VALUES('brake',10)")
})
afterAll(()=>pool.end())
async function drain() { for(let i=0;i<20 && await tick();i++); }
async function ready() { await pool.query('UPDATE jobs SET available_at=now(),lease_until=null WHERE NOT done') }
async function available() { return (await pool.query('SELECT available FROM stock')).rows[0].available }
test('automatic checkout, duplicate request and durable final order',async()=>{
  const id=await start('one','automatic')
  expect(await start('one','automatic')).toBe(id)
  await expect(start('one','manual')).rejects.toThrow('IdempotencyConflict')
  await drain()
  expect((await read(id)).status).toBe('CONFIRMED')
  expect(await available()).toBe(9)
  expect((await pool.query('SELECT status FROM orders')).rows[0].status).toBe('confirmed')
})
test('no stock and payment rejection end only after cleanup',async()=>{
  await pool.query('UPDATE stock SET available=0')
  const none=await start('none','automatic'); await drain()
  expect((await read(none)).status).toBe('CANCELLED')
  await pool.query('UPDATE stock SET available=10')
  const id=await start('decline','automatic')
  await tick(); await tick({decline:true})
  expect((await read(id)).status).toBe('COMPENSATING')
  await drain(); expect((await read(id)).status).toBe('CANCELLED')
  expect(await available()).toBe(10)
})
test('manual approval reacquires an expired reservation',async()=>{
  const id=await start('manual','manual'); await drain()
  expect((await read(id)).status).toBe('AWAITING_APPROVAL')
  await pool.query("UPDATE reservations SET expires_at=now()-interval '1 second'")
  await expireReservations(); expect(await available()).toBe(10)
  await input(id,'Approve'); await input(id,'Approve'); await drain()
  expect((await read(id)).status).toBe('CONFIRMED')
  expect((await pool.query('SELECT count(*)::int n FROM reservations')).rows[0].n).toBe(2)
})
test('manual rejection and stock disappearing before approval',async()=>{
  const id=await start('reject','manual'); await drain(); await input(id,'Cancel'); await drain()
  expect((await read(id)).status).toBe('CANCELLED')
  const id2=await start('gone','manual'); await drain()
  await pool.query("UPDATE reservations SET expires_at=now()-interval '1 second'")
  await expireReservations(); await pool.query('UPDATE stock SET available=0')
  await input(id2,'Approve'); await drain(); expect((await read(id2)).status).toBe('CANCELLED')
})
test('crash after participant commit replays the same receipt after restart',async()=>{
  const id=await start('crash','automatic'); const abandoned=(await claim())!
  await execute(abandoned.id,abandoned.command,abandoned.payload)
  expect(await available()).toBe(9)
  // No finish call: process died. A new owner recovers the durable job after expiry.
  await pool.query("UPDATE jobs SET lease_until=now()-interval '1 second'")
  const recovered=(await claim())!
  expect(recovered.lease_token).not.toBe(abandoned.lease_token)
  expect(await finish(abandoned,{ok:true})).toBe(false)
  await finish(recovered,await execute(recovered.id,recovered.command,recovered.payload))
  await drain(); expect((await read(id)).status).toBe('CONFIRMED'); expect(await available()).toBe(9)
})
test('unknown payment outcome is retried with the same key, then voided after cancellation',async()=>{
  const id=await start('unknown','automatic'); await tick(); await tick({losePaymentReply:true})
  expect((await read(id)).state.step).toBe('authorizing')
  await input(id,'Cancel'); await ready(); await drain()
  expect((await read(id)).status).toBe('CANCELLED')
  const payments=await pool.query('SELECT status FROM payments')
  expect(payments.rows).toEqual([{status:'voided'}]); expect(await available()).toBe(10)
})
test('reservation arriving after cancellation is released',async()=>{
  const id=await start('late','automatic'); const job=(await claim())!
  await input(id,'Cancel')
  await finish(job,await execute(job.id,job.command,job.payload)); await drain()
  expect((await read(id)).status).toBe('CANCELLED'); expect(await available()).toBe(10)
})
test('compensation failure escalates without claiming success; operator can resume',async()=>{
  const id=await start('failure','manual'); await drain(); await input(id,'Cancel')
  for(let i=0;i<5;i++) { await ready(); await tick({releaseFails:true}) }
  expect((await read(id)).status).toBe('NEEDS_ATTENTION')
  expect((await read(id)).state.step).toBe('releasing')
  await resume(id); await drain(); expect((await read(id)).status).toBe('CANCELLED')
})
test('expiry after authorization voids the authorization',async()=>{
  const id=await start('expiry','automatic'); await tick(); await tick()
  await pool.query("UPDATE reservations SET expires_at=now()-interval '1 second'")
  await drain(); expect((await read(id)).status).toBe('CANCELLED')
  expect((await pool.query('SELECT status FROM payments')).rows[0].status).toBe('voided')
})
test('two workers cannot claim the same job concurrently',async()=>{
  await start('race','automatic')
  const jobs=(await Promise.all([claim(),claim()])).filter(Boolean)
  expect(jobs).toHaveLength(1)
})
test('process and outbox rollback together',async()=>{
  const id=await start('atomic','automatic')
  await expect(tx(async c=>{
    await advance(c,id,{type:'Result',command:'ReserveStock',ok:true})
    throw new Error('crash before commit')
  })).rejects.toThrow()
  expect((await read(id)).state.step).toBe('reserving')
  expect((await pool.query('SELECT count(*)::int n FROM jobs')).rows[0].n).toBe(1)
})
test('GraphQL returns pending, approval is explicit, final status remains queryable',async()=>{
  const result=await request('mutation { startCheckout(input:{idempotencyKey:"graphql",mode:MANUAL}) { id status } }')
  expect(result.errors).toBeUndefined()
  const payload=result.data!.startCheckout as {id:string;status:string}
  expect(payload.status).toBe('PENDING'); await drain()
  const approved=await request('mutation($id:ID!){ approveCheckout(id:$id){status} }',{id:payload.id})
  expect(approved.errors).toBeUndefined(); await drain()
  const final=await request('query($id:ID!){checkout(id:$id){status}}',{id:payload.id})
  expect(final.data!.checkout).toEqual({status:'CONFIRMED'})
})
