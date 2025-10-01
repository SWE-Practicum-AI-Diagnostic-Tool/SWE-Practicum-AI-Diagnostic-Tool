<script setup>
import NaviBar from './NaviBar.vue';
import FormPerson from './FromPerson.vue';
</script>

<template>
    <NaviBar />
    <div class="form-container">
        <form>
        <!-- Person 1 -->
        <FormPerson title="Eli" Email="myEmail@gmail.com" required />
        <!-- Person 2-->
        <FormPerson title="Person 2" Email="myEmail@gmail.com" required />
        <!-- Person 3-->
        <FormPerson title="Person 3" Email="myEmail@gmail.com" required />
        <!-- Person 4-->
        <FormPerson title="Person 4" Email="myEmail@gmail.com" required />
        <!-- Person 5-->
        <FormPerson title="Person 5" Email="myEmail@gmail.com" required />
        </form>
    </div>
</template>

<style>
.form-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
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