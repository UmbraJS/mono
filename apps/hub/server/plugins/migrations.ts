import { consola } from 'consola'
import { migrate } from 'drizzle-orm/d1/migrator'
import { getMigrations } from 'better-auth/db'

export default defineNitroPlugin(async () => {
  if (!import.meta.dev) return

  onHubReady(async () => {
    await migrate(useDrizzle(), {
      migrationsFolder: 'server/database/migrations',
    })
      .then(() => consola.success('Migrations complete'))
      .catch((e) => consola.error('Migrations failed', e))
  })
})

// export default defineNitroPlugin(() => {
//   if (!import.meta.dev) {
//     return
//   }
//   onHubReady(async () => {
//     const auth = serverAuth()
//     const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)
//     if (!toBeCreated.length && !toBeAdded.length) {
//       return
//     }
//     consola.info(`[better-auth] Database migrations will affect the following tables:`)

//     for (const table of [...toBeCreated, ...toBeAdded]) {
//       consola.log(`\`${table.table}\` table with ${Object.keys(table.fields).map(f => `\`${f}\``).join(', ')} fields.`)
//     }
//     await runMigrations()
//     consola.success('[better-auth] Database migrations ran successfully')
//   })
// })
