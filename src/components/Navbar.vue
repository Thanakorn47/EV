<template>
    <nav class="navbar">
      <div class="navbar-logo">
        <router-link to="/">ParkingApp</router-link>
      </div>
  
      <ul class="navbar-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/parking-list">Parking List</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
        <li v-if="isAuthenticated"><button @click="logout">Logout</button></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: "Navbar",
    data() {
      return {
        isAuthenticated: false, // Replace with actual authentication check
      };
    },
    methods: {
      logout() {
        // Placeholder for logout function; replace with actual logout logic
        this.isAuthenticated = false;
        this.$router.push("/login");
      },
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #007bff;
    color: #fff;
  }
  
  .navbar-logo a {
    font-size: 1.5rem;
    color: #fff;
    text-decoration: none;
  }
  
  .navbar-links {
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  
  .navbar-links a, .navbar-links button {
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .navbar-links button:hover, .navbar-links a:hover {
    text-decoration: underline;
  }
  </style>
  