import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, test } from 'vitest'
import { newOrder, testOrderRepositoryContract } from '../src/repository.contract.ts'
import { createSqliteOrderRepository, openDatabase } from './sqlite.ts'

const directory = mkdtempSync(join(tmpdir(), 'orders-sqlite-'))
const databasePath = join(directory, 'orders.db')
afterAll(() => rmSync(directory, { recursive: true, force: true }))

const countOrders = 'select count(*) as orders from orders'

describe('solution sqlite order repository', () => {
  testOrderRepositoryContract(() => createSqliteOrderRepository(openDatabase(databasePath)))

  test('uses journal mode WAL', () => {
    const [mode] = openDatabase(databasePath).prepare('pragma journal_mode').all()
    assert.deepEqual({ ...mode }, { journal_mode: 'wal' })
  })

  test('lets a writer commit while a reader keeps its snapshot', async () => {
    const reader = openDatabase(databasePath)
    const writer = createSqliteOrderRepository(openDatabase(databasePath, { timeout: 0 }))
    reader.exec('begin')
    const before = reader.prepare(countOrders).get()
    await writer.saveOrder(newOrder('c-8'))
    assert.deepEqual(reader.prepare(countOrders).get(), before)
    reader.exec('rollback')
    assert.notDeepEqual(reader.prepare(countOrders).get(), before)
  })

  test('still allows only one writer at a time', async () => {
    const firstWriter = openDatabase(databasePath)
    const secondWriter = createSqliteOrderRepository(openDatabase(databasePath, { timeout: 0 }))
    firstWriter.exec('begin immediate')
    await assert.rejects(secondWriter.saveOrder(newOrder('c-9')), /database is locked/)
    firstWriter.exec('rollback')
  })
})
