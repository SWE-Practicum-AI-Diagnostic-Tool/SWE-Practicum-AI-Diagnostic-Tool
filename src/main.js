import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
console.log('[app] starting boot sequence')

app.use(vue3GoogleLogin, {
  clientId: '847728556581-8per6t3c7po36b8k1q3qko9nvjlg0fai.apps.googleusercontent.com'
})


app.use(router)

// --- Global error handlers -------------------------------------------------
// These catch runtime errors and unhandled promise rejections and log them to
// the browser console so the developer sees the real error instead of a
// blank page.
window.addEventListener('error', (event) => {
  // event.error may be undefined for some resource/script errors
  console.error('[window error] message:', event.message, 'source:', event.filename, 'lineno:', event.lineno, 'colno:', event.colno, 'error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandledrejection] reason:', event.reason);
});

// Vue-level error handlers to surface component/rendering errors
app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue error] info:', info, 'error:', err, 'component:', vm);
};

app.config.warnHandler = (msg, vm, trace) => {
  console.warn('[Vue warn] message:', msg, 'trace:', trace, 'component:', vm);
};

try {
  app.mount('#app')
  console.log('[app] mounted to #app')
} catch (err) {
  // surface any errors during mount so the browser console isn't empty
  console.error('[app] failed to mount', err)
  // rethrow so dev overlays or Sentry can still capture it if present
  throw err
}

