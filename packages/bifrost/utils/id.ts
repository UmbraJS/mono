// Shared ID generation utility for Bifrost
// Uses crypto.randomUUID when available, falls back to Math.random
export function generateId(prefix: string) {
  const core = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2, 11)
  return `${prefix}-${core}`
}
