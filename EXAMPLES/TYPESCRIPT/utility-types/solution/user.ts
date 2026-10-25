export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'guest'
  active: boolean
}

export type Role = User['role']
export type UserPreview = Pick<User, 'id' | 'name'>

/** Like Omit, but only accepts keys that exist on Shape */
export type StrictOmit<Shape, Key extends keyof Shape> = Omit<Shape, Key>
export type UserPatch = Partial<StrictOmit<User, 'id'>>

export const permissions: Record<Role, readonly string[]> = {
  admin: ['read', 'write', 'delete'],
  member: ['read'],
  guest: [],
}

export const toPreview = ({ id, name }: User): UserPreview => ({ id, name })
