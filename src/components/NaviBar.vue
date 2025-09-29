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
