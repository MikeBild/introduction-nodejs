import { afterAll, beforeAll, describe } from 'vitest'
import { migrate } from './migrate.ts'
import { createDatabase, createPostgresOrderRepository } from './postgres.ts'
import { testOrderRepositoryContract } from './repository.contract.ts'

// runs only against a real database: DATABASE_URL=postgres://… npm test
const databaseUrl = process.env.DATABASE_URL

describe.skipIf(!databaseUrl)('postgres order repository', () => {
  const sql = createDatabase(databaseUrl ?? 'postgres://unused')
  beforeAll(async () => {
    await migrate(sql, ['migrations'])
    await sql`truncate orders cascade`
  })
  afterAll(() => sql.end())
  // Exercise: set storesItems to true once order_items exists and saveOrder writes them
  testOrderRepositoryContract(() => createPostgresOrderRepository(sql), { storesItems: false })
})
