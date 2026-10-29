import { describe } from 'vitest'
import { createMemoryOrderRepository } from './memory.ts'
import { testOrderRepositoryContract } from './repository.contract.ts'

describe('memory order repository', () => testOrderRepositoryContract(createMemoryOrderRepository))
