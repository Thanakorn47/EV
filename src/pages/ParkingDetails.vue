<template>
  <div class="parking-ticket-details">
    <header>
      <button @click="goBack" class="back-button">←</button>
      <h2>Receipt</h2>
    </header>

    <div class="ticket-info">
      <div class="parking-icon">
        <i class="fa fa-parking"></i> <!-- Use an appropriate icon here -->
      </div>
      <div class="ticket-details">
        <p>ZG1234IG - Mamin AUTO</p>
        <p>Zone 1 - Rovinj</p>
        <p>Hourly parking ticket</p>
      </div>
    </div>

    <div class="log-activities">
      <h3>Log activities</h3>
      <div v-for="(log, index) in logs" :key="index" class="log-entry">
        <span>{{ log.time }}</span>
        <span>{{ log.date }}</span>
      </div>
    </div>

    <div class="payment-info">
      <div class="card-info">
        <i class="fa fa-credit-card"></i> <!-- Use an appropriate icon here -->
        <span>3056****5904</span>
      </div>
      <div class="payer-name">Ivan Horvat / 06/26</div>
      <div class="total">
        <span>Total</span>
        <span>HRK 1.00</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logs: [
        { time: "15:06", date: "03.08.2022" },
        { time: "15:41", date: "03.08.2022" }
      ]
    };
  },
  methods: {
    goBack() {
      // Logic to go back to the previous page
    }
  }
};
</script>

<style scoped>
.parking-ticket-details {
  width: 300px;
  padding: 16px;
  background-color: #f8f9fb;
  border-radius: 12px;
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.back-button {
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
}

.ticket-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.parking-icon {
  font-size: 24px;
  color: green;
  margin-right: 12px;
}

.ticket-details p {
  margin: 2px 0;
}

.log-activities h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.log-entry {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.payment-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
}

.card-info {
  font-size: 18px;
  margin-bottom: 4px;
}

.payer-name {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.total {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
