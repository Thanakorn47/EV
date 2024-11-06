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
            <li @click="goToPayment" class="active">Payment</li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="content">
        <!-- Latest Booking Details -->
        <div class="charging-details" v-if="latestBooking">
          <h3>{{ latestBooking.title }}</h3>
          <p class="availability">{{ latestBooking.available ? 'Available' : 'Not Available' }}</p>
          <p class="slot-info">Slot: {{ latestBooking.slot }}</p>
          <p class="charging-speed">Fast charging</p>
          <img src="/path/to/Chargerimg.png"  alt="Charger Image" class="charger-image" />
        </div>
  
        <!-- Booking History -->
        <section class="booking-history">
          <h2>Booking History</h2>
          <div v-if="bookingHistory.length > 0" class="history-list">
            <div v-for="booking in bookingHistory" :key="booking.id" class="booking-card">
              <div class="sub-booking-card">
                <p class="booking-title">{{ booking.title }}</p>
                <p class="booking-time">{{ booking.time }}</p>
                <p class="booking-slot">Slot: {{ booking.slot }}</p>
              </div>
              <button @click="cancelBooking(booking.bookingDId, booking.chargerDId)" class="cancel-booking">
                Cancel
              </button>
            </div>
          </div>
          <p v-else>No booking history available.</p>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import VueJwtDecode from "vue-jwt-decode";
  
  export default {
    name: "PaymentPage",
    data() {
      return {
        userName: "",
        email: "",
        userDId: "",
        bookingHistory: [],
        latestBooking: null,
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
      goToPayment() {
        this.$router.push("/payment");
      },
      async cancelBooking(bookingID, chargerId) {
        await axios.delete(`https://strapi-sever-ev.onrender.com/api/reservations/${bookingID}`);
        await axios.put(`https://strapi-sever-ev.onrender.com/api/chargers/${chargerId}`, {
          data: { available: true },
        });
        alert("Cancel reservation successfully!");
        this.$router.go(0);
      },
    },
    async mounted() {
      const token = localStorage.getItem("jwt");
  
      if (token) {
        try {
          const decoded = VueJwtDecode.decode(token);
          const userId = decoded.id;
  
          // Fetch user details
          const userResponse = await axios.get(`https://strapi-sever-ev.onrender.com/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.userName = userResponse.data.username;
          this.email = userResponse.data.email;
          this.userDId = userResponse.data.documentId;
  
          // Fetch booking history for the user
          const historyResponse = await axios.get(
            `https://strapi-sever-ev.onrender.com/api/reservations?filters[users_permissions_user][id][$eq]=${userId}&populate=charger.station`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          // Set booking history and latest booking
          this.bookingHistory = historyResponse.data.data.map((booking) => ({
            id: booking.id,
            bookingDId: booking.documentId,
            chargerDId: booking.charger.documentId,
            title: booking.charger.station ? booking.charger.station.name : "Unknown Station",
            time: `${booking.startTime} - ${booking.endTime}`,
            slot: booking.charger.name,
            available: booking.charger.available,
            image: "/path/to/logo.png",
          }));
  
          // Set the most recent booking as the latest booking
          if (this.bookingHistory.length > 0) {
            this.latestBooking = this.bookingHistory[0];
          }
        } catch (error) {
          console.error("Error fetching data from Strapi:", error);
        }
      }
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
    width: 250px;
    height: 250px;
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
    background-color: #121212;
    border-radius: 10px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .charging-details {
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    text-align: center;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .charging-details h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .availability {
    color: #00ffcc;
    font-size: 1rem;
  }
  
  .slot-info,
  .charging-speed {
    color: #888;
    font-size: 0.9rem;
  }
  
  .charger-image {
    width: 100%;
    max-width: 300px;
    margin-top: 1rem;
    border-radius: 8px;
    border: 1px solid #333;
  }
  
  .booking-history {
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 10px;
    margin-top: 2rem;
  }
  
  .history-list {
    margin-top: 1rem;
  }
  
  .booking-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2a2a2a;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .booking-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ddd;
  }
  
  .booking-time,
  .booking-slot {
    color: #888;
    font-size: 0.9rem;
  }
  
  .cancel-booking {
    background-color: rgb(248, 131, 131);
    border: 1px solid red;
    color: #1e1e1e;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .cancel-booking:hover {
    background-color: rgb(255, 0, 0);
  }
  </style>
  