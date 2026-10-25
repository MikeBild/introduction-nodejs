export const statuses = ['draft', 'review', 'published', 'archived'] as const
export type Status = (typeof statuses)[number]

export const roles = ['admin', 'editor', 'viewer'] as const
export type Role = (typeof roles)[number]

export type Article = {
  readonly id: string
  title: string
  status: Status
  readonly tags?: readonly string[]
}

export const isRole = (value: string): value is Role => roles.some((role) => role === value)
export const isStatus = (value: string): value is Status =>
  statuses.some((status) => status === value)

export const statusLabel = (status: Status): string =>
  status === 'draft'
    ? 'Draft'
    : status === 'review'
      ? 'In review'
      : status === 'published'
        ? 'Published'
        : 'Archived'

export const publish = (article: Article): Article => ({ ...article, status: 'published' })

export const addTag = (article: Article, tag: string): Article => ({
  ...article,
  tags: [...(article.tags ?? []), tag],
})
