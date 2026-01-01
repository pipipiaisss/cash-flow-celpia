<script setup>
import { ref, computed, onMounted } from 'vue';
import TransactionList from '../components/TransactionList.vue';
import FilterControls from '../components/FilterControls.vue';
import { useTransactions } from '../composables/useTransactions';
import { useApi } from '../composables/useApi';

const { transactions, fetchTransactions } = useTransactions();
const { deleteTransaction } = useApi();

const today = new Date();
const selectedMonth = ref(today.getMonth() + 1);
const selectedYear = ref(today.getFullYear());
const filterDateType = ref('realizationDate');
const transactionTypeFilter = ref('all');
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
    if (!t[filterDateType.value]) return false;
    const date = new Date(t[filterDateType.value]);
    const monthMatch = date.getMonth() + 1 === selectedMonth.value;
    const yearMatch = date.getFullYear() === selectedYear.value;
    return monthMatch && yearMatch;
  });
});

const displayTransactions = computed(() => {
  if (transactionTypeFilter.value === 'all') {
    return filteredByDate.value;
  }
  return filteredByDate.value.filter(t => t.type === transactionTypeFilter.value);
});

const handleDeleteTransaction = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.");
  if (confirmed) {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      alert("Failed to delete the transaction. Please try again.");
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
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

onMounted(async () => {
  isLoading.value = true;
  await fetchTransactions();
  isLoading.value = false;
});

</script>

<template>
  <div class="report-container">
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
      :selectedMonth="selectedMonth" 
      :selectedYear="selectedYear" 
      :filterDateType="filterDateType"
      :transactions="transactions" 
      @update:month="selectedMonth = $event"
      @update:year="selectedYear = $event"
      @update:filterDateType="filterDateType = $event"
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
    />
  </div>
</template>

<style scoped>
.report-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color-light);
}

.card p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.card.income p { color: #31e89f; }
.card.outcome p { color: #ff79c6; }
.card.net-flow p { color: var(--primary-color); }

.transaction-type-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.transaction-type-filter button {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  color: var(--text-color-light);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
}

.transaction-type-filter button:hover { 
  background-color: rgba(255, 255, 255, 0.1); 
}

.transaction-type-filter button.active {
  background-color: var(--primary-color);
  color: var(--background-dark);
  border-color: var(--primary-color);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .report-container {
    padding: 1rem;
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
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>