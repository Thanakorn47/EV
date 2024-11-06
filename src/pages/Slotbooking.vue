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
                    <li @click="goToOverview">Overview</li>
                    <li @click="goToSlotBooking" class="active">Slot booking</li>
                    <li @click="goToMap">Map</li>
                    <li @click="goToPayment">Payment</li>
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

            <!-- Booking History -->
            <section class="booking-history">
                <h2>Booking History</h2>
                <div v-if="bookingHistory.length > 0">
                    <div v-for="booking in bookingHistory" :key="booking.id" class="booking-card">
                        <div class="sub-booking-card">
                            <p class="booking-title">{{ booking.title }}</p>
                            <p class="booking-time">{{ booking.time }}</p>
                            <p class="booking-slot">Slot: {{ booking.slot }}</p>
                        </div>
                        <button @click="cancelBooking(booking.bookingDId, booking.chargerDId)" class="cancel-booking">
                            Cancel
                        </button>
                    </div>
                </div>
                <p v-else>No booking history available.</p>
            </section>
        </main>

        <aside class="available-slots">
            <h2>Available Stations</h2>
            <div v-for="station in stations" :key="station.id" class="station">
                <h3 class="station-name">{{ station.name }}</h3>

                <div v-for="charger in station.charger_slots" :key="charger.id" class="slot">
                    <p class="slot-title">{{ charger.name }}</p>
                    <p class="slot-status" :class="{ 'not-available': !charger.available }">
                        {{ charger.available ? "Available" : "Not Available" }}
                    </p>
                    <button v-if="charger.available" @click="bookSlot(charger.documentId)" class="book-button">
                        Book Now
                    </button>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {
    name: "Slotbooking",
    data() {
        return {
            userName: "",
            email: "",
            stations: [],
            bookingHistory: [],
            selectedCar: null, // Car details will be stored here
        };
    },
    methods: {
        getImageUrl(path) {
            return path ? `${import.meta.env.VITE_STRAPI_URL}${path}` : 'vehicle-image.png';
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
        bookSlot(chargerId) {
            console.log(chargerId);
            this.$router.push({ path: "/booknow", query: { chargerId: chargerId } });
        },
        goToPayment() {
            this.$router.push("/payment");
        },
        async cancelBooking(bookingID, chargerId) {
            await axios.delete(`https://strapi-sever-ev.onrender.com/api/reservations/${bookingID}`);
            await axios.put(`https://strapi-sever-ev.onrender.com/api/chargers/${chargerId}`, {
                data: { available: true },
            });
            alert("Cancel reservation successfully!");
            this.$router.go(0);
        },
    },
    async mounted() {
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decoded = VueJwtDecode.decode(token);
                const userId = decoded.id;

                // Fetch user details
                const userResponse = await axios.get(
                    `https://strapi-sever-ev.onrender.com/api/users/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.userName = userResponse.data.username;
                this.email = userResponse.data.email;

                // Load the selected car from localStorage
                const savedCar = localStorage.getItem("selectedCar");
                if (savedCar) {
                    this.selectedCar = JSON.parse(savedCar);
                }

                // Fetch stations with related chargers
                const stationsResponse = await axios.get(
                    "https://strapi-sever-ev.onrender.com/api/stations?populate=*",
                    { headers: { Authorization: `Bearer ${token}` } }
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
                        .sort((a, b) => a.name.localeCompare(b.name)), // Sort by name
                }));

                // Fetch booking history for the user
                const historyResponse = await axios.get(
                    `https://strapi-sever-ev.onrender.com/api/reservations?filters[users_permissions_user][id][$eq]=${userId}&populate=charger.station`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.bookingHistory = historyResponse.data.data.map((booking) => ({
                    id: booking.id,
                    bookingDId: booking.documentId,
                    chargerDId: booking.charger.documentId,
                    title: booking.charger.station ? booking.charger.station.name : "Unknown Station",
                    time: `${booking.startTime} - ${booking.endTime}`,
                    slot: booking.charger.name,
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

.vehicle-details {
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
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

.vehicle-image {
    width: 100%;
    max-width: 400px;
    margin-top: 1rem;
    margin-bottom: 1rem;
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
    /* เพิ่มส่วนนี้ */
    max-height: 100vh;
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
    position: relative;
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

.book-button {
    margin-top: 0.5rem;
    background-color: #00ffcc;
    color: #1a1a1a;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
}

.booking-history {
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
}

.booking-history h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.booking-card {
    background-color: #2a2a2a;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.booking-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.booking-time,
.booking-slot {
    color: #888;
}

.available-slots {
    width: 250px;
    padding: 2rem;
    background-color: #1a1a1a;
    scrollbar-width: thin;
    /* For Firefox */
    scrollbar-color: #00ffcc #1a1a1a;
    /* Custom colors for Firefox */
}

.available-slots h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.station {
    margin-bottom: 2rem;
}

.station-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.station-location {
    color: #888;
    margin-bottom: 1rem;
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

.book-button {
    margin-top: 0.5rem;
    background-color: #00ffcc;
    color: #1a1a1a;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
}

.slot-status.not-available {
    color: red;
}

.cancel-booking {
    background-color: rgb(248, 131, 131);
    border: 1px solid red;
    color: #1e1e1e;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-booking:hover {
    background-color: rgb(255, 0, 0);
}
</style>