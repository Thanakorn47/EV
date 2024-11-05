<template>
  <div class="home">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="/path/to/logo.png" alt="Charge & Park Logo" class="logo" />
        <h2>Smart <span class="highlight">EV</span></h2>
      </div>
      <p class="user-name">{{ userName }}</p>
      <nav class="menu">
        <ul>
          <li @click="goToOverview" class="active">Overview</li>
          <li @click="goToSlotBooking">Slot booking</li>
          <li @click="goToMap">Map</li>
          <li @click="goToBooking">Booking</li>
          <li><button @click="logout" class="logout-button">Logout</button></li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div class="vehicle-details">
        <div class="vehicle-header">
          <h2>Vehicle Details</h2>
          <button class="add-new" @click="goToAddNew">+ Add New</button>
        </div>
        <img
          src="/path/to/vehicle-image.png"
          alt="Vehicle"
          class="vehicle-image"
        />
        <h3 class="vehicle-name">Tesla Model Y</h3>
        <p class="charging-status">Charging</p>
        <div class="charging-indicator">
          <div class="charging-slot" v-for="slot in 5" :key="slot"></div>
        </div>
      </div>

      <!-- Car List Section -->
      <section class="car-list">
        <h2>Your Cars</h2>
        <div v-for="car in cars" :key="car.id" class="car-card">
          <h3>{{ car.name }}</h3>
          <p>Model: {{ car.model }}</p>
          <p>Year: {{ car.year }}</p>
          <p>Status: {{ car.status }}</p>
        </div>
      </section>
    </main>

    <aside class="available-slots">
      <h2>Available Stations</h2>
      <div v-for="station in stations" :key="station.id" class="station">
        <h3 class="station-name">{{ station.name }}</h3>

        <div
          v-for="charger in station.charger_slots"
          :key="charger.id"
          class="slot"
        >
          <p class="slot-title">{{ charger.name }}</p>

          <p
            class="slot-status"
            :class="{ 'not-available': !charger.available }"
          >
            {{ charger.available ? "Available" : "Not Available" }}
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Home",
  data() {
    return {
      userName: "",
      email: "",
      cars: [],
      stations: [],
      bookingHistory: [],
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
    goToAddNew() {
      this.$router.push("/addnew");
    },
    logout() {
      // Replace this with actual logout functionality
      localStorage.removeItem("jwt");
      alert("Logged out successfully!");
      this.$router.push("/");
    },
  },
  async mounted() {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const decoded = VueJwtDecode.decode(token);
        const userId = decoded.id;

        // Fetch user details
        const userResponse = await axios.get(
          `https://strapi-sever-ev.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.userName = userResponse.data.username;
        this.email = userResponse.data.email;

        // Fetch cars added by the user
        const stationsResponse = await axios.get(
          "https://strapi-sever-ev.onrender.com/api/stations?populate=*",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Map data for display
        this.stations = stationsResponse.data.data.map((station) => ({
          id: station.id,
          name: station.name,
          location: station.location,
          charger_slots: station.charger_slots
            .map((charger) => ({
              id: charger.id,
              name: charger.name,
              available: charger.available,
              documentId: charger.documentId,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        }));
      } catch (error) {
        console.error("Error fetching data from Strapi:", error);
      }
    } else {
      console.warn("No JWT token found. Please log in first.");
    }
  },
};
</script>

<style scoped>
.home {
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
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

.vehicle-details {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-new {
  background-color: #00ffcc;
  color: #1e1e1e;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.vehicle-image {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.vehicle-name {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.charging-status {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.charging-indicator {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.charging-slot {
  width: 40px;
  height: 20px;
  background-color: #00ffcc;
  border-radius: 4px;
}

.available-slots {
  width: 250px;
  padding: 2rem;
  background-color: #1a1a1a;
  overflow-y: auto; /* เพิ่มส่วนนี้ */
  max-height: 100vh;
}

.available-slots h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.slot {
  background-color: #2a2a2a;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}

.slot-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.slot-status {
  color: #00ffcc;
}

.slot-count,
.slot-speed {
  color: #888;
}

.car-list {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
}

.car-list h2 {
  margin-bottom: 1.5rem;
}

.car-card {
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.car-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.car-card p {
  color: #888;
}

.slot-status.not-available {
  color: red;
}
.logout-button:hover {
  background-color:red;
}
.logout-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: red;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
