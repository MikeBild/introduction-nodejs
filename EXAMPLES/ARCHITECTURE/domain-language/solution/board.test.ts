import { describe, expect, it } from 'vitest'
import { lint } from '../src/lint.ts'
import { board } from './board.ts'

describe('board in domain language', () => {
  it('passes every lint rule', () => {
    expect(lint(board)).toEqual([])
  })

  it('keeps open questions visible as hotspots', () => {
    expect(board.timeline.filter((sticky) => sticky.kind === 'hotspot')).not.toHaveLength(0)
  })

  it('tells the story in order: every policy follows its event', () => {
    const index = (name: string) =>
      board.timeline.findIndex(
        (s) => (s.kind === 'event' || s.kind === 'command') && s.name === name,
      )
    for (const sticky of board.timeline)
      if (sticky.kind === 'policy') expect(index(sticky.whenever)).toBeLessThan(index(sticky.then))
  })
})
