<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormSection from './FormSection.vue';
import { getVehicles } from '../vehicles.js';

const router = useRouter();

const vehicles = ref(getVehicles().map((v, index) => ({
  id: `${index}`,
  label: `${v.make || 'Unknown Make'} ${v.model || 'Unknown Model'} (${v.year || 'Unknown Year'})`,
  raw: v
}))); 

const selectedVehicle = ref('');
const issues = ref('');

const onSubmit = (e) => {
  e.preventDefault();
  if (!selectedVehicle.value) return alert('Please select a vehicle');

  // pass minimal data via query params (vehicle index and issues text)
  router.push({
    path: '/vehicle-help',
    query: {
      vehicleIndex: selectedVehicle.value,
      issues: issues.value
    }
  })
}
</script>

<template>
  <div class="form-container">
  <form @submit.prevent="onSubmit">
      <!-- Select vehicle dropdown -->
      <div class="vehicle-select-group">
        <label for="select-vehicle" class="vehicle-label">Select vehicle</label>
        <select id="select-vehicle" v-model="selectedVehicle">
          <option value="" disabled>Select a vehicle...</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.label }}</option>
        </select>
      </div>

      <FormSection
        title="What's going on with your car?"
        required
        v-model="issues"
      />

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

.vehicle-select-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.vehicle-label {
  margin-bottom: 0.4rem;
  font-weight: 600;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #bbb;
  background: white;
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
