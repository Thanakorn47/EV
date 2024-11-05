<template>
  <div id="app">
    <!-- <Navbar /> -->
    
    <main class="content">
      <router-view />
    </main>
    
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0; /* Remove any default borders */
}

html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Poppins', sans-serif;
  background-color: #121212;
}

.content {
  flex: 1;
  /* padding: 2rem; */
}
</style>
