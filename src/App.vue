<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from './composables/useApi';

const { transactions, fetchTransactions } = useApi();
const router = useRouter();

const today = new Date();
const selectedMonth = ref(today.getMonth() + 1);
const selectedYear = ref(today.getFullYear());
const filterDateType = ref('realizationDate');

// This function will be called when a new transaction is added
const handleTransactionAdded = () => {
  // Refetch all transactions to update the list
  fetchTransactions();
};

const filteredTransactions = computed(() => {
  // Ensure transactions are sorted by date, most recent first
  const sorted = transactions.value.slice().sort((a, b) => {
    const dateA = new Date(a.realizationDate || a.plannedDate);
    const dateB = new Date(b.realizationDate || b.plannedDate);
    return dateB - dateA;
  });

  return sorted.filter(t => {
    if (!t[filterDateType.value]) return false;
    const date = new Date(t[filterDateType.value]);
    const monthMatch = date.getMonth() + 1 === selectedMonth.value;
    const yearMatch = date.getFullYear() === selectedYear.value;
    return monthMatch && yearMatch;
  });
});

const updateMonth = (month) => {
  selectedMonth.value = month;
};

const updateYear = (year) => {
  selectedYear.value = year;
};

const updateFilterDateType = (type) => {
  filterDateType.value = type;
};

onMounted(fetchTransactions);
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-container">
        <h1 class="title">Cash Flow</h1>
        <nav>
          <router-link to="/dashboard" class="nav-button">Dashboard</router-link>
          <router-link to="/report" class="nav-button">Report</router-link>
          <router-link to="/input" class="nav-button">Input Data</router-link>
        </nav>
      </div>
    </header>
    <main>
      <router-view 
        :transactions="transactions" 
        :filteredTransactions="filteredTransactions" 
        :selectedMonth="selectedMonth"
        :selectedYear="selectedYear"
        :filterDateType="filterDateType"
        @update:month="updateMonth"
        @update:year="updateYear"
        @update:filterDateType="updateFilterDateType"
        @transaction-added="handleTransactionAdded"
      />
    </main>
  </div>
</template>

<style>
/* Global Styles */
:root {
  --primary-color: #4f46e5;
  --accent-color: #10b981;
  --background-color: #f3f4f6;
  --text-color: #1f2937;
  --white-color: #ffffff;
  --primary-dark-color: #4338ca;
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif; /* Using Poppins as primary font */
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
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.nav-button.router-link-exact-active {
  background-color: var(--white-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 600;
}

main {
  flex-grow: 1;
  padding: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}


/* Input and Button base styles */
input[type="text"],
input[type="date"],
select,
textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 8px;
    font-size: 1rem;
    background-color: #f9fafb; /* gray-50 */
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

input[type="text"]:focus,
input[type="date"]:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
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
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
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
