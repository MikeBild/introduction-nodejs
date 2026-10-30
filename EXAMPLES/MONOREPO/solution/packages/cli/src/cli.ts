#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { Orders } from '@shop/domain'
import { report } from './report.ts'

const { positionals } = parseArgs({ allowPositionals: true })
const [command, file] = positionals

if (command !== 'total' || !file) {
  console.error('usage: shop total <orders.json>')
  process.exitCode = 2
} else {
  // npm exec -w starts in the workspace folder, INIT_CWD is the folder you called npm from
  const path = resolve(process.env.INIT_CWD ?? process.cwd(), file)
  const orders = Orders.parse(JSON.parse(await readFile(path, 'utf8')))
  console.log(report(orders))
}
