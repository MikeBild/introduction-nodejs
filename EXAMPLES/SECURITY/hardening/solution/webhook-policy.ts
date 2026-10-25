// allowlist instead of blocklist: only https and only known hosts – no IPs, no localhost, no metadata service
export const isAllowedWebhookUrl = (url: URL, allowedHosts: ReadonlySet<string>) =>
  url.protocol === 'https:' &&
  url.username === '' &&
  url.port === '' &&
  allowedHosts.has(url.hostname)
