import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'
import ManageSolutions from './components/ManageSolutions.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/manage-solutions', component: ManageSolutions },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
