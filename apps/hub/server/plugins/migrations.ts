import { consola } from 'consola'
import { migrate } from 'drizzle-orm/d1/migrator'

export default defineNitroPlugin(async () => {
  if (!import.meta.dev) return

  // onHubReady(async () => {
  //   await migrate(useDrizzle(), {
  //     migrationsFolder: 'server/database/migrations',
  //   })
  //     .then(() => consola.success('Migrations complete'))
  //     .catch((e) => consola.error('Migrations failed', e))
  // })
})
