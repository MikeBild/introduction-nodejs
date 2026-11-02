import { expect, test } from 'vitest'
import { initial, react, status } from '../solution/process.ts'
import { react as exercise } from '../src/process.ts'
test('cancellation waits for a late successful reservation',()=>{
  const cancelled = react(initial('a','automatic'),{type:'Cancel'}).state
  expect(status(cancelled)).toBe('COMPENSATING')
  const late = react(cancelled,{type:'Result',command:'ReserveStock',ok:true})
  expect(late.command).toBe('ReleaseReservation')
  expect(status(late.state)).toBe('COMPENSATING')
  const released = react(late.state,{type:'Result',command:'ReleaseReservation',ok:true})
  expect(released.command).toBe('CancelOrder')
  expect(react(released.state,{type:'Result',command:'CancelOrder',ok:true}).state.step).toBe('cancelled')
})
test('late payment authorization must be voided',()=>{
  const s = {...initial('a','automatic'),step:'authorizing' as const,abort:true}
  expect(react(s,{type:'Result',command:'AuthorizePayment',ok:true}).command).toBe('VoidAuthorization')
})
test('failed compensation cannot complete and the pivot rejects cancellation',()=>{
  expect(()=>react({...initial('a','automatic'),step:'releasing'},{type:'Result',command:'ReleaseReservation',ok:false})).toThrow()
  expect(()=>react({...initial('a','automatic'),step:'committing'},{type:'Cancel'})).toThrow('SeparateCancellationRequired')
})
test('starter explicitly identifies the unfinished exercise',()=>{
  expect(()=>exercise(initial('a','automatic'),{type:'Cancel'})).toThrow('TODO')
})
