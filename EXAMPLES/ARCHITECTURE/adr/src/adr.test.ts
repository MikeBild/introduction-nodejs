import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkDirectory } from './check-adr.ts'

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

describe('ADRs in docs/adr', () => {
  it('follow the template', () => {
    expect(checkDirectory(path('../docs/adr'))).toEqual([])
  })
})

// Dieser Test beschreibt den heutigen Stand – auch seine Schwächen.
describe('draft ADR 0003', () => {
  it('reads like a ticket, not like a decision', () => {
    expect(checkDirectory(path('./draft'))).toEqual([
      '0003-projektionen.md: Titel ohne Nummer',
      '0003-projektionen.md: Datum fehlt',
      '0003-projektionen.md: Consequences fehlt',
      '0003-projektionen.md: Decision ohne „Wir werden …“',
      '0003-projektionen.md: Consequences ohne „Gut:“',
      '0003-projektionen.md: Consequences ohne „Schlecht:“',
      '0003-projektionen.md: Consequences ohne „Neu entscheiden, wenn“',
    ])
  })
})
