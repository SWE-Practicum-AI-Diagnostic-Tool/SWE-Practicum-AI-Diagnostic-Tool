<script>
import NaviBar from './NaviBar.vue'
import { getResponse } from '../genai.js'

export default {
  components: { NaviBar },
  data() {
    return {
      inputValue: '',
      response: '',
      loading: false
    }
  },
  methods: {
    async ask() {
      this.response = '';
      this.loading = true;
      try {
        const res = await getResponse(this.inputValue);
        // strip legacy mocked prefix if present so we don't echo the prompt
        let out = res;
        const prefix = 'Mocked response (client):';
        if (typeof out === 'string' && out.startsWith(prefix)) {
          out = out.slice(prefix.length).trim();
        }
        // Remove legacy 'OK — received your request.' wrapper if present
        const legacyOk = 'OK — received your request.';
        if (typeof out === 'string' && out.startsWith(legacyOk)) {
          out = out.slice(legacyOk.length).trim();
        }
        this.response = out;
      } catch (err) {
        this.response = 'Error: ' + (err?.message || String(err));
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <div class="home-root">
    <NaviBar />
    <div class="home-body">
  <input v-model="inputValue" id="input" type="text" placeholder="Ask the AI..." />
  <button id="submit" @click="ask" :disabled="loading">{{ loading ? 'Loading...' : 'Ask AI' }}</button>
      <div id="response">{{ response }}</div>
    </div>
  </div>
</template>

<style scoped>
.home-body {
  margin: 20px;
}
#input {
  padding: 8px;
  width: 60%;
  margin-right: 8px;
}
button#submit {
  padding: 8px 12px;
}
#response {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  min-height: 40px;
  white-space: pre-wrap;
}
</style>
