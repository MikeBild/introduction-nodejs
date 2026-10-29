import type { Board, Sticky } from './board.ts'

// Prüfregeln für ein Event-Storming-Board. Sie ersetzen kein Gespräch,
// aber sie finden technische Namen, lose Enden und fehlende Begriffe.

type Named = Extract<Sticky, { kind: 'event' | 'command' }>

// Technische Verben verraten CRUD statt Fachsprache.
const technicalVerbs = ['Save', 'Update', 'Set', 'Change', 'Process', 'Handle', 'Manage']
const technicalPastTense = ['Saved', 'Updated', 'Changed', 'Processed', 'Handled']

// Ein Event steht in der Vergangenheitsform: Placed, Paid, Shipped, Sent, …
const isPastTense = (name: string) => /(ed|Paid|Sent|Sold)$/.test(name)

// Die Begriffe in einem Namen: ohne Verb vorn (Command) oder Partizip hinten (Event).
// „PlaceOrder“ → [Order], „StockReserved“ → [Stock]
export const terms = ({ kind, name }: Pick<Named, 'kind' | 'name'>) => {
  const words = name.match(/[A-Z][a-z]+/g) ?? []
  return kind === 'command' ? words.slice(1) : words.slice(0, -1)
}

export const lint = ({ timeline, glossary }: Board): string[] => {
  const problems: string[] = []
  const events = timeline.filter((s) => s.kind === 'event')
  const commands = timeline.filter((s) => s.kind === 'command')
  const eventNames = new Set(events.map((e) => e.name))
  const commandNames = new Set(commands.map((c) => c.name))

  for (const { name } of events) {
    if (!isPastTense(name)) problems.push(`Event ${name} steht nicht in der Vergangenheitsform`)
    if (technicalPastTense.some((verb) => name.endsWith(verb)))
      problems.push(`Event ${name} ist technisch benannt`)
  }
  for (const command of commands) {
    if (technicalVerbs.some((verb) => command.name.startsWith(verb)))
      problems.push(`Command ${command.name} ist technisch benannt`)
    for (const emitted of command.emits)
      if (!eventNames.has(emitted))
        problems.push(`Command ${command.name} erzeugt unbekanntes Event ${emitted}`)
  }
  for (const sticky of timeline) {
    if (sticky.kind !== 'policy') continue
    if (!eventNames.has(sticky.whenever))
      problems.push(`Policy reagiert auf unbekanntes Event ${sticky.whenever}`)
    if (!commandNames.has(sticky.then))
      problems.push(`Policy löst unbekannten Command ${sticky.then} aus`)
  }
  // Jedes Event braucht einen Auslöser: einen Command mit Actor.
  const emitted = new Set(commands.flatMap((c) => c.emits))
  for (const { name } of events)
    if (!emitted.has(name)) problems.push(`Event ${name} hat keinen Command als Auslöser`)

  // Jeder Begriff aus den Namen steht im Glossar, mit einer fachlichen Erklärung.
  const used = new Set([...events, ...commands].flatMap(terms))
  for (const term of used) if (!glossary[term]) problems.push(`Begriff ${term} fehlt im Glossar`)
  for (const [term, meaning] of Object.entries(glossary))
    if (/tabelle|datensatz|spalte|json/i.test(meaning))
      problems.push(`Glossar erklärt ${term} technisch statt fachlich`)
  return problems
}
