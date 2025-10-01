import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)


app.use(vue3GoogleLogin, {
  clientId: '847728556581-8per6t3c7po36b8k1q3qko9nvjlg0fai.apps.googleusercontent.com'
})


app.use(router)


app.mount('#app')

