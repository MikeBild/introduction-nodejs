import { after, before, describe } from 'node:test'
import { migrate } from './migrate.ts'
import { createDatabase, createPostgresOrderRepository } from './postgres.ts'
import { testOrderRepositoryContract } from './repository.contract.ts'

// runs only against a real database: DATABASE_URL=postgres://… npm test
const databaseUrl = process.env.DATABASE_URL

describe('postgres order repository', { skip: !databaseUrl && 'DATABASE_URL not set' }, () => {
  const sql = createDatabase(databaseUrl ?? 'postgres://unused')
  before(async () => {
    await migrate(sql, ['migrations'])
    await sql`truncate orders cascade`
  })
  after(() => sql.end())
  testOrderRepositoryContract(() => createPostgresOrderRepository(sql))
})
