import { describe, expect, it } from 'vitest'
import { board } from './board.ts'
import { lint, terms } from './lint.ts'

// Diese Tests beschreiben den heutigen Stand – auch seine Schwächen.
describe('first board (technical names)', () => {
  it('finds CRUD names instead of domain language', () => {
    expect(lint(board)).toEqual(
      expect.arrayContaining([
        'Command SaveOrder ist technisch benannt',
        'Event OrderUpdated ist technisch benannt',
        'Policy löst unbekannten Command SendMail aus',
        'Event OrderPaid hat keinen Command als Auslöser',
        'Glossar erklärt Order technisch statt fachlich',
      ]),
    )
  })
})

describe('lint rules', () => {
  it('takes the domain terms out of a name', () => {
    expect(terms({ kind: 'event', name: 'OrderPlaced' })).toEqual(['Order'])
    expect(terms({ kind: 'command', name: 'ReserveStock' })).toEqual(['Stock'])
  })
})
