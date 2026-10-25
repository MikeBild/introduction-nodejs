import { after, before, describe } from 'node:test'
import { migrate } from '../src/migrate.ts'
import { createDatabase } from '../src/postgres.ts'
import { createPostgresOrderRepositoryWithItems } from './postgres.ts'
import { testOrderRepositoryWithItemsContract } from './repository.contract.ts'

const databaseUrl = process.env.DATABASE_URL

describe(
  'solution postgres order repository',
  { skip: !databaseUrl && 'DATABASE_URL not set' },
  () => {
    const sql = createDatabase(databaseUrl ?? 'postgres://unused')
    before(async () => {
      await migrate(sql, ['migrations', 'solution/migrations'])
      await sql`truncate orders cascade`
    })
    after(() => sql.end())
    testOrderRepositoryWithItemsContract(() => createPostgresOrderRepositoryWithItems(sql))
  },
)
