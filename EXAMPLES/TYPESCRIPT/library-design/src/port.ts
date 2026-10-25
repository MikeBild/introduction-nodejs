export type PortError =
  { kind: 'not-a-number'; input: string } | { kind: 'out-of-range'; port: number }

export type PortResult = { ok: true; value: number } | { ok: false; error: PortError }

export const parsePort = (input: string): PortResult => {
  const port = Number(input)
  if (!Number.isInteger(port)) return { ok: false, error: { kind: 'not-a-number', input } }
  if (port < 1 || port > 65_535) return { ok: false, error: { kind: 'out-of-range', port } }
  return { ok: true, value: port }
}
