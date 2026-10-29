import { describe } from 'vitest'
import { createMemoryOrderRepository } from '../src/memory.ts'
import { testOrderRepositoryContract } from '../src/repository.contract.ts'

// the same contract – in-memory and postgres must behave alike, items and rollback included
describe('solution memory order repository', () =>
  testOrderRepositoryContract(createMemoryOrderRepository))
