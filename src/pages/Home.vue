<template>
  <div class="home">
    <header class="home-header">
      <h1>Welcome to the Parking App</h1>
      <p>Find and reserve parking spaces easily.</p>
      <button @click="goToParkingList">View Available Parking</button>
    </header>

    <section class="home-features">
      <h2>{{ userName }}</h2>
      <p>{{ email }}</p>
    </section>
  </div>
</template>


<script>
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode'

export default {
  name: "Home",
  data() {
    return {
      userName: '', // To store the user's name
      email: '',    // To store the user's email
    };
  },
  methods: {
    goToParkingList() {
      this.$router.push("/parking-list");
    }
  },
  async mounted() {
    // Get the JWT token from local storage
    const token = localStorage.getItem("jwt");

    console.log(token);

    if (token) {
      try {
        // Decode the JWT token to get the user ID
        const decoded = VueJwtDecode.decode(token);
        const userId = decoded.id;
        console.log(userId)
        // Fetch user details from Strapi using the user ID
        try {
          const response = await axios.get('https://strapi-sever-ev.onrender.com/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('User data:', response.data); // Process user data here
        } catch (error) {
          console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        }

        // Set userName and email from the response
        this.userName = response.data.username;
        this.email = response.data.email;

      } catch (error) {
        console.error("Error fetching user details or decoding JWT:", error);
      }
    } else {
      console.warn("No JWT token found. Please log in first.");
    }
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