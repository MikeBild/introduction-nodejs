export type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: readonly string[] }
  | { status: 'error'; message: string }

export type ErrorState = Extract<LoadState, { status: 'error' }>
export type SuccessState = Extract<LoadState, { status: 'success' }>

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected case: ${JSON.stringify(value)}`)
}

export const render = (state: LoadState): string => {
  switch (state.status) {
    case 'idle':
      return 'Nothing loaded yet'
    case 'loading':
      return 'Loading'
    case 'success':
      return state.data.join(', ')
    case 'error':
      return `Error: ${state.message}`
    default:
      return assertNever(state)
  }
}

export const icon = (state: LoadState): string => {
  switch (state.status) {
    case 'idle':
      return 'circle'
    case 'loading':
      return 'spinner'
    case 'success':
      return 'check'
    case 'error':
      return 'alert'
    default:
      return assertNever(state)
  }
}

export const isError = (state: LoadState): state is ErrorState => state.status === 'error'
export const isSuccess = (state: LoadState): state is SuccessState => state.status === 'success'

export const loadedItems = (states: readonly LoadState[]): readonly string[] =>
  states.filter(isSuccess).flatMap((state) => state.data)
