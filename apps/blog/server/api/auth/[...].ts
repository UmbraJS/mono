/**
 * Proxy all Better Auth requests through the Nuxt server
 * This ensures cookies work correctly by keeping everything on the same domain
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const convexUrl = config.public.convexSiteUrl || 'http://localhost:3000'

  // Get the path after /api/auth/ and prepend /api/auth back for Convex
  const path = event.path.replace(/^\/api\/auth/, '/api/auth')

  // Handle /convex/token endpoint locally - don't forward to Convex
  if (path === '/api/auth/convex/token') {
    // Get session token from cookies
    const cookies = getHeaders(event).cookie || ''
    const sessionToken = cookies
      .split(';')
      .find((c: string) => c.trim().startsWith('better-auth.session_token='))
      ?.split('=')[1]

    if (!sessionToken) {
      return { error: 'Unauthorized', data: null }
    }

    // Return the decoded session token
    return { data: { token: decodeURIComponent(sessionToken) }, error: null }
  }

  // Forward the request to Convex
  const targetUrl = `${convexUrl}${path}`

  // Get request body if it exists
  let body: any
  if (event.method !== 'GET' && event.method !== 'HEAD') {
    body = await readBody(event).catch(() => undefined)
  }

  // Forward all headers except host and encoding-related headers
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(getHeaders(event))) {
    const lowerKey = key.toLowerCase()
    if (lowerKey !== 'host' && lowerKey !== 'accept-encoding' && value) {
      if (lowerKey === 'cookie') {
        // Transform cookies back to what Convex expects
        // Add __Secure- prefix back for session token
        const modifiedCookie = (Array.isArray(value) ? value[0] : value)
          .replace(/\bbetter-auth\.session_token=/g, '__Secure-better-auth.session_token=')
        console.log('[Auth Proxy] Original cookie:', value)
        console.log('[Auth Proxy] Modified cookie for Convex:', modifiedCookie)
        headers[key] = modifiedCookie
      } else {
        headers[key] = Array.isArray(value) ? value[0] : value
      }
    }
  }

  // Log cookies being sent
  if (headers.cookie) {
    console.log('[Auth Proxy] Request cookies:', headers.cookie)
  }

  try {
    console.log('[Auth Proxy] Request:', event.method, targetUrl)

    const response = await $fetch.raw(targetUrl, {
      method: event.method,
      headers,
      body,
      // Include credentials to forward cookies
      credentials: 'include',
    })

    console.log('[Auth Proxy] Response status:', response.status)
    console.log('[Auth Proxy] Response headers:', response.headers)

    // Forward response headers
    // Note: response.headers is a Headers object, need to iterate properly
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        // Handle Set-Cookie specially to ensure it's set for localhost
        console.log('[Auth Proxy] Found set-cookie header:', value)

        // Modify cookie to work with localhost
        // Remove __Secure- prefix and Secure flag for local development
        const modifiedCookie = value.toString()
          .replace('__Secure-', '')
          .replace(/; Secure/gi, '')
          .replace(/Domain=[^;]+/gi, '') // Remove domain restriction

        console.log('[Auth Proxy] Modified cookie:', modifiedCookie)
        appendHeader(event, 'set-cookie', modifiedCookie)
      } else if (key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'connection' && key.toLowerCase() !== 'content-encoding') {
        // Skip transfer-encoding, connection, and content-encoding headers (let browser handle decompression)
        setHeader(event, key, value)
      }
    })

    return response._data
  } catch (error: any) {
    console.error('Auth proxy error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Auth proxy error',
    })
  }
})
