// Context Map des Werkstatt-Shops als Code: Wer ist upstream, wer übersetzt?

export type Context = 'Verkauf' | 'Lager' | 'Versand' | 'Buchhaltung'

export type Relation = {
  upstream: Context
  downstream: Context
  // ACL: Downstream übersetzt. PL: Upstream veröffentlicht eine stabile Sprache.
  // Conformist: Downstream übernimmt das fremde Modell unverändert.
  pattern: 'ACL' | 'Published Language' | 'Conformist'
}

export const legacy: Context[] = ['Lager']

export const contextMap: Relation[] = [
  { upstream: 'Lager', downstream: 'Verkauf', pattern: 'ACL' },
  { upstream: 'Verkauf', downstream: 'Versand', pattern: 'Published Language' },
  { upstream: 'Verkauf', downstream: 'Buchhaltung', pattern: 'Published Language' },
]

// Regel: Ein Altsystem darf sein Modell nie direkt in einen anderen Context tragen.
export const checkMap = (map: Relation[]) =>
  map
    .filter((r) => legacy.includes(r.upstream) && r.pattern !== 'ACL')
    .map((r) => `${r.downstream} übernimmt das Modell von ${r.upstream} ohne Übersetzung`)
