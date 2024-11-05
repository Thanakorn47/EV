// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ParkingList from '../pages/ParkingList.vue';
import ParkingDetails from '../pages/ParkingDetails.vue';
import Slotbooking from '../pages/Slotbooking.vue';
import Addnew from '../pages/addnew.vue';
import Reservation from '../pages/Reservation.vue';
import Booknow from '../pages/booknow.vue';
import Map from '../pages/map.vue';




const routes = [
  { path: '/', component: Login},
  { path: '/home', component: Home},
  { path: '/register', component: Register },
  { path: '/ParkingDetails', component: ParkingDetails },
  { path: '/parking-list', component: ParkingList },
  { path: '/slotbooking', component: Slotbooking },
  { path: '/addnew', component: Addnew},
  { path: '/reservation', component: Reservation },
  { path: '/booknow', component: Booknow },
  { path: '/map', component: Map },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
