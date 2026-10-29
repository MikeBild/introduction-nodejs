// Event-Storming-Board als Code: jede Haftnotiz hat eine Farbe (kind) und einen Text.
// Orange: Domain Event, Blau: Command, Gelb: Actor, Lila: Policy, Rot: Hotspot.

export type Sticky =
  | { kind: 'event'; name: string }
  | { kind: 'command'; name: string; actor: string; emits: string[] }
  | { kind: 'policy'; whenever: string; then: string }
  | { kind: 'hotspot'; question: string }

export type Board = { timeline: Sticky[]; glossary: Record<string, string> }

// Erster Stand nach dem Gespräch mit dem Verkauf: so, wie es im Code heißt, nicht in der Fachsprache.
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
