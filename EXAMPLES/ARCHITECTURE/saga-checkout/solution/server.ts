import { createServer } from 'node:http'
import { setTimeout } from 'node:timers/promises'
import { migrate, pool } from './store.ts'
import { request } from './api.ts'
import { tick } from './worker.ts'
import { expireReservations } from './participants.ts'
import { react } from './process.ts'
export async function serve(reducer = react) {
  await migrate()
  let running = true
  const server = createServer(async (req,res) => {
    if (req.method !== 'POST' || req.url !== '/graphql') { res.writeHead(404).end(); return }
    try {
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (Buffer.byteLength(body)>16_384) { res.writeHead(413).end(); return }
      }
      const data = JSON.parse(body)
      const result = await request(data.query,data.variables,reducer)
      res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify(result))
    } catch { res.writeHead(400).end('Invalid request') }
  })
  server.listen(4300,'127.0.0.1',()=>console.log('GraphQL: http://127.0.0.1:4300/graphql'))
  const worker = (async () => {
    while (running) {
      try { await expireReservations(); if (!await tick({},reducer)) await setTimeout(200) }
      catch (e) { console.error(e instanceof Error ? e.message : 'worker failure'); await setTimeout(1000) }
    }
  })()
  const stop = async () => { running=false; server.close(); await worker; await pool.end() }
  process.once('SIGINT',()=>void stop()); process.once('SIGTERM',()=>void stop())
}
