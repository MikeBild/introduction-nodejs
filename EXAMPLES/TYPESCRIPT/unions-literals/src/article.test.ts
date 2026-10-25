import { describe, expect, expectTypeOf, it } from 'vitest'
import { type Article, type Role, type Status, isRole, publish, statusLabel } from './article.ts'

const draftArticle: Article = { id: 'a-1', title: 'Hello TypeScript', status: 'draft' }

describe('article', () => {
  it('labels every status', () => {
    expect(statusLabel('draft')).toBe('Draft')
    expect(statusLabel('published')).toBe('Published')
    expect(statusLabel('archived')).toBe('Archived')
  })

  it('publishes without mutating the original', () => {
    expect(publish(draftArticle).status).toBe('published')
    expect(draftArticle.status).toBe('draft')
  })

  it('narrows strings to roles', () => {
    expect(isRole('admin')).toBe(true)
    expect(isRole('root')).toBe(false)
  })

  it('derives literal unions from const arrays', () => {
    expectTypeOf<Status>().toEqualTypeOf<'draft' | 'published' | 'archived'>()
    expectTypeOf<Role>().toEqualTypeOf<'admin' | 'editor' | 'viewer'>()
  })

  it('rejects unknown literals, readonly writes and excess fields of fresh literals', () => {
    // @ts-expect-error 'deleted' is not a Status
    statusLabel('deleted')
    // @ts-expect-error id is readonly
    draftArticle.id = 'a-2'
    // @ts-expect-error excess property check on a fresh object literal
    const freshArticle: Article = { id: 'a-3', title: 'Fresh', status: 'draft', author: 'Ada' }
    const articleWithAuthor = {
      id: 'a-4',
      title: 'Structural',
      status: 'draft' as const,
      author: 'Ada',
    }
    const structuralArticle: Article = articleWithAuthor // ok: structural typing
    expect([freshArticle.id, structuralArticle.id]).toEqual(['a-3', 'a-4'])
  })
})
