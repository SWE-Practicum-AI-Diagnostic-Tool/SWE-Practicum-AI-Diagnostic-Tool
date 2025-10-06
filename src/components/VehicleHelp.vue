<script setup>
import NaviBar from "./NaviBar.vue";
import { useRoute } from "vue-router";
import { getResponse } from "../genai.js";
import { getVehicles } from "@/vehicles";

const route = useRoute();

// All form data is available here
const details = route.query;
const vehicles = getVehicles();
const vehicle = vehicles[details.vehicleIndex] || {};
const issues = details.issues || "No issues provided";

const getFeedback = async () => {
  const prompt = `Provide feedback on the following vehicle information. Suggest any missing or potentially incorrect details that could improve the accuracy of a vehicle diagnosis. Be concise and specific.
Vehicle Information:
Make: ${formatField(vehicle.make)}
Model: ${formatField(vehicle.model)}
Year: ${formatField(vehicle.year)}
Mileage: ${formatField(vehicle.mileage)}
Engine: ${formatField(vehicle.engine)}
Transmission: ${formatField(vehicle.transmission)}
Trim: ${formatField(vehicle.trim)}
Body Style: ${formatField(vehicle.bodystyle)}
Issues: ${formatField(issues)}

Feedback:`;
  const response = await getResponse(prompt);
  return response;
};
/**
 * Return a displayable value or a default placeholder when empty.
 * Treats undefined, null, empty string, and strings with only whitespace as empty.
 */
const formatField = (val, placeholder = "None") => {
  if (val === undefined || val === null) return placeholder;
  if (typeof val === "string") {
    return val.trim() === "" ? placeholder : val;
  }
  // For numbers and other types, convert to string if not NaN
  if (typeof val === "number") return isNaN(val) ? placeholder : String(val);
  return String(val);
};
</script>

<template>
  Vehile Help Page
</template>
