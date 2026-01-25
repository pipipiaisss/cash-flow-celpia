<script setup>
import { ref, computed, onMounted } from 'vue';
import TransactionList from '../components/TransactionList.vue';
import FilterControls from '../components/FilterControls.vue';
import { useTransactions } from '../composables/useTransactions';
import { useApi } from '../composables/useApi';

const { transactions, fetchTransactions } = useTransactions();
const { deleteTransaction, updateTransaction } = useApi();

const today = new Date();
const selectedMonth = ref(today.getMonth() + 1); // Default to current month
const selectedYear = ref(today.getFullYear());  // Default to current year
const filterDateType = ref('realizationDate');
const transactionTypeFilter = ref('all');
const searchQuery = ref('');
const isLoading = ref(true);

const setTransactionTypeFilter = (type) => {
  transactionTypeFilter.value = type;
};

const filteredByDate = computed(() => {
  const sorted = transactions.value.slice().sort((a, b) => {
    const dateA = new Date(a.realizationDate || a.plannedDate);
    const dateB = new Date(b.realizationDate || b.plannedDate);
    return dateB - dateA;
  });

  return sorted.filter(t => {
    const dateValue = t[filterDateType.value];
    if (!dateValue) return false;
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false; // Skip invalid dates

    const monthMatch = selectedMonth.value === 0 || (date.getMonth() + 1 === selectedMonth.value);
    const yearMatch = selectedYear.value === 0 || (date.getFullYear() === selectedYear.value);

    return monthMatch && yearMatch;
  });
});

const displayTransactions = computed(() => {
  let filtered = filteredByDate.value;

  // Filter by transaction type (Cash In/Cash Out)
  if (transactionTypeFilter.value !== 'all') {
    filtered = filtered.filter(t => t.type === transactionTypeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      (t.name && t.name.toLowerCase().includes(lowerCaseQuery)) ||
      (t.description && t.description.toLowerCase().includes(lowerCaseQuery))
    );
  }

  return filtered;
});

const handleDeleteTransaction = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.");
  if (confirmed) {
    try {
      await deleteTransaction(id);
      await fetchTransactions(); 
    } catch (error) {
      console.error("Failed to delete the transaction:", error);
      alert("Failed to delete the transaction. Please try again.");
      if (error.response) {
        console.error('Backend Error Response:', error.response.data);
      }
    }
  }
};

const handleUpdateTransaction = async (id, data) => {
    try {
        await updateTransaction(id, data);
        await fetchTransactions();
    } catch (error) {
        console.error('Failed to update transaction:', error);
        alert('Failed to update transaction. Please try again.');
        if (error.response) {
            console.error('Backend Update Error:', error.response.data);
        }
    }
};

const totalIncome = computed(() => {
  return displayTransactions.value
    .filter(t => t.type === 'cash-in' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const totalOutcome = computed(() => {
  return displayTransactions.value
    .filter(t => t.type === 'cash-out' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const netCashFlow = computed(() => totalIncome.value - totalOutcome.value);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

onMounted(async () => {
  isLoading.value = true;
  await fetchTransactions();
  isLoading.value = false;
});

</script>

<template>
  <div class="report-container">
    <header class="view-header">
      <h1>Laporan Keuangan</h1>
      <p>Analisis terperinci tentang pemasukan dan pengeluaran Anda.</p>
    </header>
    <div class="summary-cards">
      <div class="card income">
        <h3>Pemasukan</h3>
        <p>{{ formatCurrency(totalIncome) }}</p>
      </div>
      <div class="card outcome">
        <h3>Pengeluaran</h3>
        <p>{{ formatCurrency(totalOutcome) }}</p>
      </div>
      <div class="card net-flow">
        <h3>Cash Flow Bersih</h3>
        <p>{{ formatCurrency(netCashFlow) }}</p>
      </div>
    </div>
    <FilterControls 
      v-model:searchQuery="searchQuery"
      v-model:selectedMonth="selectedMonth" 
      v-model:selectedYear="selectedYear" 
      v-model:filterDateType="filterDateType"
      :transactions="transactions"
    />
    <div class="transaction-type-filter">
      <button @click="setTransactionTypeFilter('all')" :class="{ active: transactionTypeFilter === 'all' }">Semua</button>
      <button @click="setTransactionTypeFilter('cash-in')" :class="{ active: transactionTypeFilter === 'cash-in' }">Pemasukan</button>
      <button @click="setTransactionTypeFilter('cash-out')" :class="{ active: transactionTypeFilter === 'cash-out' }">Pengeluaran</button>
    </div>
    <TransactionList 
        :transactions="displayTransactions" 
        :is-loading="isLoading" 
        @delete-transaction="handleDeleteTransaction" 
        @update-transaction="handleUpdateTransaction"
    />
  </div>
</template>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  box-sizing: border-box;
}

.view-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.view-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.view-header p {
  font-size: 1.1rem;
  color: var(--text-color-light);
  margin-top: 0.5rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2);
}


.card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color-dark);
}

.card p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.card.income p { color: #22c55e; }
.card.outcome p { color: var(--primary-color); }
.card.net-flow p { color: #3b82f6; }

.transaction-type-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.transaction-type-filter button {
  padding: 10px 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: var(--text-color-dark);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.transaction-type-filter button:hover { 
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.transaction-type-filter button.active {
  background-color: var(--primary-color);
  color: var(--white-color);
  border-color: var(--primary-color);
  box-shadow: 0 5px 15px rgba(236, 72, 153, 0.4);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .report-container {
    padding: 1rem;
  }

  .view-header h1 {
    font-size: 2rem;
  }

  .summary-cards {
    gap: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .card h3 {
    font-size: 1rem;
  }

  .card p {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .card p {
    font-size: 1.4rem;
  }

  .transaction-type-filter button {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>
