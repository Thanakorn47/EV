<template>
    <div class="payment-page">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo-section">
          <img src="/path/to/logo.png" alt="Charge & Park Logo" class="logo" />
          <h2>Smart <span class="highlight">EV</span></h2>
        </div>
        <p class="user-name">{{ userName }}</p>
        <nav class="menu">
          <ul>
            <li @click="goToOverview">Overview</li>
            <li @click="goToSlotBooking">Slot booking</li>
            <li @click="goToMap">Map</li>
            <li @click="goToBooking" class="active">Booking</li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="content">
    
  
        <!-- Charging Slot Details -->
        <div class="charging-details">
          <h3>A3 EV 083</h3>
          <p class="availability">Available</p>
          <p class="slot-info">SLOT 1</p>
          <p class="charging-speed">Fast charging</p>
          <img src="/path/to/logo.png" alt="Charger Image" class="charger-image" />
        </div>
  
        <!-- Credit Card Section -->
        <section class="credit-card-section">
          <h4>Credit cards</h4>
          <button class="add-button">Add +</button>
          <div class="card-list">
            <div class="card-item" v-for="(card, index) in creditCards" :key="index">
              <img :src="card.typeIcon" alt="Card Type" class="card-icon" />
              <p>{{ card.number }}</p>
              <p>{{ card.holder }}, {{ card.expiry }}</p>
            </div>
          </div>
        </section>
  
        <!-- Pay Button -->
        <button class="pay-button">PAY</button>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: "PaymentPage",
    data() {
      return {
        creditCards: [
          {
            typeIcon: "/path/to/mastercard-icon.png",
            number: "3453****234",
            holder: "Ivan Horvat",
            expiry: "06/26",
          },
          {
            typeIcon: "/path/to/visa-icon.png",
            number: "3453****234",
            holder: "Ivan Horvat",
            expiry: "06/26",
          },
        ],
      };
    },
    methods: {
      goToOverview() {
        this.$router.push("/home");
      },
      goToSlotBooking() {
        this.$router.push("/slotbooking");
      },
      goToMap() {
        this.$router.push("/map");
      },
      goToBooking() {
        this.$router.push("/booking");
      },
    },
  };
  </script>
  
  <style scoped>
  .payment-page {
    display: flex;
    color: #ffffff;
    background-color: #121212;
    min-height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    padding: 1.5rem;
    background-color: #1a1a1a;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo {
    width: 200px;
    border-radius: 50%;
    margin-bottom: 1rem;
  }
  
  .highlight {
    color: #00ffcc;
  }
  
  .user-name {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .menu ul {
    list-style: none;
    padding: 0;
    width: 100%;
  }
  
  .menu ul li {
    padding: 1rem;
    cursor: pointer;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .menu ul li.active,
  .menu ul li:hover {
    background-color: #333;
  }
  
  .content {
    flex: 1;
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
  }
  
  .search-bar {
    width: 300px;
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
    outline: none;
  }
  
  .charging-details {
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .charging-details h3 {
    font-size: 1.5rem;
  }
  
  .availability {
    color: #00ffcc;
    font-size: 1rem;
    margin-top: 0.5rem;
  }
  
  .slot-info,
  .charging-speed {
    color: #888;
    font-size: 0.9rem;
    margin-top: 0.2rem;
  }
  
  .charger-image {
    width: 100%;
    max-width: 300px;
    margin-top: 1rem;
    border-radius: 8px;
  }
  
  .credit-card-section {
    margin-top: 1.5rem;
  }
  
  .credit-card-section h4 {
    font-size: 1.2rem;
    display: inline-block;
  }
  
  .add-button {
    float: right;
    background-color: #00ffcc;
    color: #000;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .card-list {
    border-top: 1px solid #444;
    margin-top: 1rem;
    padding-top: 1rem;
  }
  
  .card-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .card-icon {
    width: 40px;
    margin-right: 1rem;
  }
  
  .pay-button {
    background-color: #00ff66;
    color: #000;
    width: 50%;
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 2rem auto 0;
    display: block;
  }
  </style>
  