import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw new Error('Missing id')

  const db = useDrizzle()

  const user = db.query.user.findFirst({
    where: eq(tables.user.id, id),
  })

  if (!user) throw new Error('User not found')
  return user
})
