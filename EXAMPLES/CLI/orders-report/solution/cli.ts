#!/usr/bin/env node
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { addAbortSignal } from 'node:stream'
import { parseArgs } from 'node:util'
import { createLogger } from '../src/logger.ts'
import {
  formatOrders,
  isHeaderLine,
  isOutputFormat,
  parseOrderLine,
  type Order,
} from '../src/report.ts'

const usage = 'usage: orders-report [file|-] [--format json|csv] [--limit n] [--verbose]'

const parseCliArguments = () => {
  try {
    return parseArgs({
      options: {
        format: { type: 'string', short: 'f', default: 'json' },
        limit: { type: 'string', short: 'l', default: '10' },
        verbose: { type: 'boolean', short: 'v', default: false },
      },
      allowPositionals: true,
    })
  } catch (error) {
    console.error(`${(error as Error).message}\n${usage}`)
    return undefined
  }
}

const parseLimit = (value: string) => {
  const limit = Number(value)
  return Number.isInteger(limit) && limit > 0 ? limit : undefined
}

const cliArguments = parseCliArguments()
const outputFormat = cliArguments?.values.format ?? ''
const orderLimit = parseLimit(cliArguments?.values.limit ?? '')

if (!cliArguments || !isOutputFormat(outputFormat) || orderLimit === undefined) {
  if (cliArguments) console.error(`invalid --format or --limit\n${usage}`)
  process.exitCode = 2
} else {
  const logger = createLogger(cliArguments.values.verbose ? 'debug' : 'warn', {
    cli: 'orders-report',
  })
  const [inputFile = '-'] = cliArguments.positionals
  const abortController = new AbortController()
  process.once('SIGINT', () => abortController.abort())

  const input = addAbortSignal(
    abortController.signal,
    inputFile === '-' ? process.stdin : createReadStream(inputFile),
  )
  const orders: Order[] = []
  let lineNumber = 0

  try {
    for await (const line of createInterface({ input, crlfDelay: Infinity })) {
      lineNumber += 1
      if (line.trim() === '' || isHeaderLine(line)) continue
      const parsedLine = parseOrderLine(line)
      if (parsedLine.ok) orders.push(parsedLine.order)
      else logger.warn('line skipped', { line: lineNumber, reason: parsedLine.reason })
      if (orders.length >= orderLimit) break
    }
    process.stdout.write(`${formatOrders(orders, outputFormat)}\n`)
  } catch (error) {
    if (abortController.signal.aborted) {
      logger.warn('aborted', { order_count: orders.length })
      process.exitCode = 130
    } else {
      logger.error('cannot read input', { reason: (error as Error).message })
      process.exitCode = 1
    }
  }
}
