import { migrate } from './migrate.ts'
import { createDatabase, databaseUrl } from './postgres.ts'

// one connection pool per test file: migrations once in beforeAll, sql.end() in afterAll
export const connectTestDatabase = async () => {
  const url = databaseUrl()
  const sql = createDatabase(url)
  try {
    await migrate(sql, ['migrations'])
  } catch (error) {
    await sql.end()
    throw new Error(
      `no PostgreSQL at ${url} – start it with: docker compose up --wait (${(error as Error).message})`,
    )
  }
  return sql
}
