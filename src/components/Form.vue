<!-- Form -->

<script setup>
import FormSection from './FormSection.vue'
</script>

<template>
  <div class="form-container">
    <form>
      <!-- Vehicle Make -->
      <FormSection title="Vehicle Make" required />
      <!-- Vehicle Model -->
      <FormSection title="Vehicle Model" required />
      <!-- Year of Manufacture -->
      <FormSection title="Year of Manufacture" required />
      <!-- Mileage -->
      <FormSection title="Mileage" required />
      <!-- Reported Issues -->
      <FormSection title="Reported Issues" required />
      <!-- Additional Comments -->
      <FormSection title="Additional Comments" />
      <!-- Submit -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

button {
  margin: 10px 10px;
  padding: 10px 30px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>