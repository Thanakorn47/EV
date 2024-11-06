// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ParkingDetails from '../pages/ParkingDetails.vue';
import Slotbooking from '../pages/Slotbooking.vue';
import Booknow from '../pages/booknow.vue';
import Map from '../pages/map.vue';




const routes = [
  { path: '/', component: Login},
  { path: '/home', component: Home},
  { path: '/register', component: Register },
  { path: '/ParkingDetails', component: ParkingDetails },
  { path: '/slotbooking', component: Slotbooking },
  { path: '/booknow', component: Booknow },
  { path: '/map', component: Map },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
