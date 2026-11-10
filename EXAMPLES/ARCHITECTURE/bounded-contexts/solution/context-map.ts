// Context map of the workshop shop as code: who is upstream, who translates?

export type Context = 'Verkauf' | 'Lager' | 'Versand' | 'Buchhaltung'

export type Relation = {
  upstream: Context
  downstream: Context
  // ACL: downstream translates. PL: upstream publishes a stable language.
  // Conformist: downstream adopts the foreign model unchanged.
  pattern: 'ACL' | 'Published Language' | 'Conformist'
}

export const legacy: Context[] = ['Lager']

export const contextMap: Relation[] = [
  { upstream: 'Lager', downstream: 'Verkauf', pattern: 'ACL' },
  { upstream: 'Verkauf', downstream: 'Versand', pattern: 'Published Language' },
  { upstream: 'Verkauf', downstream: 'Buchhaltung', pattern: 'Published Language' },
]

// Rule: an older system must never carry its model directly into another context.
export const checkMap = (map: Relation[]) =>
  map
    .filter((r) => legacy.includes(r.upstream) && r.pattern !== 'ACL')
    .map((r) => `${r.downstream} übernimmt das Modell von ${r.upstream} ohne Übersetzung`)
