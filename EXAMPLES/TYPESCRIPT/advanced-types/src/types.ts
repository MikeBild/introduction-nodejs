export type ElementOf<Value> = Value extends readonly (infer Item)[] ? Item : never

export type Unwrap<Value> = Value extends Promise<infer Inner> ? Unwrap<Inner> : Value

export type Getters<Shape> = {
  [Key in keyof Shape & string as `get${Capitalize<Key>}`]: () => Shape[Key]
}

export type Mutable<Shape> = { -readonly [Key in keyof Shape]: Shape[Key] }

export type EventName<Entity extends string> = `${Entity}:${'created' | 'deleted'}`

export type RouteParams<Route extends string> =
  Route extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<Rest>
    : Route extends `${string}:${infer Param}`
      ? Param
      : never

const capitalize = <Text extends string>(text: Text): Capitalize<Text> =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}` as Capitalize<Text>

export const createGetters = <Shape extends Record<string, unknown>>(
  shape: Shape,
): Getters<Shape> =>
  Object.fromEntries(
    Object.entries(shape).map(([key, value]) => [`get${capitalize(key)}`, () => value]),
  ) as Getters<Shape>

export const createEmitter = <Entity extends string>() => {
  const handlers = new Map<EventName<Entity>, ((payload: string) => void)[]>()
  return {
    on: (event: EventName<Entity>, handler: (payload: string) => void): void => {
      handlers.set(event, [...(handlers.get(event) ?? []), handler])
    },
    emit: (event: EventName<Entity>, payload: string): void =>
      (handlers.get(event) ?? []).forEach((handler) => handler(payload)),
  }
}
