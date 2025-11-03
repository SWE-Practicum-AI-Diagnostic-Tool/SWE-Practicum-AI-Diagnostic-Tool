<template>
<div class="login-container">
    <div class="login-card">
      <h1>Register</h1>
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            required
          />
        </div>

        <!-- SSN -->
        <div class="form-group">
          <label for="ssn">SNN</label>
          <input
            v-model="ssn"
            id="ssn"
            type="password"
            placeholder="Please give us your SSNs"
            required
          />
        </div>

        <!-- Error message -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="checkpasswords()" class="error">{{ passwordErrorMessage }}</p>

        <!-- Submit -->
        <button type="submit">Register</button>
    </form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: '',
            ssn: '',
            errorMessage: ''
        }
    },
    methods: {
        checkpasswords() {
            if(this.password !== this.confirmPassword) {
                this.passwordErrorMessage = "Passwords do not match.";
                return true;
            }
            return false;
        }
    }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 550px;
  text-align: center;
  margin-top: 100px;
  margin-bottom: 25px;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 0.8rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>