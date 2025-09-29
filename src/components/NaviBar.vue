<template>
    <header class="navi-header">
        <div class="title">AI Diagnostic Tool</div>
        <nav class="nav-buttons">
            <button @click="goToHome">Home</button>
            <button @click="goToSupport">Support</button>
            <button @click="goToForm">New Vehicle</button>
            <button @click="goToManageSolutions">Manage Solutions</button>
        </nav>
    </header>
</template>

<script>
export default {
    methods: {
        goToSupport() {},
        goToHome() {
            this.$router.push('/');
        },
        goToForm() {
            this.$router.push('/form');
        },
        goToManageSolutions() {
            this.$router.push('/manage-solutions');
        },
    },
};
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
}
.nav-buttons button:hover {
    background: #f2f2f2;
}
</style>
