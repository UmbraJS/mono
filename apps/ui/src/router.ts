import { createWebHistory, createRouter } from 'vue-router'
import CarbonBoard from './pages/CarbonBoard.vue'
import Typography from './pages/Typography.vue'
import Sizes from './pages/Sizes.vue'
import UI from './pages/UI.vue'

const routes = [
  { path: '/', component: CarbonBoard },
  { path: '/type', component: Typography },
  { path: '/sizes', component: Sizes },
  { path: '/ui', component: UI }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
