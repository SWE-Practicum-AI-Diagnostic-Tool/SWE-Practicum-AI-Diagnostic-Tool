<script setup>
import NaviBar from "./NaviBar.vue";
import MarkdownIt from 'markdown-it'
import { useRoute } from "vue-router";
import { getResponse } from "../genai.js";
import { getVehicles } from "../vehicles.js";
import { ref, onMounted, computed } from 'vue';

// Get query params
const route = useRoute();
const details = route.query || {};

// Get vehicle data
// const vehicles = getVehicles();
// const vehicleIndex = Number(details.vehicleIndex);
// const vehicle = vehicles[vehicleIndex] || {};
const vehicle = details;
const issues = details.issues || "No issues provided";

// Status variables
const aiOutput = ref('');
const loading = ref(false);
const error = ref(null);

// Helper to return a displayable value or a default placeholder
const formatField = (val, placeholder = "None") => {
  if (val === undefined || val === null) return placeholder;
  if (typeof val === "string") {
    return val.trim() === "" ? placeholder : val;
  }
  if (typeof val === "number") return isNaN(val) ? placeholder : String(val);
  return String(val);
};

// Helper to get feedback from the AI
const getFeedback = async () => {
  loading.value = true;
  error.value = null;
  const prompt = `Provide feedback on the following vehicle information. Suggest any
missing or potentially incorrect details that could improve the accuracy of a vehicle
diagnosis. Also be sure to help the user identify any potential issues with the vehicle.
Be concise and specific.
**Vehicle Information**
Year: ${formatField(vehicle.year)}
Make: ${formatField(vehicle.make)}
Model: ${formatField(vehicle.model)}
Trim: ${formatField(vehicle.trim)}
Issues: ${formatField(issues)}
**Feedback**\n`;

  try {
    // Get the AI response
    const resp = await getResponse(prompt);

    // Compile the Markdown to HTML
    const md = new MarkdownIt()
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
  <div class="untree_co-section" id="features-section">
    <div class="container">
      <div style="max-width:800px;margin:20px auto;">
        <h2>Vehicle Help</h2>
        <p><strong>Vehicle:</strong> {{ vehicle.make || 'Unknown' }} {{ vehicle.model || '' }} ({{ vehicle.year || '' }})</p>
        <p><strong>Issues submitted:</strong> {{ issues }}</p>
        <div style="margin-top:1rem;">
          <label for="aiResponse"><strong>AI Feedback</strong></label>

          <!-- Show a loading indicator -->
          <div v-if="loading">Loading AI feedback...</div>

          <div v-else>
            <!-- Render the AI response as HTML -->
            <div v-html="aiOutput"></div>

            <!-- Display any errors -->
            <div v-if="error" style="color:darkred;margin-top:6px;">Error: {{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
