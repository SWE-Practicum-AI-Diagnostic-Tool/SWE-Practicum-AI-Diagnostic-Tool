import { reactive } from 'vue'
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

// Gives reactivity to frontend when logged in or logging out
export const store = reactive({
  loggedIn: cookies.get('loggedIn') === 'true',

  // We should not be doing this
  // Instead use authState.isAuthenticated from auth.js
  updateLoggedInStatus(status) {
    store.loggedIn = status;
    cookies.set('loggedIn', status);
  },
})