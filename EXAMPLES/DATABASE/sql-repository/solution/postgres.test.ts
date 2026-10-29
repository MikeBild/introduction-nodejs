import { afterAll, beforeAll, describe } from 'vitest'
import { migrate } from '../src/migrate.ts'
import { createDatabase } from '../src/postgres.ts'
import { testOrderRepositoryContract } from '../src/repository.contract.ts'
import { createPostgresOrderRepository } from './postgres.ts'

const databaseUrl = process.env.DATABASE_URL

describe.skipIf(!databaseUrl)('solution postgres order repository', () => {
  const sql = createDatabase(databaseUrl ?? 'postgres://unused')
  beforeAll(async () => {
    await migrate(sql, ['migrations', 'solution/migrations'])
    await sql`truncate orders cascade`
  })
  afterAll(() => sql.end())
  testOrderRepositoryContract(() => createPostgresOrderRepository(sql))
})
