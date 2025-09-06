export function isFunc<T extends (...args: any) => any>(val: unknown): val is T {
  return typeof val === 'function'
}
