import { createMemoryHistory, createRouter } from 'vue-router'

// Import the need page
import HomeView from './components/Home.vue'
import FormView from './components/Form.vue'

// This is need to create more routes
// Create new path and put 
const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router