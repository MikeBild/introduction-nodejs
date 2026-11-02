import { randomUUID } from 'node:crypto'
import { tx, advance } from './store.ts'
import { execute, type Faults } from './participants.ts'
import { react, type Command, type State } from './process.ts'
export type Job = { id: string; process_id: string; command: Command; payload: State; lease_token: string; attempts: number }
export async function claim(): Promise<Job | undefined> {
  return tx(async c => {
    const token = randomUUID()
    const r = await c.query(`WITH candidate AS (
      SELECT j.id FROM jobs j JOIN processes p ON p.id=j.process_id
      WHERE NOT j.done AND NOT p.attention AND j.available_at<=now()
        AND (j.lease_until IS NULL OR j.lease_until<now())
      ORDER BY j.available_at,j.id FOR UPDATE OF j SKIP LOCKED LIMIT 1
    ) UPDATE jobs SET lease_token=$1,lease_until=now()+interval '30 seconds',attempts=attempts+1
      FROM candidate WHERE jobs.id=candidate.id RETURNING jobs.*`,[token])
    return r.rows[0] as Job | undefined
  })
}
export async function finish(job: Job, result: {ok: boolean; reason?: string}, reducer = react) {
  return tx(async c => {
    const owned = await c.query('SELECT id FROM jobs WHERE id=$1 AND lease_token=$2 AND NOT done FOR UPDATE',[job.id,job.lease_token])
    if (!owned.rowCount) return false // old owner cannot overwrite the new owner's result
    await advance(c,job.process_id,{type:'Result',command:job.command,...result},reducer)
    await c.query('UPDATE jobs SET done=true,lease_until=null,lease_token=null WHERE id=$1',[job.id])
    return true
  })
}
export async function fail(job: Job, message: string) {
  await tx(async c => {
    const r = await c.query(`UPDATE jobs SET lease_until=null,lease_token=null,last_error=$3,
      available_at=now()+make_interval(secs => LEAST(60, power(2,attempts)::int))
      WHERE id=$1 AND lease_token=$2 AND NOT done RETURNING attempts`,[job.id,job.lease_token,message])
    if (r.rowCount && r.rows[0].attempts>=5)
      await c.query('UPDATE processes SET attention=true WHERE id=$1',[job.process_id])
  })
}
export async function tick(faults: Faults = {}, reducer = react): Promise<boolean> {
  const job = await claim()
  if (!job) return false
  try { await finish(job,await execute(job.id,job.command,job.payload,faults),reducer) }
  catch (error) { await fail(job,error instanceof Error ? error.message : 'unknown failure') }
  return true
}
