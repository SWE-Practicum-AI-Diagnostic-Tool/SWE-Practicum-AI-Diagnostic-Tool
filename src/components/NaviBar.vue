<template>
    <header class="navi-header">
        <div class="title">AI Diagnostic Tool</div>
        <nav class="nav-buttons">
            <button @click="goToHome">Home</button>
            <button @click="goToLogin">Login</button>
            <button @click="goToSupport">Support</button>
            <button @click="goToForm">New Vehicle</button>
            <button @click="goToManageSolutions">Manage Solutions</button>

        </nav>
    </header>
 <div>
    <button v-on:click="goToHome"> Home </button>
 </div>
 <div>
    <button v-on:click="goToSupport"> Support </button>
 </div>
 <div>
    <button v-on:click="goToForm"> Form </button>
 </div>
 <div>
    <button v-on:click="goToLogin"> Login </button>
 </div>
</template>

<script>
    export default {
        methods: {
            goToSupport(){
            },
            goToHome(){
                this.$router.push('/');
            },
            goToForm(){
                this.$router.push('/form')
            },
            goToLogin(){
                this.$router.push('/Login')
            }
        }
    }
</script>


<style>
</style>
