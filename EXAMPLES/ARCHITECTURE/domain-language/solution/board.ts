import type { Board } from '../src/board.ts'

// Das Board nach Event Storming mit Verkauf, Lager und Versand: Fachsprache statt Tabellennamen.
export const board: Board = {
  timeline: [
    { kind: 'command', name: 'CreateOrder', actor: 'Kundin', emits: ['OrderCreated'] },
    { kind: 'event', name: 'OrderCreated' },
    { kind: 'command', name: 'AddItem', actor: 'Kundin', emits: ['ItemAdded'] },
    { kind: 'event', name: 'ItemAdded' },
    { kind: 'command', name: 'PlaceOrder', actor: 'Kundin', emits: ['OrderPlaced'] },
    { kind: 'event', name: 'OrderPlaced' },
    { kind: 'policy', whenever: 'OrderPlaced', then: 'ReserveStock' },
    { kind: 'command', name: 'ReserveStock', actor: 'Lager', emits: ['StockReserved'] },
    { kind: 'event', name: 'StockReserved' },
    { kind: 'command', name: 'PayOrder', actor: 'Zahlungsanbieter', emits: ['OrderPaid'] },
    { kind: 'event', name: 'OrderPaid' },
    { kind: 'policy', whenever: 'OrderPaid', then: 'ShipOrder' },
    { kind: 'command', name: 'ShipOrder', actor: 'Versand', emits: ['OrderShipped'] },
    { kind: 'event', name: 'OrderShipped' },
    { kind: 'hotspot', question: 'Was passiert, wenn der Bestand nach dem Bezahlen fehlt?' },
  ],
  glossary: {
    Order: 'Bestellung einer Kundin, ab „placed“ verbindlich',
    Item: 'Position einer Bestellung: Produkt, Menge und Preis in Cent',
    Stock: 'Bestand eines Produkts im Lager, abzüglich Reservierungen',
  },
}
