import type { EventStore, StoredEvent } from '../src/event-store.ts'

// Eine Projektion ist ein Fold mit Checkpoint: Zustand plus letzte verarbeitete Position.
export type Projection<S> = {
  name: string
  initial: S
  apply: (state: S, stored: StoredEvent) => S
}
export type Checkpointed<S> = { state: S; position: number }

export const start = <S>(projection: Projection<S>): Checkpointed<S> => ({
  state: projection.initial,
  position: 0,
})

// Idempotent: Was schon verarbeitet ist, ändert nichts mehr.
export const step = <S>(
  projection: Projection<S>,
  current: Checkpointed<S>,
  stored: StoredEvent,
): Checkpointed<S> =>
  stored.position <= current.position
    ? current
    : { state: projection.apply(current.state, stored), position: stored.position }

// Weiterlesen ab dem Checkpoint, zum Beispiel nach einem Neustart
export const catchUp = async <S>(
  store: EventStore,
  projection: Projection<S>,
  current: Checkpointed<S>,
) =>
  (await store.readAll(current.position)).reduce(
    (acc, stored) => step(projection, acc, stored),
    current,
  )

// Neuaufbau: dieselbe Function, nur ab Position null
export const rebuild = <S>(store: EventStore, projection: Projection<S>) =>
  catchUp(store, projection, start(projection))
