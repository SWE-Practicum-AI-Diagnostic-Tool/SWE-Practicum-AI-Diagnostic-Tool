<template>
    <header>
        AI Diagnostic Tool
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