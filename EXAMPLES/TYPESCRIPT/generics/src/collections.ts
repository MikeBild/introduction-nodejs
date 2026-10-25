export const first = <Item>(items: readonly Item[]): Item | undefined => items[0]

export const pair = <Left, Right>(left: Left, right: Right): [Left, Right] => [left, right]

export const pluck = <Item, Key extends keyof Item>(
  items: readonly Item[],
  key: Key,
): Item[Key][] => items.map((item) => item[key])

export type Result<Value, Failure = Error> =
  { ok: true; value: Value } | { ok: false; error: Failure }

export const ok = <Value>(value: Value): Result<Value, never> => ({ ok: true, value })
export const fail = <Failure>(error: Failure): Result<never, Failure> => ({ ok: false, error })

export const parseAge = (input: string): Result<number, string> => {
  const age = Number(input)
  return Number.isInteger(age) && age >= 0 ? ok(age) : fail(`Invalid age: ${input}`)
}
