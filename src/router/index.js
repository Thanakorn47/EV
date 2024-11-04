// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import ParkingList from '../pages/ParkingList.vue';
import ParkingDetails from '../pages/ParkingDetails.vue';
import Profile from '../pages/Profile.vue';

const routes = [
  { path: '/', component: Login},
  { path: '/home', component: Home},
  { path: '/register', component: Register },
  { path: '/ParkingDetails', component: ParkingDetails },
  { path: '/parking-list', component: ParkingList },
  { path: '/profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
