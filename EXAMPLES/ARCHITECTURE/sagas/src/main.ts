import { onOrderPlaced, recordingServices } from './checkout.ts'

const { services, calls } = recordingServices(true)
await onOrderPlaced(services, 'o-1', 2580).catch((error: Error) => console.info(error.message))
console.info('Aufrufe:', calls)
