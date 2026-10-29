import { recommend, shop } from './contexts.ts'

for (const context of shop) console.info(`${context.name}: ${recommend(context)}`)
