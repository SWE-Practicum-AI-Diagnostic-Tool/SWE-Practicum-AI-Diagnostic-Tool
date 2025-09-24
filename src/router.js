import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router