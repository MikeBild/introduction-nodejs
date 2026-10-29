import type { Envelope, OrderEvent } from '../src/events.ts'

// Upcasting: Alte Events werden beim Lesen ins aktuelle Schema gehoben.
// Gespeichert bleibt, was passiert ist. Nur evolve muss das alte Schema nie kennen.

type Upcaster = (data: Record<string, unknown>) => Record<string, unknown>

export const currentVersion: Record<OrderEvent['type'], number> = { ItemAdded: 2, OrderPlaced: 2 }

// Je Type und Version genau ein Schritt zur nächsten Version
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

// Neue Events schreibst du immer im aktuellen Schema.
export const toEnvelope = ({ type, ...data }: OrderEvent): Envelope => ({
  type,
  version: currentVersion[type],
  data,
})
