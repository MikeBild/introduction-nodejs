import type { Envelope, OrderEvent } from '../src/events.ts'

// Upcasting: old events are lifted into the current schema when read.
// What happened stays stored unchanged. evolve itself never needs to know the old schema.

type Upcaster = (data: Record<string, unknown>) => Record<string, unknown>

export const currentVersion: Record<OrderEvent['type'], number> = { ItemAdded: 2, OrderPlaced: 2 }

// Per type and version exactly one step to the next version
const upcasters: Record<string, Upcaster> = {
  'ItemAdded@1': ({ price, ...rest }) => ({ ...rest, priceCents: Math.round(Number(price) * 100) }),
  'OrderPlaced@1': ({ at, ...rest }) => ({ ...rest, placedAt: at }),
}

export const upcast = (envelope: Envelope): OrderEvent => {
  const target = currentVersion[envelope.type as OrderEvent['type']]
  if (target === undefined) throw new Error(`Unknown event type ${envelope.type}`)
  if (envelope.version > target)
    throw new Error(`${envelope.type} v${envelope.version} is newer than this code`)
  let { version, data } = envelope
  while (version < target) {
    const step = upcasters[`${envelope.type}@${version}`]
    if (!step) throw new Error(`No upcaster for ${envelope.type} v${version}`)
    data = step(data)
    version++
  }
  return { type: envelope.type, ...data } as OrderEvent
}

// You always write new events in the current schema.
export const toEnvelope = ({ type, ...data }: OrderEvent): Envelope => ({
  type,
  version: currentVersion[type],
  data,
})
