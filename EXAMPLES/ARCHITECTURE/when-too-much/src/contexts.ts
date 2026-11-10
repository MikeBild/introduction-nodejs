// The Bounded Contexts of the workshop shop, as the team describes them.

export type ContextProfile = {
  name: string
  invariantsCollide: boolean // rules that interfere with each other and need a real model
  readWriteAsymmetry: boolean // far more reading than writing, views with a completely different shape
  historyRequired: boolean // audit or time travel are required by the domain
  teamReady: boolean // the team can carry Eventual Consistency and event versioning
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

// Today: what sounded good in the last conference talk applies to all contexts.
export const recommend = (_context: ContextProfile): Recommendation => 'cqrs-event-sourcing'
