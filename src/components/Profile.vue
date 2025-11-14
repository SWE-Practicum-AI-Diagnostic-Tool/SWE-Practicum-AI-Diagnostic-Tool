<script>
import { defineComponent } from "vue";
import { store } from "../store.js";  // ✅ import store

export default defineComponent({
  name: "Profile",

  data() {
    return {
      editMode: false,
      isShaking: false,
      isShaking2: false,
     store,        // ✅ expose store to template
    };
  },

  computed: {
    user() {
      return store.user; // ✅ still reactive and available
    },
  },

  methods: {
    editPage() {
      this.editMode = !this.editMode;
    },

    crashOut() {
      store.user.crashingOut = Number(store.user.crashingOut || 0) + 1;
    },

    triggerEffect() {
      this.isShaking = true;
      setTimeout(() => (this.isShaking = false), 1000);
    },

    triggerEffect2() {
      this.isShaking2 = true;
      setTimeout(() => (this.isShaking2 = false), 1000);
    },
  },

  async mounted() {
    await store.loadUserFromDatabase(); // ✅ loads from DB once component mounts
  },
});
</script>




<template>
  <div class="untree_co-section" id="about-section">
    <div :class="{ shake: isShaking }">
      <div :class="{ shake2: isShaking2 }">
        <div class="container">
          <div class="row mb-4">
            <div class="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
              <h2 class="heading">Profile Page</h2>
              <p>This is the profile page.</p>
            </div>
          </div>

          <!-- ✅ safer rendering -->
<div v-if="user && user.name">
  <img src="" alt="Profile Image" />
  <p>Profile Name:</p>

  <div>
    <p v-if="!editMode">{{ user.name }}</p>
    <input v-if="editMode" v-model="user.name" />
  </div>

  <p>Email:</p>
  <p>{{ user.Email }}</p>

  <button @click="editPage">Edit Profile</button>
  <button @click="crashOut" class="btn btn-success">Crash Out!</button>

  <h1>Crashouts: {{ user.crashingOut }}</h1>
</div>

<!-- ✅ while loading -->
<div v-else>
  <p>Loading profile...</p>
</div>

        </div>
      </div>
    </div>
  </div>
</template>


<style>
.home-body {
  margin: 20px;
}
#input {
  padding: 8px;
  width: 60%;
  margin-right: 8px;
}
button#submit {
  padding: 8px 12px;
}
#response {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  min-height: 40px;
  white-space: pre-wrap;
}
.move-down {
  margin-top: 0px; /* moves it down by 50 pixels */
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.shake2 {
  animation: shake2 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-20px, 0, 0); }
  20%, 80% { transform: translate3d(40px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-80px, 0, 0); }
  40%, 60% { transform: translate3d(80px, 0, 0); }
}
@keyframes shake2 {
  10%, 90% { transform: translate3d(0, -20px, 0); }
  20%, 80% { transform: translate3d(0, 40px, 0); }
  30%, 50%, 70% { transform: translate3d(0, -80px, 0); }
  40%, 60% { transform: translate3d(0, 80px, 0); }
}
</style>