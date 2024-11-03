<template>
  <div class="login-page">
    <div class="login">
      <div class="header">
        <span class="app-name">Smart <span class="highlight">EV</span></span>
      </div>
      <div class="logo">
        <img src="/path/to/logo.png" alt="Charge & Park Logo" />
      </div>
      <h2>Log In</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="email" id="email" v-model="email" placeholder="Email" required />
        </div>

        <div class="form-group">
          <input type="password" id="password" v-model="password" placeholder="Password" required />
        </div>

        <button type="submit" class="login-button">Log In</button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="social-login">
          <button class="google-login">G</button>
        </div>
      </form>

      <p class="register-link">
        Already have an account?
        <router-link to="/register">register</router-link>
      </p>
    </div>
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

          identifier: this.email,
          password: this.password

        },
          {
            withCredentials: true, // Include credentials
          });

        // Store the JWT in localStorage
        localStorage.setItem("jwt", response.data.jwt);

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
  height: 100vh;
  padding: 2rem;
  text-align: center;
  color: #ffffff;
  margin: 0;
}

.header {
  font-size: 1.5rem;
  text-align: center;
  color: #ffffff;
}

.app-name {
  font-weight: bold;
}

.highlight {
  color: #00ffcc;
  /* Adjust this color to match the green/blue accent */
}

.logo img {
  width: 220px;
  border-radius: 70%;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #ffffff;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 300px;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #1e1e1e;
  border: none;
  border-radius: 8px;
  outline: none;
}

.form-group input::placeholder {
  color: #7f8c8d;
}

.login-button {
  width: 300px;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #333;
}

.social-login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.google-login {
  font-size: 1.5rem;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}

.register-link {
  margin-top: 2rem;
  color: #7f8c8d;
}

.register-link a {
  color: #00aaff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
