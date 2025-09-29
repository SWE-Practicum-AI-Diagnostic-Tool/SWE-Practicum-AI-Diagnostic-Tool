<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="form-group">
    <label :for="title">{{ title }}</label>
    <input type="text" :id="title" :name="title" :required="required" />
  </div>
</template>

<style scoped>
.form-group {
  margin: 15px 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.form-group input:focus {
  border-color: #007BFF;
  outline: none;
}
</style>