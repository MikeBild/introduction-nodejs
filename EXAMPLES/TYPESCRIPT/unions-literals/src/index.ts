import { type Article, isRole, publish, statusLabel } from './article.ts'

const article: Article = { id: 'a-1', title: 'Hello TypeScript', status: 'draft' }
const published = publish(article)

console.info(
  `${published.title}: ${statusLabel(article.status)} -> ${statusLabel(published.status)}`,
)
console.info(`'editor' is a role: ${isRole('editor')}, 'root' is a role: ${isRole('root')}`)
