export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

export type Role = User['role']
export type UserPatch = Partial<Omit<User, 'id'>>
export type UserPreview = Pick<User, 'id' | 'name'>
export type FrozenUser = Readonly<User>

export const permissions: Record<Role, readonly string[]> = {
  admin: ['read', 'write', 'delete'],
  member: ['read'],
}

export const updateUser = (user: User, patch: UserPatch): User => ({ ...user, ...patch })

export const can = (user: User, permission: string): boolean =>
  permissions[user.role].includes(permission)

export const loadUser = async (id: string) => ({
  id,
  name: 'Ada',
  email: 'ada@example.org',
  active: true,
})

export type LoadedUser = Awaited<ReturnType<typeof loadUser>>
export type LoadUserArgs = Parameters<typeof loadUser>
