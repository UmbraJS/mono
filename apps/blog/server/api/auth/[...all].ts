import { getServerAuth } from '../../utils/auth' // path to your auth file

// export default defineEventHandler((event) => {
//   return auth.handler(toWebRequest(event))
// })

export default eventHandler(event => getServerAuth().handler(toWebRequest(event)))
