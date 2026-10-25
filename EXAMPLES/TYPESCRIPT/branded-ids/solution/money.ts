import type { Brand } from '../src/brand.ts'

export type Cents = Brand<number, 'Cents'>
export type Euro = Brand<number, 'Euro'>
export type Email = Brand<string, 'Email'>

export const toEuro = (amount: number): Euro => {
  if (!Number.isFinite(amount) || amount < 0) throw new Error(`Invalid Euro amount: ${amount}`)
  return amount as Euro
}

export const toCents = (euro: Euro): Cents => Math.round(euro * 100) as Cents

export const addVat = (net: Cents, rate: number): Cents => Math.round(net * (1 + rate)) as Cents

export const formatCents = (cents: Cents): string => `${(cents / 100).toFixed(2)} EUR`

export const toEmail = (raw: string): Email => {
  const normalized = raw.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error(`Invalid Email: ${raw}`)
  return normalized as Email
}
