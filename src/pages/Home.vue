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
          <li @click="goToPayment">Payment</li>
          <li><button @click="logout" class="logout-button">Logout</button></li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div v-if="selectedCar" class="vehicle-details">
        <div class="vehicle-header">
          <h2>Vehicle Details</h2>
        </div>
        <img :src="getImageUrl(selectedCar.yourcar)" alt="Vehicle" class="vehicle-image" />
        <h3 class="vehicle-name">{{ selectedCar.brand + " " + selectedCar.model }}</h3>
        <p class="charging-status">Charging</p>
        <div class="charging-indicator">
          <div class="charging-slot" v-for="slot in 5" :key="slot"></div>
        </div>
      </div>

      <!-- Display the "Add New Car" button separately -->
      <div class="add-new-car-section">
        <button class="add-new" @click="isAddCarModalVisible = true">+ Add New Car</button>
      </div>

      <!-- Car List Section -->
      <section class="car-list">
        <h2>Your Cars</h2>
        <div class="you-car-list">
          <div v-for="car in filteredCars" :key="car.id" class="car-card">
            <img :src="getImageUrl(car.yourcar)" alt="Car Image" @error="onImageError" style="width: 250px;" />
            <div class="car-detail">
              <p>Model: {{ car.model }}</p>
              <p>Brand: {{ car.brand }}</p>
            </div>
            <button class="select-car" @click="selectCar(car)">Select this car</button>
          </div>
        </div>
      </section>
    </main>

    <div v-if="isAddCarModalVisible" class="modal-overlay" @click.self="isAddCarModalVisible = false">
      <div class="modal-content">
        <h2>Add Your Car</h2>
        <form @submit.prevent="addCar">
          <div class="form-group">
            <input type="text" v-model="brand" placeholder="Brand" required />
          </div>
          <div class="form-group">
            <input type="text" v-model="model" placeholder="Model" required />
          </div>
          <div class="form-group">
            <input type="file" @change="handleImageUpload" required />
          </div>
          <button type="submit" class="add-car-button">Add your car!</button>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
        <button class="close-modal-button" @click="isAddCarModalVisible = false">Close</button>
      </div>
    </div>

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
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Home",
  data() {
    return {
      userName: "",
      userDId: "",
      email: "",
      cars: [],
      stations: [],
      bookingHistory: [],
      selectedCar: null, // Holds the selected car
      brand: '',
      model: '',
      imageFile: null,
      successMessage: '',
      errorMessage: '',
      isAddCarModalVisible: false
    };
  },
  computed: {
    filteredCars() {
      return this.cars.filter(car => car.id !== this.selectedCar?.id);
    }
  },
  methods: {
    getImageUrl(path) {
      return path ? `${import.meta.env.VITE_STRAPI_URL}${path}` : 'vehicle-image.png';
    },
    selectCar(car) {
      this.selectedCar = car;
      localStorage.setItem('selectedCar', JSON.stringify(car)); // Save to localStorage
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
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async addCar() {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          let imageId = null;

          // Step 1: Upload the image file to Strapi, if selected
          if (this.imageFile) {
            const formData = new FormData();
            formData.append("files", this.imageFile);

            const imageResponse = await axios.post(
              "https://strapi-sever-ev.onrender.com/api/upload",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            imageId = imageResponse.data[0].id; // Get the uploaded image ID
          }

          // Step 2: Add the car with image reference
          await axios.post(
            "https://strapi-sever-ev.onrender.com/api/vehicles",
            {
              data: {
                brand: this.brand,
                model: this.model,
                user: this.userDId,
                yourcar: imageId, // Associate image ID with the car
              },
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          alert("Car added successfully!");
          this.successMessage = "Car added successfully!";
          this.errorMessage = '';
          this.brand = '';
          this.model = '';
          this.imageFile = null;
          this.isAddCarModalVisible = false; // Close the modal after adding
          this.$router.go(0); // Refresh to load the new car
        } catch (error) {
          this.errorMessage = "Failed to add car. Please try again.";
          console.error("Error adding car:", error.response?.data || error);
        }
      } else {
        this.errorMessage = "You are not authorized. Please log in.";
      }
    },
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("selectedCar"); // Clear selected car on logout
      this.$router.push("/");
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
        this.userDId = userResponse.data.documentId;

        const carResponse = await axios.get(
          `https://strapi-sever-ev.onrender.com/api/vehicles?filters[user][id][$eq]=${userId}&populate=*`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.cars = carResponse.data.data.map((car) => ({
          id: car.id,
          model: car.model,
          brand: car.brand,
          yourcar: car.yourcar?.url, // Using optional chaining to handle missing images
        }));

        // Load selected car from localStorage if it exists
        const savedCar = localStorage.getItem('selectedCar');
        if (savedCar) {
          this.selectedCar = JSON.parse(savedCar);
        } else {
          // Set the first car as the default selected car if none saved
          this.selectedCar = this.cars[0];
          if (this.selectedCar) {
            localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar)); // Save it to localStorage
          }
        }

        // Fetch stations with related chargers
        const stationsResponse = await axios.get(
          "https://strapi-sever-ev.onrender.com/api/stations?populate=*",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
            .sort((a, b) => a.name.localeCompare(b.name)), // Sort by name here
        }));
      } catch (error) {
        console.error("Error fetching data from Strapi:", error);
      }
    }
  },  
};
</script>


<style scoped>
.home {
  display: flex;
  color: #ffffff;
  background-color: #121212;
  /* min-height: 100vh; */
  max-height: 100vh;
}

.sidebar {
  width: 250px;
  padding: 1.5rem;
  background-color: #1a1a1a;
  display: flex;
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

.vehicle-details {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  height: 490px;
  max-height: 490px;
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
  max-height: 250px;
  object-fit: cover;
  object-position: center;
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
  max-height: 100vh;

  /* For Firefox */
  scrollbar-width: thin;
  /* Reduces scrollbar width */
  scrollbar-color: #00ffcc #1a1a1a;
  /* Thumb and track colors */
}

/* For WebKit browsers (Chrome, Safari, Edge) */
.available-slots::-webkit-scrollbar {
  width: 8px;
  /* Width of the scrollbar */
  background-color: #1a1a1a;
  /* Track background color */
}

.available-slots::-webkit-scrollbar-thumb {
  background-color: #00ffcc;
  /* Thumb color */
  border-radius: 4px;
}

.available-slots::-webkit-scrollbar-thumb:hover {
  background-color: #00e6b8;
  /* Thumb color on hover */
}

.available-slots::-webkit-scrollbar-track {
  background-color: #1a1a1a;
  /* Track background color */
  border-radius: 4px;
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
  max-height: 45vh;
}

.car-list h2 {
  margin-bottom: 1.5rem;
}

.you-car-list {
  overflow-y: auto;
  max-height: 30vh;

  /* Optional: To hide scrollbar in Webkit-based browsers */
  scrollbar-width: thin;
  /* For Firefox */
  scrollbar-color: #00ffcc #1a1a1a;
  /* Custom colors for Firefox */
}

/* For WebKit browsers */
.you-car-list::-webkit-scrollbar {
  width: 8px;
  background-color: #1a1a1a;
  /* Track background color */
}

.you-car-list::-webkit-scrollbar-thumb {
  background-color: #00ffcc;
  /* Thumb color */
  border-radius: 4px;
}

.you-car-list::-webkit-scrollbar-thumb:hover {
  background-color: #00e6b8;
  /* Thumb color on hover */
}

.you-car-list::-webkit-scrollbar-track {
  background-color: #1a1a1a;
  /* Track background color */
  border-radius: 4px;
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

.logout-button:hover {
  background-color: red;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.close-modal-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #333;
  border: none;
  border-radius: 8px;
  outline: none;
}

.add-car-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #00ffcc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.success-message {
  color: #2ecc71;
  margin-top: 1rem;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}

.add-new-car-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  /* Optional spacing from the top */
}
</style>
