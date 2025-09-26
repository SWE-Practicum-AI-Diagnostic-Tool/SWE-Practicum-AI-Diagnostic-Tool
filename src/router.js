import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'
import LoginView from './components/LoginPage.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/Login', component: LoginView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router