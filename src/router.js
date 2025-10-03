import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'
import ManageSolutions from './components/ManageSolutions.vue'
import SolutionForm from './components/SolutionForm.vue'
import LoginView from './components/LoginPage.vue'
import VehicleSubmit from './components/VehicleSubmit.vue'
import VehicleHelp from './components/VehicleSubmit.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/manage-solutions', component: ManageSolutions },
  { path: '/solution-form', component: SolutionForm },
  { path: '/Login', component: LoginView },
  { path: '/vehicle-submit', component: VehicleSubmit},
  { path: '/vehicle-help', component: VehicleHelp}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
