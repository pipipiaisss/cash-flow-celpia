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
    <main :class="{ 'main-full': !isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global Styles */
:root {
  --primary-color: #007bff;
  --primary-dark-color: #0056b3;
  --background-color: #f5f7fa;
  --text-color: #333;
  --white-color: #ffffff;
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.title {
  font-size: 2.5rem;
  color: var(--primary-color);
  font-weight: 700;
}

/* Header Styles */
.app-header {
  background-color: var(--white-color);
  padding: 20px 40px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  z-index: 1000;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
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
  background-color: var(--primary-color);
  color: var(--white-color);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: var(--primary-dark-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

.nav-button.router-link-exact-active {
  background-color: var(--white-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 600;
}

.logout-button {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}

.logout-button:hover {
    background-color: var(--primary-color);
    color: var(--white-color);
}

main {
  flex-grow: 1;
  padding: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

main.main-full {
    max-width: 100%;
    padding: 0;
}

/* Input and Button base styles */
input[type="text"],
input[type="password"],
input[type="date"],
select,
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="date"]:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background-color: var(--primary-color);
    color: var(--white-color);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

button:hover {
    background-color: var(--primary-dark-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Mobile adjustments */
@media (max-width: 768px) {
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
  
  main {
    padding: 20px;
  }
}
</style>
