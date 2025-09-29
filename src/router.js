import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'
import ManageSolutions from './components/ManageSolutions.vue'
import SolutionForm from './components/SolutionForm.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/manage-solutions', component: ManageSolutions },
  { path: '/solution-form', component: SolutionForm },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
