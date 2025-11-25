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

    // Try to get the session token from cookies
    const sessionToken = cookies
      .split(';')
      .map(c => c.trim())
      .find((c) => c.startsWith('better-auth.session_token='))
      ?.split('=')[1]

    if (!sessionToken) {
      return { error: 'Unauthorized', data: null }
    }

    // Return the decoded session token - Convex + Better Auth expects this
    return { data: { token: decodeURIComponent(sessionToken) } }
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
      // Forward cookies as-is (Better Auth handles __Secure- prefix based on environment)
      headers[key] = Array.isArray(value) ? value[0] : value
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
      redirect: 'manual', // Don't follow redirects automatically
    })

    // Handle redirects from Convex
    const locationHeader = response.headers.get('location')
    if (locationHeader && (response.status === 301 || response.status === 302 || response.status === 303 || response.status === 307 || response.status === 308)) {
      // Forward all set-cookie headers first (there may be multiple)
      const setCookieHeaders = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get('set-cookie')].filter(Boolean)

      for (const cookieHeader of setCookieHeaders) {
        if (cookieHeader) {
          const modifiedCookie = cookieHeader
            .replace(/__Secure-/g, '') // Remove __Secure- prefix
            .replace(/; Secure/gi, '') // Remove Secure flag
            .replace(/;\s*Domain=[^;]+/gi, '') // Remove domain restrictions

          appendHeader(event, 'set-cookie', modifiedCookie)
        }
      }

      // Return redirect to the client
      return sendRedirect(event, locationHeader, response.status)
    }

    // Forward response headers back to client
    // Handle set-cookie headers specially (there may be multiple)
    const setCookieHeaders = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get('set-cookie')].filter(Boolean)

    for (const cookieHeader of setCookieHeaders) {
      if (cookieHeader) {
        const modifiedCookie = cookieHeader
          .replace(/__Secure-/g, '') // Remove __Secure- prefix
          .replace(/; Secure/gi, '') // Remove Secure flag
          .replace(/;\s*Domain=[^;]+/gi, '') // Remove domain restrictions

        appendHeader(event, 'set-cookie', modifiedCookie)
      }
    }

    // Forward other headers
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()

      if (
        lowerKey !== 'set-cookie' && // Already handled above
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
