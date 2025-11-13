/**
 * Better Auth client plugin for Convex integration
 *
 * This plugin adds a `token()` method to the auth client that fetches
 * a Convex authentication token from the Better Auth backend.
 */
export function convexClient() {
  return {
    id: 'convex',
    getActions: ($fetch: any) => {
      return {
        token: async () => {
          return $fetch('/convex/token', {
            method: 'POST',
          }) as Promise<{ data: { token: string } }>
        },
      }
    },
  }
}
