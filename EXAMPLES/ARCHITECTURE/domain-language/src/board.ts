// Event Storming board as code: every sticky note has a color (kind) and a text.
// Orange: Domain Event, blue: Command, yellow: Actor, purple: Policy, red: Hotspot.

export type Sticky =
  | { kind: 'event'; name: string }
  | { kind: 'command'; name: string; actor: string; emits: string[] }
  | { kind: 'policy'; whenever: string; then: string }
  | { kind: 'hotspot'; question: string }

export type Board = { timeline: Sticky[]; glossary: Record<string, string> }

// First version after the conversation with sales: named as in the code, not in the domain language.
export const board: Board = {
  timeline: [
    { kind: 'command', name: 'SaveOrder', actor: 'Kundin', emits: ['OrderSaved'] },
    { kind: 'event', name: 'OrderSaved' },
    { kind: 'command', name: 'UpdateOrder', actor: 'Kundin', emits: ['OrderUpdated'] },
    { kind: 'event', name: 'OrderUpdated' },
    { kind: 'policy', whenever: 'OrderUpdated', then: 'SendMail' },
    { kind: 'event', name: 'OrderPaid' },
  ],
  glossary: {
    Order: 'Datensatz in der Tabelle orders',
  },
}
