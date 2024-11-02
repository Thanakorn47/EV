<template>
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 Parking App. All rights reserved.</p>
        <nav class="footer-nav">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
        </nav>
        <div class="social-icons">
          <a href="https://facebook.com" target="_blank">FB</a>
          <a href="https://twitter.com" target="_blank">TW</a>
          <a href="https://instagram.com" target="_blank">IG</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer"
  };
  </script>
  
  <style scoped>
  .app-footer {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
  }
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-nav a, .social-icons a {
    margin: 0 0.5rem;
    color: #fff;
    text-decoration: none;
  }
  </style>
  