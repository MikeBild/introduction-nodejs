import { describe, expect, expectTypeOf, it } from 'vitest'
import { type StrictOmit, type User, type UserPatch, permissions, toPreview } from './user.ts'

const grace: User = {
  id: 'u-2',
  name: 'Grace',
  email: 'grace@example.org',
  role: 'guest',
  active: true,
}

describe('utility types solution', () => {
  it('maps a user to its preview', () => {
    expect(toPreview(grace)).toEqual({ id: 'u-2', name: 'Grace' })
  })

  it('gives guests no permissions', () => {
    expect(permissions.guest).toEqual([])
  })

  it('catches typos in omitted keys', () => {
    expectTypeOf<UserPatch>().toHaveProperty('active')
    // @ts-expect-error 'emial' is not a key of User
    type TypoUser = StrictOmit<User, 'emial'>
    expectTypeOf<TypoUser>().not.toBeNever()
  })
})
