<template>
  <div class="parking-ticket">
    <!-- Back button and header -->
    <div class="header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>New Parking Reservation</h1>
    </div>

    <!-- Reservation Form -->
    <form @submit.prevent="submitReservation">
      <div class="form-group">
        <label for="parking_spot">Parking Spot</label>
        <select v-model="reservation.parking_spot" id="parking_spot" required>
          <option v-for="spot in parkingSpots" :key="spot.id" :value="spot.id">
            {{ spot.attributes.name }} - {{ spot.attributes.zone }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="startTime">Start Time</label>
        <input type="datetime-local" v-model="reservation.startTime" id="startTime" required />
      </div>

      <div class="form-group">
        <label for="endTime">End Time</label>
        <input type="datetime-local" v-model="reservation.endTime" id="endTime" required />
      </div>

      <div class="form-group">
        <label for="totalCost">Total Cost ($)</label>
        <input type="number" v-model="reservation.totalCost" id="totalCost" required />
      </div>

      <div class="form-group">
        <label for="statusRV">Status</label>
        <select v-model="reservation.statusRV" id="statusRV">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button type="submit" class="submit-button">Create Reservation</button>
    </form>

    <!-- Confirmation Message -->
    <div v-if="confirmationMessage" class="confirmation-message">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reservation: {
        parking_spot: '',  // Initially empty, filled by user selection
        startTime: '',
        endTime: '',
        totalCost: 0,
        statusRV: 'pending',
      },
      parkingSpots: [],         // Array to store parking spot options
      confirmationMessage: '',  // Message to show upon successful submission
    };
  },
  methods: {
    async fetchParkingSpots() {
      try {
        const response = await axios.get('https://strapi-sever-ev.onrender.com/api/parking-spots');
        this.parkingSpots = response.data.data;
      } catch (error) {
        console.error('Error fetching parking spots:', error);
      }
    },
    async submitReservation() {
      try {
        const response = await axios.post('https://strapi-sever-ev.onrender.com/api/reservations', {
          data: {
            parking_spot: this.reservation.parking_spot,
            startTime: this.reservation.startTime,
            endTime: this.reservation.endTime,
            totalCost: this.reservation.totalCost,
            statusRV: this.reservation.statusRV,
          },
        });
        
        if (response.status === 200 || response.status === 201) {
          this.confirmationMessage = 'Reservation created successfully!';
          this.clearForm(); // Clear the form after successful submission
        } else {
          this.confirmationMessage = 'Failed to create reservation. Please try again.';
        }
      } catch (error) {
        console.error('Error creating reservation:', error);
        this.confirmationMessage = 'An error occurred. Please try again.';
      }
    },
    goBack() {
      this.$router.go(-1); // Navigate back to the previous page
    },
    clearForm() {
      this.reservation = {
        parking_spot: '',
        startTime: '',
        endTime: '',
        totalCost: 0,
        statusRV: 'pending',
      };
    }
  },
  mounted() {
    this.fetchParkingSpots(); // Fetch parking spots when component mounts
  },
};
</script>

<style scoped>
/* Existing styles plus form styling */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.confirmation-message {
  margin-top: 1rem;
  font-weight: bold;
  color: #4caf50;
}
</style>
