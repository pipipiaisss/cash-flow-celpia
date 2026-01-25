<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';
import Notification from './components/Notification.vue'; // Re-imported

const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  logout();
  closeMenu();
  router.push('/login');
};
</script>

<template>
  <div id="app">
    <!-- Notification is now a sibling to the main layout, ensuring it's not affected by flexbox -->
    <Notification />

    <div class="main-layout">
      <header class="app-header" v-if="isAuthenticated">
        <div class="header-container">
          <h1 class="title">Cash Flow</h1>
          <button @click="toggleMenu" class="menu-toggle">
            <i :class="isMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
          <nav :class="{ 'nav-open': isMenuOpen }">
            <router-link to="/dashboard" @click="closeMenu" class="nav-button">Dashboard</router-link>
            <router-link to="/report" @click="closeMenu" class="nav-button">Report</router-link>
            <router-link to="/input" @click="closeMenu" class="nav-button">Input Data</router-link>
            <button @click="handleLogout" class="nav-button logout-button">Logout</button>
          </nav>
        </div>
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
/* Global Styles */
:root {
  --primary-color: #EC4899;
  --secondary-color: #F472B6;
  --background-dark: #FBCFE8; /* light pink */
  --background-light: #F9A8D4; /* medium pink */
  --text-color-dark: #1F2937; /* dark grey for text on light background */
  --text-color-light: #FFFFFF; /* white for text on dark background */
  --white-color: #FFFFFF;
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-light) 100%);
  color: var(--text-color-dark);
  min-height: 100vh;
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
  text-shadow: 0 0 10px rgba(236, 72, 153, 0.3);
}

/* Header Styles */
.app-header {
  background-color: transparent;
  padding: 20px 40px;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(236, 72, 153, 0.2);
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
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color-dark);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-button.router-link-exact-active {
  background-color: var(--primary-color);
  color: var(--white-color);
  font-weight: 700;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
}

.logout-button {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.logout-button:hover {
  background-color: var(--primary-color);
  color: var(--white-color);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
}

main {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1001;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .app-header {
    padding: 20px;
    position: relative;
  }

  .header-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .menu-toggle {
      display: block;
  }

  .title {
    font-size: 2rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--background-light);
    transform: translateY(-150%);
    transition: transform 0.3s ease-in-out;
    padding: 10px 0;
    border-bottom: 1px solid rgba(236, 72, 153, 0.2);
    gap: 5px;
  }

  nav.nav-open {
      transform: translateY(0);
  }

  .nav-button {
    padding: 15px 20px;
    font-size: 1rem;
    border-radius: 0;
    width: 100%;
    text-align: center;
  }

  .nav-button:hover {
      transform: none;
      box-shadow: none;
  }

  .logout-button {
      margin: 10px 20px 0;
      width: auto;
  }
}
</style>