<script setup>
import { themeColor, siteName } from "../data/items";
import { RouterLink } from 'vue-router';
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
          <li><RouterLink to="/profile" class="nav-link">Profile Test</RouterLink></li>
        </ul>
        <ul
          class="js-clone-nav 
          -none mt-1 d-lg-inline-block site-menu float-right"
        >
          <li class="cta-button-outline" style="margin-right: 5px;"><RouterLink to="/login">Login</RouterLink></li>
          <li class="cta-primary">
            <a href="#" :style="[{ backgroundColor: themeColor }]">Register</a>
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
