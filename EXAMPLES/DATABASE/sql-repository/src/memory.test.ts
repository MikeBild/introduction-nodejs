import { describe } from 'node:test'
import { createMemoryOrderRepository } from './memory.ts'
import { testOrderRepositoryContract } from './repository.contract.ts'

describe('memory order repository', () => testOrderRepositoryContract(createMemoryOrderRepository))
