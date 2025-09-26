import { createRouter, createWebHistory } from 'vue-router'
import Form from '../components/Form.vue'
import LoginPage from '../components/LoginPage.vue'

const routes = [
  { path: '/', component: Form },            // original Form at root
  { path: '/login', component: LoginPage }   // login page
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
