<template>
    <div class="home">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-section">
                <img src="/path/to/logo.png" alt="Charge & Park Logo" class="logo" />
                <h2>Smart <span class="highlight">EV</span></h2>
            </div>
            <p class="user-name">{{ userName }}</p>
            <nav class="menu">
                <ul>
                    <li @click="goToOverview" class="menu-item">Overview</li>
                    <li @click="goToSlotBooking" class="menu-item">Slot booking</li>
                    <li @click="goToMap">Map</li>
                    <li @click="goToBooking" class="menu-item">Booking</li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="content">


            <!-- Add Car Form -->
            <section class="add-car-form">
                <h2>Add Your Car</h2>
                <form @submit.prevent="addCar">
                    <div class="form-group">
                        <input type="text" v-model="brand" placeholder="Brand" required />
                    </div>
                    <div class="form-group">
                        <input type="text" v-model="model" placeholder="Model" required />
                    </div>
                    <button type="submit" class="add-car-button">Add your car!</button>
                    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </form>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';

export default {
    name: 'AddNew',
    data() {
        return {
            brand: '',
            model: '',
            successMessage: '',
            errorMessage: '',
            userName: '',
            email: '',   
        };
    },
    methods: {
        goToOverview() {
            this.$router.push("/home");
        },
        goToSlotBooking() {
            this.$router.push("/slotbooking");
        },
        goToServiceHistory() {
            this.$router.push("/service-history");
        },
        goToBooking() {
            this.$router.push("/booking");
        },
        async addCar() {
            const token = localStorage.getItem("jwt"); // Retrieve JWT token for authorization
            if (token) {
                try {
                    const response = await axios.post("https://strapi-sever-ev.onrender.com/api/vehicles", {
                        data: {
                            brand: this.brand,
                            model: this.model,
                            user: this.documentId,
                        }
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    this.successMessage = "Car added successfully!";
                    this.errorMessage = '';
                    this.brand = '';
                    this.model = '';
                } catch (error) {
                    this.errorMessage = "Failed to add car. Please try again.";
                    this.successMessage = '';
                    console.error("Error adding car:", error.response?.data || error);
                }
            } else {
                this.errorMessage = "You are not authorized. Please log in.";
            }
        },
    },
    async mounted() {
        // Get the JWT token from local storage
        const token = localStorage.getItem("jwt");

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

.header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
}

.search-input {
    padding: 0.5rem;
    border-radius: 8px;
    border: none;
    outline: none;
    background-color: #1e1e1e;
    color: #ffffff;
}

.add-car-form {
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
}

.add-car-form h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
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
</style>