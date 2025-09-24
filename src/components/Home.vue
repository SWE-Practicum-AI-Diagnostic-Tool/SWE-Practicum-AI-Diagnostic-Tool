<script>
import NaviBar from './NaviBar.vue';
export default {
        methods:{
            goToForm(){
                this.$router.push('/form');
            }
        }
    }
</script>

<template>
    <header>
        <p> HELLO </p>
        <button v-on:click="goToForm">Go to Forum</button>
    </header>
</template>

<style>
</style>