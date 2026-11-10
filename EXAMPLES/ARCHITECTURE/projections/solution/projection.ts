import type { EventStore, StoredEvent } from '../src/event-store.ts'

// A projection is a fold with a checkpoint: state plus the last processed position.
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

// Idempotent: what has already been processed changes nothing anymore.
export const step = <S>(
  projection: Projection<S>,
  current: Checkpointed<S>,
  stored: StoredEvent,
): Checkpointed<S> =>
  stored.position <= current.position
    ? current
    : { state: projection.apply(current.state, stored), position: stored.position }

// Continue reading from the checkpoint, for example after a restart
export const catchUp = async <S>(
  store: EventStore,
  projection: Projection<S>,
  current: Checkpointed<S>,
) =>
  (await store.readAll(current.position)).reduce(
    (acc, stored) => step(projection, acc, stored),
    current,
  )

// Rebuild: the same function, just from position zero
export const rebuild = <S>(store: EventStore, projection: Projection<S>) =>
  catchUp(store, projection, start(projection))
