<script setup>
import { ref } from 'vue';
import FormSection from './FormSection.vue';
import { getVehicles } from '../vehicles.js';

// Example vehicle list — change or load dynamically as needed
const vehicles = ref([
  { id: 'veh1', label: 'Honda Civic (2018)' },
  { id: 'veh2', label: 'Toyota Corolla (2020)' },
  { id: 'veh3', label: 'Ford F-150 (2019)' },
]);

// const vehicles = ref(getVehicles().map((v, index) => ({
//   id: `veh${index + 1}`,
//   label: `${v.make || 'Unknown Make'} ${v.model || 'Unknown Model'} (${v.year || 'Unknown Year'})`
// })));

const selectedVehicle = ref('');
</script>

<template>
  <div class="form-container">
    <form>
      <!-- Select vehicle dropdown -->
      <div class="vehicle-select-group">
        <label for="select-vehicle" class="vehicle-label">Select vehicle</label>
        <select id="select-vehicle" v-model="selectedVehicle">
          <option value="" disabled>Select a vehicle...</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.label }}</option>
        </select>
      </div>

      <FormSection title="What's going on with your car?" required />

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
