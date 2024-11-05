<template>
  <div class="map-page">
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
          <li @click="goToMap" class="active">Map</li>
          <li @click="goToBooking">Booking</li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div id="map" class="map-container"></div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: "MapView",
  data() {
    return {
      userName: "",
      map: null,
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
    initMap() {
      // Center the map on a specific location (example: Chiang Rai)
      const location = { lat: 19.9071, lng: 99.8313 };

      // Initialize the map
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 12,
      });

      // Add a marker at the location
      new google.maps.Marker({
        position: location,
        map: this.map,
        title: "Central Chiang Rai",
      });
    },
  },
  async mounted() {
    const token = localStorage.getItem("jwt");
    if (typeof google !== "undefined") {
      this.initMap();
    } else {
      // If google is undefined, reload the Google Maps API script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = this.initMap;
    }
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

  },
};
</script>

<style scoped>
.map-page {
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
  width:250px;
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
}

.map-container {
  width: 100%;
  height: 100vh;
}
</style>