import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, test } from 'vitest'
import { newOrder, testOrderRepositoryContract } from './repository.contract.ts'
import { createSqliteOrderRepository, openDatabase } from './sqlite.ts'

// a real file on disk: journal modes such as WAL do not apply to :memory:
const directory = mkdtempSync(join(tmpdir(), 'orders-sqlite-'))
const databasePath = join(directory, 'orders.db')
afterAll(() => rmSync(directory, { recursive: true, force: true }))

describe('sqlite order repository', () => {
  // Exercise: set storesItems to true once order_items exists and saveOrder writes them
  testOrderRepositoryContract(() => createSqliteOrderRepository(openDatabase(databasePath)), {
    storesItems: false,
  })

  // documents the bug of the default journal mode – the exercise turns this test around
  test('bug: an open read transaction blocks the commit of a writer', async () => {
    const reader = openDatabase(databasePath)
    const writer = createSqliteOrderRepository(openDatabase(databasePath, { timeout: 0 }))
    reader.exec('begin')
    reader.prepare('select count(*) from orders').get()
    await assert.rejects(writer.saveOrder(newOrder('c-8')), /database is locked/)
    reader.exec('rollback')
  })

  // Your turn, see the section on SQLite in README.md
  test.todo('uses journal mode WAL')
  test.todo('lets a writer commit while a reader keeps its snapshot')
  test.todo('still allows only one writer at a time')
})
