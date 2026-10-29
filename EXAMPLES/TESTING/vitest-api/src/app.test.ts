import { describe, test } from 'vitest'

// Exercise: test the shell through HTTP – createApp with vi.fn() for loadCatalog and saveOrder,
// started with `await using api = await listen(app)` (src/test-server.ts) and called with fetch.
describe('POST /orders', () => {
  test.todo('answers 201 with the saved order and calls saveOrder once with the placed order')
  test.todo('answers 422 with the rejection reason and never calls saveOrder')
  test.todo('answers 400 with field errors for an invalid body')
})
