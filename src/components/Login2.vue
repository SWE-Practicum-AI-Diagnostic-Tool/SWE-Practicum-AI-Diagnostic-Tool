<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { createAuth0Client } from '@auth0/auth0-spa-js'
import axios from 'axios'
import { store } from '../store.js'

const isAuthenticated = ref(false)
const user = ref({})
const apiResponse = ref('')
let auth0Client = null

// Initialize Auth0
onMounted(async () => {
  auth0Client = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    },
  });

  isAuthenticated.value = await auth0Client.isAuthenticated()
  if (isAuthenticated.value) {
    user.value = await auth0Client.getUser()
  }
})

// Login
async function login() {
  try {
    await auth0Client.loginWithPopup()
    user.value = await auth0Client.getUser()
    isAuthenticated.value = true
    createUser();
    console.log("Logged in as:", user.value.name);
    store.updateLoggedInStatus(true);
  } catch (err) {
    isAuthenticated.value = false
    console.error("Login failed:", err)
  }
}

// Logout
async function logout() {
  await auth0Client.logout({
    logoutParams: { returnTo: window.location.origin },
  })
  store.updateLoggedInStatus(false)
}

// Create account
async function createUser() {
  const token = await auth0Client.getTokenSilently({
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: 'openid profile email',
  });
  
  const res = await axios.get('http://localhost:3000/api/create-user', {
    headers: { authorization: `Bearer ${token}` },
  });

  console.log(res.data);
}
</script>


<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <div v-if="!isAuthenticated">
        <button @click="login">Login</button>
      </div>
    
      <div v-else>
        <p>✅ Logged in as <strong>{{ user.name }}</strong></p>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 350px;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.8rem;
  margin: 0.4rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
