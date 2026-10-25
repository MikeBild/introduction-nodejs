#!/usr/bin/env node
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { parseArgs } from 'node:util'
import { createLogger } from './logger.ts'
import { formatOrders, isHeaderLine, isOutputFormat, parseOrderLine, type Order } from './report.ts'

const usage = 'usage: orders-report [file|-] [--format json|csv] [--verbose]'

const parseCliArguments = () => {
  try {
    return parseArgs({
      options: {
        format: { type: 'string', short: 'f', default: 'json' },
        verbose: { type: 'boolean', short: 'v', default: false },
      },
      allowPositionals: true,
    })
  } catch (error) {
    console.error(`${(error as Error).message}\n${usage}`)
    return undefined
  }
}

const cliArguments = parseCliArguments()
const outputFormat = cliArguments?.values.format ?? ''

if (!cliArguments || !isOutputFormat(outputFormat)) {
  if (cliArguments) console.error(`unknown format "${outputFormat}"\n${usage}`)
  process.exitCode = 2
} else {
  const logger = createLogger('orders-report', cliArguments.values.verbose ? 'debug' : 'warn')
  const [inputFile = '-'] = cliArguments.positionals
  const input = inputFile === '-' ? process.stdin : createReadStream(inputFile)
  const orders: Order[] = []
  let lineNumber = 0

  try {
    logger.debug(`reading from ${inputFile === '-' ? 'stdin' : inputFile}`)
    for await (const line of createInterface({ input, crlfDelay: Infinity })) {
      lineNumber += 1
      if (line.trim() === '' || isHeaderLine(line)) continue
      const parsedLine = parseOrderLine(line)
      if (parsedLine.ok) orders.push(parsedLine.order)
      else logger.warn(`line ${lineNumber} skipped: ${parsedLine.reason}`)
    }
    logger.info(`${orders.length} orders read`)
    process.stdout.write(`${formatOrders(orders, outputFormat)}\n`)
  } catch (error) {
    logger.error(`cannot read input: ${(error as Error).message}`)
    process.exitCode = 1
  }
}
