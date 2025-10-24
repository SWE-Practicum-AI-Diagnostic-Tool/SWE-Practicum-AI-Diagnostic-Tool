import { reactive } from 'vue'
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

export const store = reactive({
  loggedIn: cookies.get('loggedIn') === 'true',

  updateLoggedInStatus(status) {
    store.loggedIn = status;
    cookies.set('loggedIn', status);
  },
  logOut(){
    store.loggedIn = false;
    cookies.set('loggedIn', false);
  }
})