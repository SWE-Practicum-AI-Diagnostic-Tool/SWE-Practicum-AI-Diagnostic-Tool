<script setup>
import NaviBar from "./NaviBar.vue";
import MarkdownIt from 'markdown-it'
import { useRoute } from "vue-router";
import { getResponse } from "../genai.js";
import { getVehicles } from "../vehicles.js";
import { ref, onMounted, computed } from 'vue';

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
  const prompt = `Provide feedback on the following vehicle information. Suggest any
missing or potentially incorrect details that could improve the accuracy of a vehicle
diagnosis. Also be sure to help the user identify any potential issues with the vehicle.
Be concise and specific.
**Vehicle Information**
Make: ${formatField(vehicle.make)}
Model: ${formatField(vehicle.model)}
Year: ${formatField(vehicle.year)}
Mileage: ${formatField(vehicle.mileage)}
Engine: ${formatField(vehicle.engine)}
Transmission: ${formatField(vehicle.transmission)}
Trim: ${formatField(vehicle.trim)}
Body Style: ${formatField(vehicle.bodystyle)}
Issues: ${formatField(issues)}
**Feedback**\n`;

  try {
    const md = new MarkdownIt()
    const resp = await getResponse(prompt);
    aiOutput.value = computed(() => md.render(resp)).value || '';
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
          <div v-html="aiOutput"></div>
          <div v-if="error" style="color:darkred;margin-top:6px;">Error: {{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
