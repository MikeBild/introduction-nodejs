import type { RequestHandler } from 'express'

// the few headers that matter for a JSON API – no extra package needed
export const securityHeaders: RequestHandler = (req, res, next) => {
  res.set({
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
    'referrer-policy': 'no-referrer',
    'cross-origin-resource-policy': 'same-origin',
  })
  next()
}
