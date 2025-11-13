/**
 * Proxy all Better Auth requests through the Nuxt server
 * This ensures cookies work correctly by keeping everything on the same domain
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const convexUrl = config.public.convexSiteUrl

  if (!convexUrl || typeof convexUrl !== 'string') {
    throw createError({
      statusCode: 500,
      statusMessage: 'CONVEX_SITE_URL is not configured',
    })
  }

  const path = event.path.replace(/^\/api\/auth/, '/api/auth')

  // Handle /convex/token endpoint locally - don't forward to Convex
  if (path === '/api/auth/convex/token') {
    const cookies = getHeaders(event).cookie || ''
    const sessionToken = cookies
      .split(';')
      .find((c) => c.trim().startsWith('better-auth.session_token='))
      ?.split('=')[1]

    if (!sessionToken) {
      return { error: 'Unauthorized', data: null }
    }

    return { data: { token: decodeURIComponent(sessionToken) }, error: null }
  }

  // Forward the request to Convex
  const targetUrl = `${convexUrl}${path}`

  // Get request body if it exists
  let body: Record<string, unknown> | undefined
  if (event.method !== 'GET' && event.method !== 'HEAD') {
    body = await readBody(event).catch(() => undefined)
  }

  // Forward headers, transforming cookies for Convex compatibility
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(getHeaders(event))) {
    const lowerKey = key.toLowerCase()

    // Skip headers that should not be forwarded
    if (lowerKey === 'host' || lowerKey === 'accept-encoding' || !value) {
      continue
    }

    if (lowerKey === 'cookie') {
      // Add __Secure- prefix to session token for Convex
      const modifiedCookie = (Array.isArray(value) ? value[0] : value)
        .replace(/\bbetter-auth\.session_token=/g, '__Secure-better-auth.session_token=')
      headers[key] = modifiedCookie
    } else {
      headers[key] = Array.isArray(value) ? value[0] : value
    }
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method: event.method,
      headers,
      body,
      credentials: 'include',
    })

    // Forward response headers back to client
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()

      if (lowerKey === 'set-cookie') {
        // Modify cookies for localhost compatibility
        const modifiedCookie = value.toString()
          .replace('__Secure-', '') // Remove __Secure- prefix
          .replace(/; Secure/gi, '') // Remove Secure flag
          .replace(/Domain=[^;]+/gi, '') // Remove domain restrictions

        appendHeader(event, 'set-cookie', modifiedCookie)
      } else if (
        lowerKey !== 'transfer-encoding' &&
        lowerKey !== 'connection' &&
        lowerKey !== 'content-encoding'
      ) {
        // Skip encoding headers - let browser handle decompression
        setHeader(event, key, value)
      }
    })

    return response._data
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Auth proxy error',
    })
  }
})
