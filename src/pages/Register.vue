<template>
    <div class="register">
      <div class="header">
        <span class="app-name">Smart <span class="highlight">EV</span></span>
      </div>
      <div class="logo">
        <img src="/path/to/logo.png" alt="Charge & Park Logo" />
      </div>
      <h2>REGISTER</h2>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <input type="text" v-model="username" id="username" placeholder="Username" required />
        </div>
        <div class="form-group">
          <input type="email" v-model="email" id="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" id="password" placeholder="Password" required />
        </div>
        <div class="form-group">
          <input type="text" v-model="phoneNumber" id="phoneNumber" placeholder="Phone number" required />
        </div>
        <button type="submit">Register</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "Register",
    data() {
      return {
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post("https://strapi-sever-ev.onrender.com/api/auth/local/register", {
            username: this.username,
            email: this.email,
            password: this.password,
          });
          
          this.successMessage = "Registration successful! Please log in.";
          this.errorMessage = '';
          
          // Clear the form fields
          this.username = '';
          this.email = '';
          this.password = '';
          this.phoneNumber = '';
          
          // Log the JWT for debugging (optional)
          console.log(response.data.jwt);
          
          // Redirect to homepage or another page after successful registration
          this.$router.push("/home");
  
        } catch (error) {
          this.errorMessage = "Registration failed. Please try again.";
          this.successMessage = '';
          console.error("Error during registration:", error.response?.data || error);
        }
        
        console.log("Payload:", {
          username: this.username,
          email: this.email,
          password: this.password,
          phoneNumber: this.phoneNumber
        });
      }
    }
  };
  </script>
  
  
  <style scoped>
  .register {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
    color: #ffffff;
    background-color: #121212;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
  
  .header {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #ffffff;
  }
  
  .app-name {
    font-weight: bold;
  }
  
  .highlight {
    color: #00ffcc; /* Adjust this color to match the green/blue accent */
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
    width: 100%;
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
  
  button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    color: #ffffff;
    background-color: #444;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  button:hover {
    background-color: #333;
  }
  
  .error-message {
    color: #e74c3c;
    margin-top: 1rem;
  }
  
  .success-message {
    color: #2ecc71;
    margin-top: 1rem;
  }
  </style>
  