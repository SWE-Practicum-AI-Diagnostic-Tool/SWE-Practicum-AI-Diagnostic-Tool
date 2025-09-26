<template>
    <div>
        <main>
            <NaviBar />
        </main>
    <header>
        <p> HELLO </p>
        <button v-on:click="goToForm">Go to Forum</button>
    </header>
    </div>
</template>

<script>
import NaviBar from './NaviBar.vue';
export default {
    components: {
        NaviBar   
    },
        methods:{
            goToForm(){
                this.$router.push('/form');
            }
        }
    }
</script>

<style>
</style>