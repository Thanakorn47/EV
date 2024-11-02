<template>
    <div class="parking-ticket">
      <!-- Back button and receipt download -->
      <div class="header">
        <button class="back-button">⬅</button>
        <h1>Parking ticket details</h1>
        <button class="receipt-button">Receipt ⬇</button>
      </div>
  
      <!-- Parking Details -->
      <div class="parking-detail">
        <div class="parking-info">
          <div class="parking-icon">P</div>
          <div class="parking-text">
            <p><strong>ZG1234IG</strong> · Mamin AUTO</p>
            <p>Zone 1 - Rovinj</p>
            <p>Hourly parking ticket</p>
          </div>
        </div>
      </div>
  
      <!-- Log Activities -->
      <div class="log-activities">
        <h2>Log activities</h2>
        <div class="log-item">
          <span class="log-time">15 : 06</span> <span class="log-date">03:06:2022</span>
        </div>
        <div class="log-item">
          <span class="log-time">15 : 41</span> <span class="log-date">03:06:2022</span>
        </div>
      </div>
  
      <!-- Payment Information -->
      <div class="payment-info">
        <div class="card-details">
          <img src="https://example.com/mastercard-logo.png" alt="Mastercard Logo" class="card-logo">
          <p>3056****5904</p>
          <p>Ivan Horvat · 06/26</p>
        </div>
        <div class="total">
          <p><strong>Total</strong></p>
          <p><strong>$ 1.00</strong></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Data properties can go here if needed
      };
    },
  };
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
  
  .parking-ticket {
    max-width: 600px; /* Wider max-width for larger screens */
    width: 90%; /* Relative width for better responsiveness */
    margin: 40px auto;
    padding: 2rem; /* Increased padding for a balanced layout */
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .back-button,
  .receipt-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
    margin: 0;
  }
  
  .parking-detail {
    margin-top: 3.5rem;
    padding: 2.5rem;
    background-color: #bebebe;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }
  
  .parking-info {
    display: flex;
    align-items: center;
  }
  
  .parking-icon {
    font-size: 2rem;
    background-color: grey;
    color: #fff;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 1rem;
  }
  
  .parking-text p {
    margin: 0;
    font-size: 1rem;
  }
  
  .log-activities {
    margin-top: 1.5rem;
  }
  
  .log-activities h2 {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .log-item {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
  }
  
  .log-time {
    color: #4caf50;
    font-size: 1rem;
    font-weight: bold;
  }
  
  .payment-info {
    margin-top: 2.5rem;
    padding: 2rem;
    background-color: #bebebe;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-details {
    display: flex;
    align-items: center;
  }
  
  .card-logo {
    width: 40px;
    height: auto;
    margin-right: 10px;
  }
  
  .total p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: right;
  }
  
  /* Media Query for Larger Screens */
  @media (min-width: 768px) {
    .parking-ticket {
      max-width: 800px; /* Increase max-width for larger screens */
      padding: 2.5rem; /* Add padding for a balanced layout */
    }
    
    .parking-icon {
      width: 70px;
      height: 70px;
      font-size: 2.5rem;
    }
    
    .back-button, .receipt-button {
      font-size: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  
    .log-time, .log-activities h2, .parking-text p {
      font-size: 1.2rem; /* Larger text for improved readability */
    }
    
    .total p {
      font-size: 1.4rem;
    }
  }
  </style>