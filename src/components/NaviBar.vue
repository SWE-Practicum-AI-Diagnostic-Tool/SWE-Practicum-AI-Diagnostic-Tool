<script setup>
import { themeColor, siteName } from "../data/items";
import { RouterLink } from 'vue-router';
// import { store } from '../store.js'
import { logout, authState } from '../auth.js'
import { watch } from 'vue'
import { ref } from 'vue'

</script>
<template>
  <nav class="site-nav dark js-site-navbar mb-5 site-navbar-target">
    <div class="container">
      <div class="site-navigation">
        <RouterLink to="/" class="logo m-0 float-left">
          {{ siteName }}<span class="text-primary">.</span>
        </RouterLink>
        <ul class="js-clone-nav d-none d-lg-inline-block site-menu float-left">
          <li class="active">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li><RouterLink to="/features" class="nav-link">Features</RouterLink></li>
          <li><RouterLink to="/aboutus" class="nav-link">About us</RouterLink></li>
          <li><RouterLink to="/service1" class="nav-link">Try it Out</RouterLink></li>
        </ul>
        <ul
          class="js-clone-nav 
          -none mt-1 d-lg-inline-block site-menu float-right"
        >
        <label class="switch">
          <input type="checkbox" v-model="enabled">
          <span class="slider round"></span>
        </label>
        <li class="cta-button-outline" style="margin-right: 5px;">
            <RouterLink v-if="!lI" to="/login">Login</RouterLink>
          </li>
          <li class="cta-primary">
            <RouterLink v-if="!lI" to="/register" :style="[{ backgroundColor: themeColor }]">Register</RouterLink>
          </li>
          <li class="cta-button-outline" style="margin-right: 5px;">
            <RouterLink v-if="lI" to="/profile" class="nav-link">Profile Test</RouterLink>
          </li>
          <li class="cta-primary">
            <RouterLink v-if="lI" @click="loggingOut()" to="/" :style="[{ backgroundColor: themeColor }]">log Out</RouterLink>
          </li>
        </ul>
        <a
          href="#"
          class="burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block dark d-lg-none"
          data-toggle="collapse"
          data-target="#main-navbar"
        >
          <span></span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    lI() {
      return authState.isAuthenticated
    }
  },
  methods: {
    loggingOut() {
      logout();
    }
  }
}

const enabled = ref(false)

watch(enabled, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
  console.log("Toggle changed:", newValue)
})
</script>


<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>