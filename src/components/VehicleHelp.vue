<script setup>
import NaviBar from "./NaviBar.vue";
import { useRoute } from "vue-router";
import { getResponse } from "../genai.js";
import { getVehicles } from "../vehicles.js";
import { ref, onMounted } from 'vue';

const route = useRoute();
const details = route.query || {};

const vehicles = getVehicles();
const vehicleIndex = Number(details.vehicleIndex);
const vehicle = vehicles[vehicleIndex] || {};
const issues = details.issues || "No issues provided";

const aiOutput = ref('');
const loading = ref(false);
const error = ref(null);

const formatField = (val, placeholder = "None") => {
  if (val === undefined || val === null) return placeholder;
  if (typeof val === "string") {
    return val.trim() === "" ? placeholder : val;
  }
  if (typeof val === "number") return isNaN(val) ? placeholder : String(val);
  return String(val);
};

const getFeedback = async () => {
  loading.value = true;
  error.value = null;
  const prompt = `Provide feedback on the following vehicle information. Suggest any missing or potentially incorrect details that could improve the accuracy of a vehicle diagnosis. Be concise and specific.\nVehicle Information:\nMake: ${formatField(vehicle.make)}\nModel: ${formatField(vehicle.model)}\nYear: ${formatField(vehicle.year)}\nMileage: ${formatField(vehicle.mileage)}\nEngine: ${formatField(vehicle.engine)}\nTransmission: ${formatField(vehicle.transmission)}\nTrim: ${formatField(vehicle.trim)}\nBody Style: ${formatField(vehicle.bodystyle)}\nIssues: ${formatField(issues)}\n\nFeedback:`;
  try {
    const resp = await getResponse(prompt);
    aiOutput.value = resp || '';
  } catch (err) {
    error.value = err?.message || String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Fire the AI request when the page loads
  getFeedback();
});
</script>

<template>
  <div>
    <NaviBar />
    <div style="max-width:800px;margin:20px auto;">
      <h2>Vehicle Help</h2>
      <p><strong>Vehicle:</strong> {{ vehicle.make || 'Unknown' }} {{ vehicle.model || '' }} ({{ vehicle.year || '' }})</p>
      <p><strong>Issues submitted:</strong> {{ issues }}</p>

      <div style="margin-top:1rem;">
        <label for="aiResponse"><strong>AI Feedback</strong></label>
        <div v-if="loading">Loading AI feedback...</div>
        <div v-else>
          <textarea id="aiResponse" rows="10" style="width:100%;" readonly>{{ aiOutput }}</textarea>
          <div v-if="error" style="color:darkred;margin-top:6px;">Error: {{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
