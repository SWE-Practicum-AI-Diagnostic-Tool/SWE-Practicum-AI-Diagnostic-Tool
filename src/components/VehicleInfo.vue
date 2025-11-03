<script setup>
import { themeColor } from "../items";
import { useRoute, useRouter } from 'vue-router';
import { useVehicleStore } from '../stores/vehicle';

const service1SubHeading = "Start by entering your vehicle information";

import { ref, watch, onMounted } from "vue";
const year = ref("");
const make = ref("");
const model = ref("");
const trim = ref("");
const customVehicle = ref(false);

const route = useRoute();
const router = useRouter();
const vehicleStore = useVehicleStore();

// dropdown option lists
const years = ref([]);
const makes = ref([]);
const models = ref([]);
const trims = ref([]);

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";

async function fetchJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("NHTSA fetch failed");
  const data = await resp.json();
  return data.Results || [];
}

async function fetchMakes() {
  const data = await fetchJson(`${NHTSA_BASE}/getallmakes?format=json`);
  makes.value = data.map(m => m.Make_Name).sort();
}

async function fetchModels(make) {
  const data = await fetchJson(`${NHTSA_BASE}/getmodelsformake/${encodeURIComponent(make)}?format=json`);
  models.value = data.map(m => m.Model_Name).sort();
}

async function fetchTrims(year, make, model) {
  const data = await fetchJson(`${NHTSA_BASE}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}/year/${year}?format=json`);
  trims.value = data.map(t => t.Model_Name).sort(); // limited trim data, but reliable
}

async function fetchYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 1980; // NHTSA data starts from 1980
  years.value = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.value.push(y.toString());
  }
}

// watchers
watch(year, (val) => {
  // If user is entering a custom vehicle, don't trigger remote lookups
  if (customVehicle.value) return;
  make.value = "";
  model.value = "";
  trim.value = "";
  fetchMakes(val);
});

watch(make, (val) => {
  if (customVehicle.value) return;
  model.value = "";
  trim.value = "";
  fetchModels(year.value, val);
});

watch(model, (val) => {
  if (customVehicle.value) return;
  trim.value = "";
  fetchTrims(year.value, make.value, val);
});

onMounted(() => {
  fetchYears();
});

function submitVehicle() {
  vehicleStore.setVehicle({
    year: year.value,
    make: make.value,
    model: model.value,
    trim: trim.value
  });
  router.push({
    path: '/problemdescription',
    query: {
      year: year.value,
      make: make.value,
      model: model.value,
      trim: trim.value
    }
  });
}

function toggleCustomVehicle() {
  customVehicle.value = !customVehicle.value;
  // If switching to custom, clear dropdown lists to avoid confusion
  if (customVehicle.value) {
    makes.value = [];
    models.value = [];
    trims.value = [];
  } else {
    // If returning to selector mode, refresh years/makes if possible
    fetchYears();
    if (year.value) fetchMakes(year.value);
  }
}

</script>
<template>
  <div class="untree_co-section" id="features-section">
    <div class="container">
      <div class="row justify-content-between">
        <div class="col-lg-4">
          <span
            class="caption"
            data-aos="fade-up"
            data-aos-delay="0"
            :style="[{ color: themeColor }]"
            >{{ service1Heading }}</span
          >
          <h3 class="heading mb-4" data-aos="fade-up" data-aos-delay="100">
            {{ service1SubHeading }}
          </h3>
          <div class="mb-4" data-aos="fade-up" data-aos-delay="200">
            <p>
              Please ensure all fields are filled out accurately to help us provide the best results possible. 
              Don't know your vehicle details? No worries! You can find this information on your vehicle's registration document or insurance card.
              If you're still unsure, you can visit the site below to decode your vehicle's identification number(VIN).
            </p>
            <div style="margin-left: 1.2em; margin-bottom: 1.2em;">
              <a href="https://vpic.nhtsa.dot.gov/decoder/" target="_blank" rel="noopener" style="text-decoration: underline; color: #007bff;">
                NHTSA's free VIN decoder
              </a>
            </div>
            <div v-if="year && make && model && trim">
              <button class="btn btn-primary submit-btn" @click="submitVehicle">
                Submit
              </button>
            </div>
          </div>
        </div>
        <div class="col-lg-7" data-aos="fade-up" data-aos-delay="400">
          <div class="vehicle-selector p-4 rounded shadow bg-light">
            <h5 class="mb-3">Select Your Vehicle</h5>

            <div class="mb-2 form-row">
              <label class="form-label">Year</label>
              <template v-if="!customVehicle">
                <select v-model="year" class="form-select form-select-inline">
                  <option value="">-- Select Year --</option>
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </template>
              <template v-else>
                <input v-model="year" type="text" class="form-control form-select-inline" placeholder="e.g. 2020" />
              </template>
            </div>
            <div class="mb-2 form-row">
              <label class="form-label">Make</label>
              <template v-if="!customVehicle">
                <select v-model="make" class="form-select form-select-inline" :disabled="!year">
                  <option value="">-- Select Make --</option>
                  <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
                </select>
              </template>
              <template v-else>
                <input v-model="make" type="text" class="form-control form-select-inline" placeholder="e.g. Toyota" />
              </template>
            </div>
            <div class="mb-2 form-row">
              <label class="form-label">Model</label>
              <template v-if="!customVehicle">
                <select v-model="model" class="form-select form-select-inline" :disabled="!make">
                  <option value="">-- Select Model --</option>
                  <option v-for="m in models" :key="m" :value="m">{{ m }}</option>
                </select>
              </template>
              <template v-else>
                <input v-model="model" type="text" class="form-control form-select-inline" placeholder="e.g. Corolla" />
              </template>
            </div>
            <div class="mb-2 form-row">
              <label class="form-label">Trim</label>
              <template v-if="!customVehicle">
                <select v-model="trim" class="form-select form-select-inline" :disabled="!model">
                  <option value="">-- Select Trim --</option>
                  <option v-for="t in trims" :key="t" :value="t">{{ t }}</option>
                </select>
              </template>
              <template v-else>
                <input v-model="trim" type="text" class="form-control form-select-inline" placeholder="e.g. SE" />
              </template>
            </div>

            <div style="margin-top:0.25rem; margin-left:84px;"> 
              <a href="#" @click.prevent="toggleCustomVehicle">
                {{ customVehicle ? 'Use dropdown selectors' : 'Enter custom vehicle' }}
              </a>
            </div>


                <div v-if="year && make && model && trim" class="alert alert-success mt-3">
                  <strong>Selected Vehicle:</strong><br />
                  {{ year }} {{ make }} {{ model }} {{ trim }}
                </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.submit-btn {
  background: var(--primary, #0d6efd);
  border-color: var(--primary, #0d6efd);
  color: #fff;
  font-weight: 600;
  font-size: 1.25rem;
  padding: 0.85rem 2.8rem;
  border-radius: 2rem;
  margin-top: 0.5rem;
  margin-left: 1.5em;
  box-shadow: 0 2px 8px rgba(13,110,253,0.08);
  transition: background 0.2s, border-color 0.2s;
  letter-spacing: 0.5px;
}
.submit-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.form-row {
.submit-btn {
  box-shadow: 0 2px 8px rgba(13,110,253,0.08);
  transition: background 0.2s, border-color 0.2s;
}
.submit-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}
.form-row label.form-label {
  flex: 0 0 80px;
  margin-bottom: 0;
  margin-right: 1rem;
  text-align: right;
}
.form-row .form-select-inline {
  flex: 1 1 auto;
  min-width: 180px;
  max-width: 320px;
}

.vehicle-selector {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-top: 1.5rem;
}
.vehicle-selector h5 {
  color: var(--primary, #0d6efd);
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.vehicle-selector label.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}
.vehicle-selector select.form-select {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: #f8f9fa;
  color: #222;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}
.vehicle-selector select.form-select:focus {
  border-color: var(--primary, #0d6efd);
  outline: none;
  background: #fff;
}
.vehicle-selector .alert-success {
  background: #e6f4ea;
  color: #217a4a;
  border: none;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  font-size: 1.05rem;
}
.vehicle-selector .mb-2 {
  margin-bottom: 1.25rem !important;
}
</style>
