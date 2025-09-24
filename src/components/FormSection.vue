<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="form-group">
    <label :for="title">{{ title }}</label>
    <input type="text" :id="title" :name="title" required />
  </div>
</template>