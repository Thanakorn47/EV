<template>
  <div class="booking-page">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="/path/to/logo.png" alt="Charge & Park Logo" class="logo" />
        <h2>Smart <span class="highlight">EV</span></h2>
      </div>
      <p class="user-name">{{ userName }}</p>
      <nav class="menu">
        <ul>
          <li @click="goToOverview">Overview</li>
          <li @click="goToSlotBooking" class="active">Slot Booking</li>
          <li @click="goToMap">Map</li>
          <li @click="goToBooking">Booking</li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div class="charger-details">
        <h2>{{ charger.name }}</h2>
        <p class="availability">{{ charger.available ? 'Available' : 'Not Available' }}</p>

        <button class="select-time-button" @click="showTimeModal = true">Select Time</button>

        <h2> {{ startTime }} - {{ endTime }}</h2>

        <!-- Time Selection Modal -->
        <div v-if="showTimeModal" class="modal-overlay">
          <div class="modal">
            <h3>Select Start and End Time</h3>
            <div class="select-time">
              <label>Start Charging:</label>
              <select v-model="startTime">
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
            <div class="select-time">
              <label>End Charging:</label>
              <select v-model="endTime">
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
            <button @click="confirmTimeSelection">Confirm</button>
            <button @click="showTimeModal = false">Cancel</button>
          </div>
        </div>

        <button class="create-reservation" @click="createReservation">Create Reservation</button>

      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: "Booking",
  data() {
    return {
      userName: "",
      charger: {},
      startTime: "",
      endTime: "",
      statusRV: "active",
      timeOptions: ["08:00", "10:00", "12:00", "14:00", "16:00"], // Example times
      showTimeModal: false // Controls modal visibility
    };
  },
  computed: {
    formattedStartTime() {
      return this.startTime !== "Select time" ? `${this.startTime}:00.000` : null;
    },
    formattedEndTime() {
      return this.endTime !== "Select time" ? `${this.endTime}:00.000` : null;
    }
  },
  methods: {

    confirmTimeSelection() {
      // Close modal after confirming selection
      this.showTimeModal = false;
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
    goToPayment() {
      this.$router.push("/payment");
    },

    async createReservation() {


      if (this.startTime === this.endTime) {
        alert("Start time and end time cannot be the same.");
        return; // Stop the reservation process if times are identical
      }

      // Check if startTime is greater than endTime
      if (this.startTime > this.endTime) {
        alert("Start time cannot be later than end time.");
        return; // Stop the reservation process if startTime is after endTime
      }

      console.log(this.startTime);
      console.log(this.endTime);
      console.log(this.charger.documentId);
      console.log(this.documentId);

      try {
        await axios.post("https://strapi-sever-ev.onrender.com/api/reservations", {
          data: {
            startTime: this.formattedStartTime,
            endTime: this.formattedEndTime,
            charger: this.charger.documentId,
            statusRV: this.statusRV,
            users_permissions_user: this.documentId
          }
        });
        const chargerId = this.charger.documentId; // Ensure you have the charger's ID here
        await axios.put(`https://strapi-sever-ev.onrender.com/api/chargers/${chargerId}`, {
          data: {
            available: false
          }
        });
        alert("Reservation created successfully!");
        this.goToPayment(); // Redirect to the overview page
      } catch (error) {
        console.error("Failed to create reservation:", error);
      }
    },
  },


  async mounted() {
    // Get the JWT token from local storage
    const token = localStorage.getItem("jwt");
    const chargerId = this.$route.query.chargerId;
    console.log("Charger ID:", chargerId);
    if (token) {
      try {
        // Decode the JWT token to get the user ID
        const decoded = VueJwtDecode.decode(token);
        const userId = decoded.id;
        console.log(userId);

        // Fetch user details from Strapi using the user ID
        const response = await axios.get(`https://strapi-sever-ev.onrender.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set userName and email from the response
        this.userName = response.data.username;
        this.email = response.data.email;
        this.documentId = response.data.documentId;
      } catch (error) {
        console.error("Error fetching user details or decoding JWT:", error);
      }
    } else {
      console.warn("No JWT token found. Please log in first.");
    }
    if (chargerId, token) {
      try {
        const response = await axios.get(`https://strapi-sever-ev.onrender.com/api/chargers/${chargerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.charger.name = response.data.data.name;
        this.charger.available = response.data.data.available;
        this.charger.documentId = response.data.data.documentId;

        console.log(response.data.data.name);
        console.log(response.data.data.available);
        console.log(response.data.data.documentId);

      } catch (error) {
        console.error("Failed to fetch charger details:", error);
      }
    }
  },


};
</script>

<style scoped>
.booking-page {
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

.charger-details {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.availability {
  color: #1eff00;
  font-size: 20px;
  margin-bottom: 1.5rem;
}

.select-time {
  margin: 1rem 0;
}

.select-time label {
  font-size: 1rem;
  margin-right: 0.5rem;
}

select {
  padding: 0.5rem;
  border-radius: 5px;
  background-color: #333;
  color: #ffffff;
  border: none;
}

.create-reservation {
  background-color: #00ffcc;
  color: #1e1e1e;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #00ffcc;
}

.modal .select-time {
  margin: 1rem 0;
}

.modal button {
  background-color: #00ffcc;
  color: #1e1e1e;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.modal button:last-of-type {
  background-color: #333;
  color: #ffffff;
  margin-left: 0.5rem;
}

.select-time-button {
  background-color: #00ffcc;
  border-radius: 5px;
  padding: 0.25rem;
}
</style>