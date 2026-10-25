import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  type LoadUserArgs,
  type LoadedUser,
  type User,
  type UserPatch,
  type UserPreview,
  can,
  loadUser,
  updateUser,
} from './user.ts'

const ada: User = { id: 'u-1', name: 'Ada', email: 'ada@example.org', role: 'member' }

describe('utility types', () => {
  it('updates users with a partial patch', () => {
    expect(updateUser(ada, { role: 'admin' }).role).toBe('admin')
    expect(ada.role).toBe('member')
    // @ts-expect-error the id is not part of a patch
    updateUser(ada, { id: 'u-2' })
  })

  it('looks up permissions by role', () => {
    expect(can(ada, 'read')).toBe(true)
    expect(can(ada, 'delete')).toBe(false)
  })

  it('derives variants instead of copying them', () => {
    expectTypeOf<UserPreview>().toEqualTypeOf<{ id: string; name: string }>()
    expectTypeOf<UserPatch>().toEqualTypeOf<{
      name?: string
      email?: string
      role?: 'admin' | 'member'
    }>()
  })

  it('derives types from functions', async () => {
    expect((await loadUser('u-1')).active).toBe(true)
    expectTypeOf<LoadedUser>().toEqualTypeOf<{
      id: string
      name: string
      email: string
      active: boolean
    }>()
    expectTypeOf<LoadUserArgs>().toEqualTypeOf<[id: string]>()
  })
})
