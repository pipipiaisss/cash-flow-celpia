<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';

const router = useRouter();
const { isAuthenticated, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};

</script>

<template>
  <div id="app">
    <header class="app-header" v-if="isAuthenticated">
      <div class="header-container">
        <h1 class="title">Cash Flow</h1>
        <nav>
          <router-link to="/dashboard" class="nav-button">Dashboard</router-link>
          <router-link to="/report" class="nav-button">Report</router-link>
          <router-link to="/input" class="nav-button">Input Data</router-link>
          <button @click="handleLogout" class="nav-button logout-button">Logout</button>
        </nav>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global Styles */
:root {
  --primary-color: #00f2fe; /* Bright cyan for accents */
  --secondary-color: #ff79c6; /* Pink for other accents */
  --background-dark: #1a1a2e;
  --background-light: #2a2a4a;
  --text-color-light: #e0e0e0;
  --white-color: #ffffff;
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-light) 100%);
  color: var(--text-color-light);
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.title {
  font-size: 2.5rem;
  color: var(--white-color);
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}

/* Header Styles */
.app-header {
  background-color: transparent; /* Make header transparent */
  padding: 20px 40px;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-button {
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color-light);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--white-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.nav-button.router-link-exact-active {
  background-color: var(--primary-color);
  color: var(--background-dark);
  font-weight: 700;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
}

.logout-button {
    background-color: transparent;
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
}

.logout-button:hover {
    background-color: var(--secondary-color);
    color: var(--white-color);
    box-shadow: 0 0 15px rgba(255, 121, 198, 0.5);
}

main {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .app-header {
    padding: 20px;
  }
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .title {
    font-size: 2rem;
  }

  nav {
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}

</style>
