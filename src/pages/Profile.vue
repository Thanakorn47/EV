<template>
    <div class="profile">
      <h1>Your Profile</h1>
      
      <!-- User Image -->
      <div class="profile-image">
        <img :src="user.image" alt="User Image" />
      </div>
  
      <div class="profile-info">
        <div class="profile-item">
          <strong>Name:</strong>
          <span>{{ user.name }}</span>
        </div>
        <div class="profile-item">
          <strong>Email:</strong>
          <span>{{ user.email }}</span>
        </div>
      </div>
  
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Profile",
    data() {
      return {
        // Sample user data with an image URL
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
          image: "src/assets/orange.png" // Replace with actual image URL
        }
      };
    },
    methods: {
      logout() {
        // Replace this with actual logout functionality
        localStorage.removeItem("jwt")
        alert("Logged out successfully!");
        this.$router.push("/login");
      }
    }
  };
  </script>
  
  <style scoped>
  .profile {
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
  
  /* Profile Image Styling */
  .profile-image {
    margin-bottom: 1.5rem;
  }
  .profile-image img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .profile-info {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .profile-item {
    margin-bottom: 1rem;
  }
  
  .profile-item strong {
    color: #555;
  }
  
  .logout-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .logout-button:hover {
    background-color: #0056b3;
  }
  </style>
  