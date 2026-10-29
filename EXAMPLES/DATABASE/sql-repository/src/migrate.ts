import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { createLogger, isLevel } from './logger.ts'
import { createDatabase, type Sql } from './postgres.ts'

export const pendingMigrations = (
  migrationFiles: readonly string[],
  appliedNames: readonly string[],
) =>
  migrationFiles
    .filter((file) => file.endsWith('.sql') && !appliedNames.includes(basename(file)))
    .toSorted((left, right) => basename(left).localeCompare(basename(right)))

// minimal migration runner: numbered SQL files, each applied once inside a transaction
export const migrate = async (sql: Sql, directories: readonly string[]) => {
  await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`
  const appliedNames = (await sql<{ name: string }[]>`select name from schema_migrations`).map(
    ({ name }) => name,
  )
  const migrationFiles = (
    await Promise.all(
      directories.map(async (directory) =>
        (await readdir(directory)).map((file) => join(directory, file)),
      ),
    )
  ).flat()
  const pendingFiles = pendingMigrations(migrationFiles, appliedNames)
  for (const file of pendingFiles) {
    const statements = await readFile(file, 'utf8')
    await sql.begin(async (transaction) => {
      await transaction.unsafe(statements) // trusted, versioned files – never user input
      await transaction.unsafe('insert into schema_migrations (name) values ($1)', [basename(file)])
    })
  }
  return pendingFiles.map((file) => basename(file))
}

if (import.meta.main) {
  const logger = createLogger(isLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'info')
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    logger.error('DATABASE_URL is required to run migrations')
    process.exitCode = 1
  } else {
    const sql = createDatabase(databaseUrl)
    try {
      const appliedNow = await migrate(sql, process.argv.slice(2))
      logger.info(appliedNow.length ? 'migrations applied' : 'schema is up to date', {
        applied: appliedNow,
      })
    } catch (error) {
      logger.error('migration failed', { reason: (error as Error).message })
      process.exitCode = 1
    } finally {
      await sql.end()
    }
  }
}
