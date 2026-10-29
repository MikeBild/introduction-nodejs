import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkAdr, checkDirectory } from '../src/check-adr.ts'

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

describe('ADR 0003 after review', () => {
  it('follows the template', () => {
    expect(checkDirectory(path('.'))).toEqual([])
  })
})

describe('superseding', () => {
  it('points to a successor that exists', () => {
    const text = [
      '# 1. Alt',
      'Date: 2025-03-12',
      '## Status',
      'Superseded by [2. Neu](0002-neu.md)',
      '## Context',
      '…',
      '## Decision',
      'Wir werden …',
      '## Consequences',
      'Gut: … Schlecht: … Neu entscheiden, wenn …',
    ].join('\n')
    expect(checkAdr('0001-alt.md', text, ['0002-neu.md'])).toEqual([])
    expect(checkAdr('0001-alt.md', text, [])).toEqual(['0001-alt.md: Nachfolger 0002-neu.md fehlt'])
  })
})
