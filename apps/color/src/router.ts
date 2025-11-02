import { createRouter, createWebHistory } from 'vue-router'
import Umbra from './pages/Umbra.vue'
import Editor from './pages/Editor.vue'
import Themes from './pages/Themes.vue'
import Element from './pages/Element.vue'

const routes = [
  { path: '/', component: Umbra, name: 'Umbra' },
  { path: '/editor', component: Editor, name: 'Editor' },
  { path: '/themes', component: Themes, name: 'Themes' },
  { path: '/element', component: Element, name: 'Element' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
