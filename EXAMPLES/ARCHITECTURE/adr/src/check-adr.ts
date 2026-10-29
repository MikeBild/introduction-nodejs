import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

// Prüfregeln für ADRs. Sie ersetzen kein Review, aber sie finden fehlende Abschnitte,
// Entscheidungen ohne „Wir werden …“ und Verweise auf Nachfolger, die es nicht gibt.

const sections = ['## Status', '## Context', '## Decision', '## Consequences']
const statuses = /^(Proposed|Accepted|Deprecated|Superseded by \[.+\]\((.+\.md)\))$/m

export const checkAdr = (file: string, text: string, siblings: string[]): string[] => {
  const name = basename(file)
  const problems: string[] = []
  if (!/^\d{4}-[a-z0-9-]+\.md$/.test(name)) problems.push(`${name}: Dateiname ohne Nummer`)
  if (!/^# \d+\. .+/m.test(text)) problems.push(`${name}: Titel ohne Nummer`)
  if (!/^Date: \d{4}-\d{2}-\d{2}$/m.test(text)) problems.push(`${name}: Datum fehlt`)
  for (const section of sections)
    if (!text.includes(`\n${section}\n`)) problems.push(`${name}: ${section.slice(3)} fehlt`)
  const status = text.split('## Status')[1]?.split('\n## ')[0] ?? ''
  const match = statuses.exec(status.trim().split('\n')[0] ?? '')
  if (!match) problems.push(`${name}: Status unbekannt`)
  if (match?.[2] && !siblings.includes(match[2]))
    problems.push(`${name}: Nachfolger ${match[2]} fehlt`)
  const decision = text.split('## Decision')[1]?.split('\n## ')[0] ?? ''
  if (!decision.includes('Wir werden')) problems.push(`${name}: Decision ohne „Wir werden …“`)
  const consequences = text.split('## Consequences')[1] ?? ''
  for (const part of ['Gut:', 'Schlecht:', 'Neu entscheiden, wenn'])
    if (!consequences.includes(part)) problems.push(`${name}: Consequences ohne „${part}“`)
  return problems
}

export const checkDirectory = (directory: string): string[] => {
  const files = readdirSync(directory).filter((f) => f.endsWith('.md') && !f.startsWith('0000'))
  return files.flatMap((file) => checkAdr(file, readFileSync(join(directory, file), 'utf8'), files))
}
