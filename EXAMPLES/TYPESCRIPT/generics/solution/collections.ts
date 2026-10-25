import type { Result } from '../src/collections.ts'

export const last = <Item>(items: readonly Item[]): Item | undefined => items[items.length - 1]

export const groupBy = <Item, Key extends PropertyKey>(
  items: readonly Item[],
  toKey: (item: Item) => Key,
): Partial<Record<Key, Item[]>> =>
  items.reduce<Partial<Record<Key, Item[]>>>(
    (groups, item) => ({ ...groups, [toKey(item)]: [...(groups[toKey(item)] ?? []), item] }),
    {},
  )

export const mapResult = <Value, Mapped, Failure>(
  result: Result<Value, Failure>,
  transform: (value: Value) => Mapped,
): Result<Mapped, Failure> => (result.ok ? { ok: true, value: transform(result.value) } : result)
