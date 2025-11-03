import { reactive } from 'vue'
import { useCookies } from 'vue3-cookies';
import { getUserID } from './auth.js';

const { cookies } = useCookies();

// Gives reactivity to frontend when logged in or logging out
export const store = reactive({
  loggedIn: cookies.get('loggedIn') === 'true',
  ID: cookies.get('userID') || null,

  updateLoggedInStatus(status) {
    store.loggedIn = status;
    cookies.set('loggedIn', status);
  },
  updateUserID() {
    store.ID = getUserID();
    cookies.set('userID', store.ID);
  }

})