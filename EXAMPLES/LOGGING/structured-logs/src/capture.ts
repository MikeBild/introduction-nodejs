import { vi } from 'vitest'

// test helper: collects every console.log line instead of printing it
export const captureLogLines = () => {
  const lines: string[] = []
  vi.spyOn(console, 'log').mockImplementation((line: unknown) => void lines.push(String(line)))
  return {
    lines,
    entries: () => lines.map((line) => JSON.parse(line) as Record<string, unknown>),
  }
}
