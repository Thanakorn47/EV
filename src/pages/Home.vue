<template>
  <div class="home">
    <header class="home-header">
      <h1>Welcome to the Parking App</h1>
      <p>Find and reserve parking spaces easily.</p>
      <button @click="goToParkingList">View Available Parking</button>
    </header>

    <section class="home-features">
      <div class="feature" v-for="customer in customers" :key="customer.id">
        <h2>{{ customer.username }}</h2>
        <p>{{ customer.email }}</p>
      </div>
    </section>
  </div>
</template>

  
  <script>
  import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      customers: [] // เก็บข้อมูลลูกค้า
    };
  },
  methods: {
    goToParkingList() {
      this.$router.push("/parking-list");
    }
  },
  mounted() {
    // ดึงข้อมูลจาก Strapi
    axios
      .get("https://strapi-sever-ev.onrender.com/api/customers") // แก้ URL เป็น Strapi endpoint ของคุณ
      .then(response => {
        this.customers = response.data.data; // เก็บข้อมูลลูกค้าใน data
      })
      .catch(error => {
        console.error("Error fetching customers:", error);
      });
  }
};
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    padding: 2rem;
  }
  
  .home-header {
    margin-bottom: 2rem;
  }
  
  .home-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .home-header p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .home-header button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .home-features {
    display: flex;
    justify-content: space-around;
    margin-top: 2rem;
  }
  
  .feature {
    width: 30%;
    text-align: left;
  }
  
  .feature h2 {
    font-size: 1.5rem;
    color: #333;
  }
  
  .feature p {
    font-size: 1rem;
    color: #666;
  }
  </style>
  