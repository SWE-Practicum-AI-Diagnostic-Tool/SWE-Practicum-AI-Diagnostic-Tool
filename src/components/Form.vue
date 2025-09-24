<!-- Form -->

<script setup>
import { FormSection } from './FormSection.vue'
</script>

<template>
  <div class="form-container">
    <form>
      <!-- Vehicle Make -->
      <FormSection title="Vehicle Make" />
      <!-- Vehicle Model -->
      <FormSection title="Vehicle Model" />
      <!-- Year of Manufacture -->
      <FormSection title="Year of Manufacture" />
      <!-- Mileage -->
      <FormSection title="Mileage" />
      <!-- Reported Issues -->
      <FormSection title="Reported Issues" />
      <!-- Additional Comments -->
      <FormSection title="Additional Comments" />
      <!-- Submit -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>