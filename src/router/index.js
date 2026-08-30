import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Fundamental from '../views/Fundamental.vue'
import Arsitektur from '../views/Arsitektur.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/fundamental', component: Fundamental },
  { path: '/arsitektur', component: Arsitektur }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
