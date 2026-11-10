import type { ContextProfile, Recommendation } from '../src/contexts.ts'

// Decision flow per Bounded Context, in this order. The baseline is CRUD.
export const recommend = (context: ContextProfile): Recommendation => {
  if (!context.invariantsCollide) return 'crud'
  if (!context.readWriteAsymmetry && !context.historyRequired) return 'cqrs-lite'
  if (!context.teamReady) return 'compromise'
  return context.historyRequired ? 'cqrs-event-sourcing' : 'cqrs'
}

const decisions: Record<Recommendation, string> = {
  crud: 'CRUD einsetzen. Ein Modell reicht, die Regeln sind einfach.',
  'cqrs-lite': 'Commands und Queries trennen, mit einem Store und ohne Verzug.',
  compromise: 'CRUD mit Audit-Tabelle einsetzen, bis das Team Events tragen kann.',
  cqrs: 'CQRS einsetzen, mit Read Models als eigenen Sichten.',
  'cqrs-event-sourcing': 'Event Sourcing einsetzen, weil die Historie fachlich zählt.',
}

// Draft for the Decision section of the ADR
export const decisionLine = (context: ContextProfile) =>
  `${context.name}: Wir werden ${decisions[recommend(context)]}`
