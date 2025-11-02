import { createRouter, createWebHistory } from 'vue-router'
import Umbra from './pages/Umbra.vue'

const routes = [
  { path: '/', component: Umbra },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
