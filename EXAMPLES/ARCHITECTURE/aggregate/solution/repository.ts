// One repository per aggregate: loads and saves exactly one aggregate, with a version check.

export class ConcurrencyError extends Error {
  constructor(id: string) {
    super(`Version conflict in ${id}`)
    this.name = 'ConcurrencyError'
  }
}

export const inMemoryRepository = <T extends { id: string }>() => {
  const rows = new Map<string, { value: T; version: number }>()
  return {
    load: async (id: string) => {
      const row = rows.get(id)
      if (!row) throw new Error(`${id} not found`)
      return { value: structuredClone(row.value), version: row.version }
    },
    save: async (value: T, expectedVersion: number) => {
      const current = rows.get(value.id)?.version ?? 0
      if (current !== expectedVersion) throw new ConcurrencyError(value.id)
      rows.set(value.id, { value: structuredClone(value), version: current + 1 })
    },
  }
}

export type Repository<T extends { id: string }> = ReturnType<typeof inMemoryRepository<T>>

// One transaction changes exactly one aggregate: load, apply the rule, save with the version.
export const change = async <T extends { id: string }>(
  repository: Repository<T>,
  id: string,
  decide: (value: T) => T,
) => {
  const { value, version } = await repository.load(id)
  await repository.save(decide(value), version)
}
