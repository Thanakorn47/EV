<template>
  <div class="login">
    <h1>Login to ParkingApp</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" class="login-button">Login</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <p class="register-link">
      Don’t have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("https://strapi-sever-ev.onrender.com/api/auth/local", {
          data: {
            identifier: this.email,
            password: this.password
          }
        });
        const { jwt, user } = response.data.data;

        // Store the JWT in localStorage
        localStorage.setItem("jwt", jwt);

        // Redirect to homepage or another page after successful login
        this.$router.push("/");

        // Clear the error message if login is successful
        this.errorMessage = "";
      }
      catch (error) {
        this.errorMessage = "Login failed. Please check your email and password.";
        console.error("Error during login:", error.response?.data || error);
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}

.register-link {
  margin-top: 1rem;
  color: #555;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
