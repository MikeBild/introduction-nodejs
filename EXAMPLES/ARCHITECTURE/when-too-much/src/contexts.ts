// Die Bounded Contexts des Werkstatt-Shops, so wie das Team sie beschreibt.

export type ContextProfile = {
  name: string
  invariantsCollide: boolean // Regeln, die sich gegenseitig stören und ein echtes Modell brauchen
  readWriteAsymmetry: boolean // viel mehr Lesen als Schreiben, Sichten mit ganz anderer Form
  historyRequired: boolean // Audit oder Zeitreise sind fachlich gefordert
  teamReady: boolean // das Team trägt Eventual Consistency und Event-Versionierung
}

export type Recommendation = 'crud' | 'cqrs-lite' | 'compromise' | 'cqrs' | 'cqrs-event-sourcing'

export const shop: ContextProfile[] = [
  {
    name: 'Katalog',
    invariantsCollide: false,
    readWriteAsymmetry: true,
    historyRequired: false,
    teamReady: true,
  },
  {
    name: 'Kunden',
    invariantsCollide: false,
    readWriteAsymmetry: false,
    historyRequired: false,
    teamReady: true,
  },
  {
    name: 'Lager',
    invariantsCollide: true,
    readWriteAsymmetry: false,
    historyRequired: false,
    teamReady: true,
  },
  {
    name: 'Bestellungen',
    invariantsCollide: true,
    readWriteAsymmetry: true,
    historyRequired: true,
    teamReady: true,
  },
  {
    name: 'Retouren',
    invariantsCollide: true,
    readWriteAsymmetry: false,
    historyRequired: true,
    teamReady: false,
  },
]

// Heute: Was im letzten Konferenzvortrag gut klang, gilt für alle Contexts.
export const recommend = (_context: ContextProfile): Recommendation => 'cqrs-event-sourcing'
