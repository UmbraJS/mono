export function useAuth() {
  const session = ref(null)
  const user = ref(null)
  const client = {
    async signOut() { return { ok: true } },
    async deleteUser() { return { ok: true } },
    async listAccounts() { return { data: [] as Array<{ provider: string }> } },
    async linkSocial(_opts: { provider: string }) { return { ok: true } },
  }
  return {
    session,
    user,
    loggedIn: computed(() => false),
    signIn: { email: async () => ({ error: null }), social: async () => ({ error: null }) },
    signUp: { email: async () => ({ error: null }) },
    async signOut() { return client.signOut() },
    options: {},
    fetchSession: async () => ({ data: null }),
    client,
  }
}
