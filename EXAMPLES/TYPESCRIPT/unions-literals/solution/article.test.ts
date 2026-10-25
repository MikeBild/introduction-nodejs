import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Article, type Status, addTag, isStatus, statusLabel } from './article.ts'

const draftArticle: Article = { id: 'a-1', title: 'Hello TypeScript', status: 'draft' }

describe('article solution', () => {
  it('knows the review status', () => {
    expect(statusLabel('review')).toBe('In review')
    expectTypeOf<Status>().toEqualTypeOf<'draft' | 'review' | 'published' | 'archived'>()
  })

  it('narrows unknown strings to statuses', () => {
    const input: string = 'review'
    expect(isStatus(input)).toBe(true)
    expect(isStatus('deleted')).toBe(false)
    if (isStatus(input)) expectTypeOf(input).toEqualTypeOf<Status>()
  })

  it('adds tags immutably', () => {
    const taggedArticle = addTag(addTag(draftArticle, 'typescript'), 'unions')
    expect(taggedArticle.tags).toEqual(['typescript', 'unions'])
    expect(draftArticle.tags).toBeUndefined()
    // @ts-expect-error tags are readonly
    taggedArticle.tags?.push('mutated')
  })
})
