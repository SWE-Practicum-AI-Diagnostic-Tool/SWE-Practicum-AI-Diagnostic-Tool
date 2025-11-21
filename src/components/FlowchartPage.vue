<script setup>
import { onMounted, ref } from 'vue';
import { getSavedFlowcharts } from '../apis';
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs'

const flowcharts = ref([]);
const vehicles = ref([]);
const issues = ref([]);
const flowchartSvg = ref([]);
const loading = ref([]);
const error = ref([]);

const getDiagram = async (flowchartObj, idx) => {
  loading.value[idx] = true;
  error.value[idx] = null;
  vehicles.value[idx] = flowchartObj.vehicle;
  issues.value[idx] = flowchartObj.issues;

  try {
    const mermaidMatch = flowchartObj.flowchart.match(/```mermaid\n([\s\S]*?)\n```/);
    if (!mermaidMatch) throw new Error('Mermaid code block not found');
    const code = mermaidMatch[1].trim();

    await mermaid.parse(code);

    const { svg } = await mermaid.render(`flowchart-${idx}`, code);

    flowchartSvg.value[idx] = svg;
  } catch (err) {
    error.value[idx] = err.message;
  } finally {
    loading.value[idx] = false;
  }
};

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    flowchart: { htmlLabels: true, curve: 'basis' }
  })

  flowcharts.value = await getSavedFlowcharts();
  flowcharts.value.forEach(getDiagram);
});
</script>

<template>
  <div class="untree_co-home" id="home-section">
    <div class="container">
      <div class="row align-items-start">
        <div class="col-12">
          <!-- <div class="dots"></div> -->
          <!-- <div class="row align-items-center"> -->
            <!-- <div class="col-lg-5"> -->
              <h1 class="heading" data-aos="fade-up" data-aos-delay="0">
                Flowcharts
              </h1>
              <div class="excerpt" data-aos="fade-up" data-aos-delay="100">
                <div v-if="flowcharts.length === 0">
                  You haven't generated any flowcharts yet.
                </div>
              </div>

              <!-- Flowcharts -->
              <div v-for="(flowchart, idx) in flowcharts" :key="idx">
                <div v-if="!loading[idx] && !error[idx]">
                  <p><strong>Vehicle:</strong> {{ vehicles[idx].make || 'Unknown' }} {{ vehicles[idx].model || '' }} ({{ vehicles[idx].year || '' }})</p>
                  <p><strong>Issues:</strong> {{ issues[idx] }}</p>
                  <div v-for="response in flowchart.responses">
                    <strong>{{ response.question }}</strong><br/>
                    {{ response.option }}
                  </div>
                </div>
                <div v-if="loading[idx]" class="loading">Loading...</div>
                <div v-else-if="error[idx]" class="error">{{ error[idx] }}</div>
                <div v-else v-html="flowchartSvg[idx]" class="flowchart-container"></div>
              </div>

            <!-- </div> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flowchart-container {
  width: 100%;
  margin: 20px auto;
}
</style>