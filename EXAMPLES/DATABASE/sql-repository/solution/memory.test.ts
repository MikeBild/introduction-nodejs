import { describe } from 'node:test'
import { createMemoryOrderRepositoryWithItems } from './memory.ts'
import { testOrderRepositoryWithItemsContract } from './repository.contract.ts'

describe('solution memory order repository', () =>
  testOrderRepositoryWithItemsContract(createMemoryOrderRepositoryWithItems))
