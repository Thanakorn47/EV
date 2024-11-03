<template>
  <div class="parking-list">
    <!-- Header Section -->
    <header class="header">
      <h1>List EV Charger</h1>
      <div class="search-filter">
        <input type="text" v-model="searchQuery" placeholder="Search by location or charger type"
          @input="filterChargers" />
      </div>
    </header>

    <!-- Chargers List Section -->
    <ul class="charger-list">
      <li v-for="charger in filteredChargers" :key="charger.id" class="charger-card">
        <div class="charger-header">
          <h2>{{ charger.name }}</h2>
          <p>{{ charger.location }} - {{ charger.distance }} km away</p>
        </div>
        <div class="charger-details">
          <p>Type: <strong>{{ charger.type }}</strong></p>
          <p>Power: <strong>{{ charger.powerRating }}</strong></p>
          <p>Available Spots: <strong>{{ charger.freeSpots }}</strong></p>
        </div>

        <!-- List of Cars in Parking Space -->
        <div v-if="charger.cars.length" class="parked-cars">
          <h3>Currently Parked:</h3>
          <ul>
            <li v-for="car in charger.cars" :key="car.plate" class="car-info">
              <p><strong>{{ car.model }}</strong> - {{ car.plate }} ({{ car.chargingStatus }})</p>
            </li>
          </ul>
        </div>

        <div v-else class="no-cars">
          <p>No cars currently parked.</p>
        </div>

        <button class="details-button" @click="navigateToCharger(charger.id)">View Details</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      filters: {
        freeSpots: false,
        chargerType: "",
        powerRating: "",
      },
      chargers: [
        {
          id: 1,
          name: "Central Mall - EV Charger",
          location: "Downtown",
          distance: 0.5,
          type: "fast",
          powerRating: "150kW",
          freeSpots: 1,
          cars: [
            {
              model: "Tesla Model 3",
              plate: "ABC-123",
              chargingStatus: "Charging",
            },
            {
              model: "Nissan Leaf",
              plate: "XYZ-789",
              chargingStatus: "Charged",
            },
          ],
        },
        {
          id: 2,
          name: "City Park Charger",
          location: "Uptown",
          distance: 1.2,
          type: "standard",
          powerRating: "50kW",
          freeSpots: 0,
          cars: [
            {
              model: "Chevy Bolt",
              plate: "DEF-456",
              chargingStatus: "Charging",
            },
          ],
        },
        // Add more chargers as needed
      ],
      filteredChargers: [],
    };
  },
  methods: {
    filterChargers() {
      this.filteredChargers = this.chargers.filter((charger) => {
        const matchesSearchQuery =
          charger.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          charger.location.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesFreeSpots = !this.filters.freeSpots || charger.freeSpots > 0;
        const matchesChargerType = !this.filters.chargerType || charger.type === this.filters.chargerType;
        const matchesPowerRating = !this.filters.powerRating || charger.powerRating === this.filters.powerRating;

        return matchesSearchQuery && matchesFreeSpots && matchesChargerType && matchesPowerRating;
      });
    },
    navigateToCharger(id) {
      alert(`Navigating to charger ${id}`);
    },
  },
  mounted() {
    this.filteredChargers = this.chargers;
  },
};
</script>

<style scoped>
.parking-list {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

h1 {
  font-size: 1.8em;
  color: #333;
}

.search-filter input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
}

.filters {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.filter-item {
  font-size: 0.9em;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.charger-list {
  list-style: none;
  padding: 0;
}

.charger-card {
  background: #f9f9f9;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.charger-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.charger-header h2 {
  font-size: 1.4em;
  margin: 0;
  color: #333;
}

.charger-header p {
  color: #777;
  margin-top: 4px;
}

.charger-details {
  font-size: 0.9em;
  color: #666;
}

.parked-cars h3 {
  font-size: 1em;
  color: #333;
}

.car-info {
  font-size: 0.9em;
  color: #444;
}

.no-cars {
  color: #888;
  font-size: 0.9em;
  margin: 8px 0;
}

.details-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.details-button:hover {
  background-color: #0056b3;
}
</style>