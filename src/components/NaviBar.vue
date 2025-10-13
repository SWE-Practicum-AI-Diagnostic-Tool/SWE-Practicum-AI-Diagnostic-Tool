<template>
    <header class="navi-header">
        <div class="title">AI Diagnostic Tool</div>
        <button @click="LoginPage">Login Status: {{loggedIn}}</button>
        <nav class="nav-buttons">
            <button @click="goToHome">Home</button>
            <button v-if="loggedIn" @click="goToLogin">Login</button>
            <button v-if="!loggedIn" @click="goToProfile">Profile</button>
            <button @click="goToSupport">Contact Us!</button>
            <button @click="goToForm">New Vehicle</button>
            <button @click="goToManageSolutions">Manage Solutions</button>
        </nav>
    </header>
</template>

<script>
import { useCookies } from "vue3-cookies";
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { cookies } = useCookies();
        return { cookies };
    },
    data(){
        return{
            loggedIn: this.cookies.get("ShowProfile") === "true" ? true : false
        }
    },
    methods: {
        goToSupport() {
            this.$router.push('/Support');
        },
        goToHome() {
            this.$router.push('/');
        },
        goToForm() {
            this.$router.push('/form');
        },
        goToManageSolutions() {
            this.$router.push('/manage-solutions');
        },
        goToLogin(){
          this.$router.push('/Login')
        },
        goToProfile(){
            this.$router.push('/Profile')
        },
        LoginPage(){
            if(this.loggedIn == false)
                this.cookies.set("ShowProfile", "true");
            else{
                this.cookies.set("ShowProfile", "false");
            }
        }
    },
    mounted() {
    let loggedIn = this.cookies.get("ShowProfile");
    console.log(loggedIn);
    }
});
</script>


<style scoped>
/* Horizontal button layout */
.navi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    gap: 1rem;
}
.title {
    font-weight: 600;
}
.nav-buttons {
    display: flex;
    gap: 0.5rem; /* spacing between buttons */
    align-items: center;
}
.nav-buttons button {
    padding: 0.4rem 0.75rem;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
    color: black;
}
.nav-buttons button:hover {
    background: #f2f2f2;
}
</style>
