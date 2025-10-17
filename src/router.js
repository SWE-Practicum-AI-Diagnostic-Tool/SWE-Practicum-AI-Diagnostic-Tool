import { createRouter, createWebHistory } from 'vue-router';

import FormView from './components/Form.vue';
import VehicleSubmit from './components/VehicleSubmit.vue';
import VehicleHelp from './components/VehicleHelp.vue';
import Profile from './components/Profile.vue';
import Home from './components/Home.vue';
import VehicleInfo from './components/VehicleInfo.vue';
import ProblemDesc from './components/ProblemDesc.vue';
import Features from './components/Features.vue';
import Login from './components/Login.vue';
import AboutUs from './components/AboutUs.vue';
import Register from './components/NewUser.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/service1', name: 'Service1', component: VehicleInfo },
  { path: '/problemdescription', name: 'ProblemDescription', component: ProblemDesc },
  { path: '/features', name: 'Features', component: Features },
  { path: '/login', name: 'Login', component: Login },
  { path: '/aboutus', name: 'AboutUs', component: AboutUs },
  { path: '/form', component: FormView },
  { path: '/vehicle-submit', component: VehicleSubmit},
  { path: '/vehicle-help', component: VehicleHelp},
  { path: '/profile', component: Profile},
  { path: '/register', component: Register}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
