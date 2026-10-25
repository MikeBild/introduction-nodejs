import type { RouteParams } from '../src/types.ts'

export type Setters<Shape> = {
  [Key in keyof Shape & string as `set${Capitalize<Key>}`]: (value: Shape[Key]) => void
}

export type IsString<Value> = Value extends string ? true : false
export type IsStringStrict<Value> = [Value] extends [string] ? true : false

export const buildPath = <Route extends string>(
  route: Route,
  params: Record<RouteParams<Route>, string>,
): string =>
  route.replace(/:(\w+)/g, (_match, name: string) =>
    encodeURIComponent((params as Record<string, string>)[name] ?? ''),
  )
