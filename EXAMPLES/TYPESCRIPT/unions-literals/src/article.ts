export const statuses = ['draft', 'published', 'archived'] as const
export type Status = (typeof statuses)[number]

export const roles = ['admin', 'editor', 'viewer'] as const
export type Role = (typeof roles)[number]

export type Article = {
  readonly id: string
  title: string
  status: Status
}

export const isRole = (value: string): value is Role => roles.some((role) => role === value)

export const statusLabel = (status: Status): string =>
  status === 'draft' ? 'Draft' : status === 'published' ? 'Published' : 'Archived'

export const publish = (article: Article): Article => ({ ...article, status: 'published' })
