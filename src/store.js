import { reactive } from 'vue';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

// ✅ API wrapper must be ABOVE the store declaration
async function fetchUser(userId) {
  const res = await fetch(`http://localhost:3000/user/${encodeURIComponent(userId)}`);



  if (!res.ok) throw new Error(`Failed to fetch user with id ${userId}`);

  return await res.json();
}

// ✅ Global Store
export const store = reactive({
  loggedIn: cookies.get('loggedIn') === 'true',

  user: {
    id: cookies.get("userId") || null,
    name: "",
    email: "",
  },

  async loadUserFromDatabase() {
    if (!this.user.id) {
      console.warn("No userId found in cookies.");
      return;
    }

    try {
      const userData = await fetchUser(this.user.id);

      // ✅ Correct update of reactive object
      Object.assign(this.user, userData);

      cookies.set("userId", this.user.id);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  },

  updateLoggedInStatus(status) {
    this.loggedIn = status;
    cookies.set('loggedIn', status);
  },
  updateUserID(){
    store.id = getUserID();
    cookies.set('userID', store.id);
  }

});

