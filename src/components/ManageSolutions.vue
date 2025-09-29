<template>
    <div class="manage-solutions-page">
        <main>
            <NaviBar />

            <section class="content">
                <!-- page content goes here -->
            </section>

            <!-- Left-side vertically centered button -->
            <button
                class="new-solution-btn"
                @click="goToSolutionForm"
                aria-label="Create new solution"
            >
                <span class="plus" aria-hidden="true">+</span>
                <span class="label">New Solution</span>
            </button>
        </main>
    </div>
</template>

<script>
import NaviBar from './NaviBar.vue';

export default {
    components: {
        NaviBar,
    },
    methods: {
        goToSolutionForm() {
            this.$router.push('/solution-form');
        },
    },
};
</script>

<style scoped>
/* Ensure page takes full height so vertical centering feels correct */
.manage-solutions-page {
    min-height: 100vh;
}

/* Content placeholder */
.content {
    padding: 1rem;
}

/* left-side vertically centered action button */
.new-solution-btn {
    position: fixed;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.9rem 1.1rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #ffffff;
    background: #0b70ff;
    border: none;
    border-radius: 999px;
    box-shadow: 0 6px 14px rgba(11, 112, 255, 0.18);
    cursor: pointer;
    z-index: 1100;
}

.new-solution-btn .plus {
    font-size: 1.4rem;
    line-height: 1;
    display: inline-block;
}

.new-solution-btn:hover {
    background: #075fe6;
}

.new-solution-btn:focus {
    outline: 3px solid rgba(11,112,255,0.25);
    outline-offset: 2px;
}
</style>
