<template>
    <NaviBar />
  <div class="form-container">
    <form>
      <!-- Vehicle Make -->
      <FormSection title="Vehicle Make" required />
      <!-- Vehicle Model -->
      <FormSection title="Vehicle Model" required />
    </form>
  </div>
</template>

<script>
</script>

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