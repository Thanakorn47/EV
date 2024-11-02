<template>
    <div class="home">
      <header class="home-header">
        <h1>Welcome to the Parking App</h1>
        <p>Find and reserve parking spaces easily.</p>
        <button @click="goToParkingList">View Available Parking</button>
      </header>
  
      <section class="home-features">
        <div class="feature">
          <h2>Easy Reservations</h2>
          <p>Reserve your parking spot in just a few clicks.</p>
        </div>
        <div class="feature">
          <h2>Real-Time Availability</h2>
          <p>See live parking availability in your area.</p>
        </div>
        <div class="feature">
          <h2>User-Friendly Interface</h2>
          <p>Navigate with ease through a simple, clean design.</p>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: "Home",
    methods: {
      goToParkingList() {
        this.$router.push("/parking-list");
      }
    }
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    padding: 2rem;
  }
  
  .home-header {
    margin-bottom: 2rem;
  }
  
  .home-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .home-header p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .home-header button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .home-features {
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;
  }
  
  .feature {
    width: 30%;
    text-align: left;
  }
  
  .feature h2 {
    font-size: 1.5rem;
    color: #333;
  }
  
  .feature p {
    font-size: 1rem;
    color: #666;
  }
  </style>
  