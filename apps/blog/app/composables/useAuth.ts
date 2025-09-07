export function useAuth() {
  const session = ref(null)
  const user = ref(null)
  const client = {}
  return {
    session,
    user,
    loggedIn: computed(() => false),
  signIn: { email: async () => ({ error: null }), social: async () => ({ error: null }) },
  signUp: { email: async () => ({ error: null }) },
    async signOut() { return { ok: true } },
    options: {},
    fetchSession: async () => ({ data: null }),
    client,
  }
}
