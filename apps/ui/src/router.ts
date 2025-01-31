import { createWebHistory, createRouter } from 'vue-router'
import CarbonBoard from './pages/CarbonBoard.vue'
import Typography from './pages/Typography.vue'
import Sizes from './pages/Sizes.vue'
import UI from './pages/UI.vue'
import Colors from './pages/Umbra.vue'

const routes = [
  { path: '/', component: CarbonBoard },
  { path: '/type', component: Typography },
  { path: '/sizes', component: Sizes },
  { path: '/ui', component: UI },
  { path: '/color', component: Colors },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
