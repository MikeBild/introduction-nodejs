import { tx } from './store.ts'
import type { Command, State } from './process.ts'
export type Result = { ok: boolean; reason?: string }
export type Faults = { decline?: boolean; releaseFails?: boolean; losePaymentReply?: boolean }
// Public application port: no caller reads or mutates a foreign aggregate directly.
export async function execute(key: string, command: Command, s: State, faults: Faults = {}): Promise<Result> {
  const result = await tx(async c => {
    // Serializes repeated calls, including two workers after a lease expires.
    await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',[key])
    const receipt = (await c.query('SELECT result FROM receipts WHERE key=$1',[key])).rows[0]
    if (receipt) return receipt.result as Result
    let result: Result = { ok: true }
    if (['ReserveStock','CommitStock','ReleaseReservation'].includes(command)) {
      await c.query("SELECT sku FROM stock WHERE sku='brake' FOR UPDATE")
      if (command === 'ReserveStock') {
        // Reclaim expired holds and the previous hold for this manual approval.
        const released = await c.query("UPDATE reservations SET status='released' WHERE status='held' AND (expires_at <= now() OR process_id=$1) RETURNING id",[s.id])
        await c.query("UPDATE stock SET available=available+$1 WHERE sku='brake'",[released.rowCount])
        const stock = await c.query("UPDATE stock SET available=available-1 WHERE sku='brake' AND available>0 RETURNING sku")
        if (!stock.rowCount) result = { ok: false, reason: 'out of stock' }
        else await c.query("INSERT INTO reservations(id,process_id,status,expires_at) VALUES($1,$2,'held',now()+interval '5 minutes')",[s.reservationId,s.id])
      } else if (command === 'CommitStock') {
        const committed = await c.query("UPDATE reservations SET status='committed' WHERE id=$1 AND status='held' AND expires_at>now() RETURNING id",[s.reservationId])
        if (!committed.rowCount) result = { ok: false, reason: 'reservation expired' }
      } else {
        if (faults.releaseFails) throw new Error('inventory unavailable')
        const released = await c.query("UPDATE reservations SET status='released' WHERE process_id=$1 AND status='held' RETURNING id",[s.id])
        await c.query("UPDATE stock SET available=available+$1 WHERE sku='brake'",[released.rowCount])
      }
    } else if (command === 'AuthorizePayment') {
      if (faults.decline) result = { ok: false, reason: 'payment declined' }
      else await c.query("INSERT INTO payments(id,status) VALUES($1,'authorized') ON CONFLICT DO NOTHING",[s.paymentId])
    } else if (command === 'VoidAuthorization') {
      await c.query("UPDATE payments SET status='voided' WHERE id=$1 AND status='authorized'",[s.paymentId])
    } else {
      await c.query('UPDATE orders SET status=$2 WHERE id=$1',[s.orderId,command === 'ConfirmOrder' ? 'confirmed' : 'cancelled'])
    }
    // The participant's durable receipt and its local change share a transaction.
    await c.query('INSERT INTO receipts(key,result) VALUES($1,$2)',[key,result])
    return result
  })
  // Simulates a provider success followed by a lost HTTP response, outside its transaction.
  if (command === 'AuthorizePayment' && faults.losePaymentReply) throw new Error('payment outcome unknown')
  return result
}
export async function expireReservations() {
  await tx(async c => {
    await c.query("SELECT sku FROM stock WHERE sku='brake' FOR UPDATE")
    const expired = await c.query("UPDATE reservations SET status='released' WHERE status='held' AND expires_at<=now() RETURNING id")
    await c.query("UPDATE stock SET available=available+$1 WHERE sku='brake'",[expired.rowCount])
  })
}
