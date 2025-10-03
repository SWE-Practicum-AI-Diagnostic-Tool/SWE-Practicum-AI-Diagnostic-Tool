<script>
import NaviBar from "./NaviBar.vue";
import getReponse from "../genai.js";
export default {
  components: {
    NaviBar,
  },
  methods: {},
  data() {
    return {
      inputValue: "",
      response: ""
    };
  },
  methods: {
    getResponse() {
      // Do whatever you need with inputValue
      getReponse(this.inputValue).then((res) => {
        this.response = res;
      });
    }
  }
};
</script>

<template>
  <div>
    <main>
      <NaviBar />
    </main>
    <input v-model="inputValue" id="input" type="text" />

    <button id="submit" @click="getResponse">
      Submit
    </button>

    <div id="response">{{ response }}</div>

  </div>
</template>


<style>
input {
  margin: 20px;
  padding: 10px;
  width: 300px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

#response {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  width: 80%;
  min-height: 50px;
  font-size: 16px;
}
</style>
