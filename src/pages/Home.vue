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
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div class="vehicle-details" v-if="selectedCar">
        <div class="vehicle-header">
          <h2>Vehicle Details</h2>
          <button class="add-new" @click="goToAddNew">+ Add New</button>
        </div>
        <img :src="getImageUrl(selectedCar.yourcar)" alt="Vehicle" class="vehicle-image" />
        <h3 class="vehicle-name">{{selectedCar.brand +" "+ selectedCar.model }}</h3>
        <p class="charging-status">Charging</p>
        <div class="charging-indicator">
          <div class="charging-slot" v-for="slot in 5" :key="slot"></div>
        </div>
      </div>


      <!-- Car List Section -->
      <section class="car-list">
        <h2>Your Cars</h2>
        <div v-for="car in filteredCars" :key="car.id" class="car-card">
          <img :src="getImageUrl(car.yourcar)" alt="Car Image" @error="onImageError" style="width: 250px;" />
          <div class="car-detail">
            <p>Model: {{ car.model }}</p>
            <p>Brand: {{ car.brand }}</p>
          </div>
          <button class="select-car" @click="selectCar(car)">Select this car</button>
        </div>
      </section>

    </main>

    <aside class="available-slots">
      <h2>Available Stations</h2>
      <div v-for="station in stations" :key="station.id" class="station">
        <h3 class="station-name">{{ station.name }}</h3>

        <div v-for="charger in station.charger_slots" :key="charger.id" class="slot">
          <p class="slot-title">{{ charger.name }}</p>

          <p class="slot-status" :class="{ 'not-available': !charger.available }">
            {{ charger.available ? "Available" : "Not Available" }}
          </p>


        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: "Home",
  data() {
    return {
      userName: '',
      email: '',
      cars: [],
      stations: [],
      bookingHistory: [],
      selectedCar: null

    };
  },
  computed: {
    filteredCars() {
      // Exclude the selected car from the car list
      return this.cars.filter(car => car.id !== this.selectedCar?.id);
    }
  },
  methods: {
    getImageUrl(path) {
      return path ? `${import.meta.env.VITE_STRAPI_URL}${path}` : 'vehicle-image.png';
    },
    selectCar(car) {
      this.selectedCar = car; // Update the displayed car
    },
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
    }
  },

  async mounted() {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const decoded = VueJwtDecode.decode(token);
        const userId = decoded.id;

        // Fetch user details and cars
        const userResponse = await axios.get(`https://strapi-sever-ev.onrender.com/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userName = userResponse.data.username;
        this.email = userResponse.data.email;

        const carResponse = await axios.get(
          `https://strapi-sever-ev.onrender.com/api/vehicles?filters[user][id][$eq]=${userId}&populate=*`
        );
        this.cars = carResponse.data.data.map((car) => ({
          id: car.id,
          model: car.model,
          brand: car.brand,
          yourcar: car.yourcar.url,
        }));

        // Set the first car as the default selected car
        this.selectedCar = this.cars[0];
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

.select-car {
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
  overflow-y: auto;
  /* เพิ่มส่วนนี้ */
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
  display: flex;
  justify-content: space-around;
  align-items: center;
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
</style>
