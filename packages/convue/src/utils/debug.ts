const GLOBAL_FLAG = '__CONVUE_DEBUG__'

interface MaybeHasEnv {
  env?: Record<string, string | boolean | undefined>
}

function getGlobalFlag(): boolean | undefined {
  if (typeof globalThis === 'undefined')
    return undefined
  return (globalThis as Record<string, unknown>)[GLOBAL_FLAG] as boolean | undefined
}

function getProcessEnvFlag(): boolean | undefined {
  if (typeof process === 'undefined' || !process?.env)
    return undefined
  const value = process.env.CONVUE_DEBUG
  if (typeof value === 'undefined')
    return undefined
  return value === 'true'
}

function getImportMetaFlag(): boolean | undefined {
  try {
    const meta = import.meta as MaybeHasEnv
    const value = meta?.env?.VITE_CONVUE_DEBUG
    if (typeof value === 'undefined')
      return undefined
    return value === true || value === 'true'
  }
  catch {
    return undefined
  }
}

let cachedFlag: boolean | undefined

export function isConvueDebugEnabled(): boolean {
  if (cachedFlag !== undefined)
    return cachedFlag
  const fromGlobal = getGlobalFlag()
  if (fromGlobal !== undefined) {
    cachedFlag = fromGlobal
    return cachedFlag
  }
  const fromProcess = getProcessEnvFlag()
  if (fromProcess !== undefined) {
    cachedFlag = fromProcess
    return cachedFlag
  }
  const fromImportMeta = getImportMetaFlag()
  if (fromImportMeta !== undefined) {
    cachedFlag = fromImportMeta
    return cachedFlag
  }
  cachedFlag = false
  return cachedFlag
}

export function setConvueDebug(enabled: boolean): void {
  cachedFlag = enabled
  if (typeof globalThis !== 'undefined') {
    (globalThis as Record<string, unknown>)[GLOBAL_FLAG] = enabled
  }
}

export function debugLog(...args: unknown[]): void {
  if (!isConvueDebugEnabled())
    return
  console.warn(...args)
}
