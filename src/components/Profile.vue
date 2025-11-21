<script>
import { getResponse, getUserData, setUserData } from '../apis.js'
import { useCookies } from "vue3-cookies";
import { defineComponent } from 'vue';
//import { fetchUserData } from '../auth.js';
import personPicture from "../assets/images/UntitledPerson.png";
import { C } from 'mermaid/dist/chunks/mermaid.esm.min/chunk-KXVH62NG.mjs';

export default defineComponent({
  // beforeRouteLeave(to, from) {
  //     setUserData({name: this.Name, email: this.Email, attitude: this.attitude, crashOut: this.crashingOut});
  // },
  beforeUnmount() {
      setUserData({name: this.Name, email: this.Email, attitude: this.attitude, crashOut: this.crashingOut});
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  name: 'Profile',
  components: {},
  data() {
    return {
      attitude: '',
      editMode: false,
      Name: '',
      crashingOut: 0,
      isShaking: false,
      isShaking2: false,
      Email: '',
      random: 0,
      userData: null,
      isRolling: false,
      personPhoto: personPicture,
    }
  },
  methods: {
    saveProfile(params) {
      // TODO: Save profile changes to database
      setUserData(params);
    },
    editPage() {
      this.editMode = !this.editMode;
      if (!this.editMode) this.saveProfile({name: this.Name, email: this.Email});
    },
    crashOut() {
      //this.crashingOut = Number(this.crashingOut) + 1;
      //this.cookies.set("crashOut", this.crashingOut);
      //console.log("Crashouts: " + this.crashingOut);
      this.random = Math.random();
      if (this.random < 0.5)
        this.triggerEffect2();
      else
      this.triggerEffect();
      //setUserData({crashOut: this.crashingOut});
    },
    triggerEffect() {
      this.isShaking = true;
      setTimeout(() => {
        this.isShaking = false;
      }, 1000); // Effect lasts for 1 second
    },
    triggerEffect2() {
      this.isShaking2 = true;
      setTimeout(() => {
        this.isShaking2 = false;
      }, 1000); // Effect lasts for 1 second
    },
    doBarrelRoll() {
      this.crashingOut = Number(this.crashingOut) + 1;
      this.cookies.set("crashOut", this.crashingOut);
      this.triggerEffect();
      this.triggerEffect2();
      this.isRolling = true;
      setTimeout(() => {
        this.isRolling = false;
      }, 1000); // matches the 1s animation duration
    },
    changeAttitude(newAttitude) {
      if(newAttitude == 1){
        this.attitude = "Novice";
      }
      else if(newAttitude == 2){
        this.attitude = "Hobbiest";
      }
      else if(newAttitude == 3){
        this.attitude = "Mechanic";
      }
      else if(newAttitude == 4){
        this.attitude = "Angry";
      }
      //setUserData({attitude: this.attitude});
    },
  },
  mounted() {
    let my_cookie_value = this.cookies.get("myCoookie");
    console.log(my_cookie_value);
  },
  async mounted() {
    const userData = await getUserData();
    this.Name = userData.name;
    this.Email = userData.email;
    this.attitude = userData.attitude;
    this.crashingOut = userData.crashOut || 0;
  },
});
</script>

<template>
  <div class="untree_co-section" id="about-section">
    <div class="untree_co-section" id="about-section" :class="{ 'barrel-roll': isRolling }">
    <div :class="{ shake: isShaking, shake2: isShaking2 }">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
          <h2 class="heading">Profile Page</h2>
          <p>This is the profile page.</p>
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="0" class="col-12 text-center">
        <img :src="personPhoto" alt="Profile Image" />
        <p>Pofile Name: </p>
        <div>
          <p v-if="!editMode">{{ Name }}</p>
          <input v-if="editMode" v-model="Name" type="text" placeholder="Enter your name" />
        </div>
        <p>Email: </p>
        <div>
          <p v-if="!editMode">{{ Email }}</p>
          <input v-if="editMode" v-model="Email" type="text" placeholder="Enter your email" />
        </div>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ attitude || 'Select Attitude' }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" v-on:click="changeAttitude(1)">Novice</a>
            <a class="dropdown-item" v-on:click="changeAttitude(2)">Hobbiest</a>
            <a class="dropdown-item" v-on:click="changeAttitude(3)">Mechanic</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" v-on:click="changeAttitude(4)">Angry</a>
          </div>
        </div>
        <button v-on:click="editPage()">Edit Profile</button>
        <button v-on:click="crashOut" class="btn btn-success">Crash Out!</button>
        <h1>Crashouts: {{ crashingOut }}</h1>
        <button @click="doBarrelRoll" class="btn btn-secondary">Do a Barrel Roll!</button>
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

@keyframes barrelRoll {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.barrel-roll {
  animation: barrelRoll 1s linear;
}
</style>