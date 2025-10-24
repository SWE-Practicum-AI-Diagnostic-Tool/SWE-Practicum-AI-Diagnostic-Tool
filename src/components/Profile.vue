<script>
import { getResponse } from '../genai.js'
import { useCookies } from "vue3-cookies";
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  name: 'Profile',
  components: {},
  data() {
    return {
      inputValue: '',
      response: '',
      inputCookie: '',
      loading: false,
      my_cookie_value: '',
      editMode: false,
      NewName: this.cookies.get("profileName") || '',
      crashingOut: this.cookies.get("crashOut") || 0,
      isShaking: false,
    }
  },
  methods: {
    async ask() {
      this.response = '';
      this.loading = true;
      try {
        const res = await getResponse(this.inputValue);
        // strip legacy mocked prefix if present so we don't echo the prompt
        let out = res;
        const prefix = 'Mocked response (client):';
        if (typeof out === 'string' && out.startsWith(prefix)) {
          out = out.slice(prefix.length).trim();
        }
        // Remove legacy 'OK — received your request.' wrapper if present
        const legacyOk = 'OK — received your request.';
        if (typeof out === 'string' && out.startsWith(legacyOk)) {
          out = out.slice(legacyOk.length).trim();
        }
        this.response = out;
      } catch (err) {
        this.response = 'Error: ' + (err?.message || String(err));
      } finally {
        this.loading = false;
      }
    },
    saveProfile(string) {
      // Placeholder function to save profile changes
      console.log('Profile saved as: ' + string);
      this.cookies.set("profileName", string, "7d");
    },
    editPage() {
      this.editMode = !this.editMode;
      if(!this.editMode)
        this.saveProfile(this.NewName);
    },
    crashOut() {
      this.crashingOut = Number(this.crashingOut) + 1;
      this.cookies.set("crashOut", this.crashingOut, "7d");
      //console.log("Crashouts: " + this.crashingOut);
      this.triggerEffect();
    },
    triggerEffect() {
      this.isShaking = true;
      setTimeout(() => {
        this.isShaking = false;
      }, 1000); // Effect lasts for 1 second
    },
  },
  mounted() {
    let my_cookie_value = this.cookies.get("myCoookie");
    console.log(my_cookie_value);
    let crashingOut = this.cookies.get("crashOut");
    console.log("Crashout value: " + crashingOut);
  }
});
</script>

<template>
    <!-- <div class="untree_co-section" data-aos="fade-up" data-aos-delay="0">
        <div class="home-body" >
          <input v-model="inputValue" id="input" type="text" placeholder="Ask the AI..." />
          <button id="submit" @click="ask" :disabled="loading">{{ loading ? 'Loading...' : 'Ask AI' }}</button>
      <div id="response">{{ response }}</div>
    </div>
    </div>
    <div data-aos="fade-up" data-aos-delay="0">
    <input v-model="inputCookie" id="input" type="text" placeholder="change Cookie" />
  <button id="submit" @click="cookies.set('myCoookie', inputCookie)">Set Cookie</button>
  </div>
  <div data-aos="fade-up" data-aos-delay="0">
  Current Cookie Value: {{ cookies.get("myCoookie") }}
  </div> -->
  <div class="untree_co-section" id="about-section">
    <div :class="{ shake: isShaking }">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
          <h2 class="heading">Profile Page</h2>
          <p>This is the profile page.</p>
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="0">
        <img src="" alt="Profile Image" />
        <p>Pofile Name: </p>
        <div>
          <p v-if="!editMode">{{ NewName }}</p>
          <input v-if="editMode" v-model="NewName" type="text" placeholder="Enter your name" />
        </div>
        <p>Email: </p>
        <div>
          <p>Email Goes Here</p>
        </div>
        <button v-on:click="editPage()">Edit Profile</button>
        <button v-on:click="crashOut" class="btn btn-success">Crash Out!</button>
        <h1>Crashouts: {{ crashingOut }}</h1>
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

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>