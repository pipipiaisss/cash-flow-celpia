<script setup>
import { ref, computed } from 'vue';
import TransactionList from '../components/TransactionList.vue';
import FilterControls from '../components/FilterControls.vue';
import { useApi } from '../composables/useApi';

const props = defineProps({
  transactions: Array,
  filteredTransactions: Array,
  selectedMonth: Number,
  selectedYear: Number,
  filterDateType: String,
  isLoading: Boolean
});

const emit = defineEmits([
  'update:month',
  'update:year',
  'update:filterDateType'
]);

const { deleteTransaction } = useApi();

// --- State untuk Filter Jenis Transaksi ---
const transactionTypeFilter = ref('all'); // 'all', 'cash-in', 'cash-out'

const setTransactionTypeFilter = (type) => {
  transactionTypeFilter.value = type;
};

// --- Computed Property untuk memfilter transaksi lebih lanjut ---
const displayTransactions = computed(() => {
  if (transactionTypeFilter.value === 'all') {
    return props.filteredTransactions;
  }
  return props.filteredTransactions.filter(t => t.type === transactionTypeFilter.value);
});

const handleDeleteTransaction = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.");
  if (confirmed) {
    try {
      await deleteTransaction(id);
    } catch (error) {
      alert("Failed to delete the transaction. Please try again.");
    }
  }
};

// --- Computed Properties untuk Ringkasan, sekarang berdasarkan displayTransactions ---
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
      @update:month="emit('update:month', $event)"
      @update:year="emit('update:year', $event)"
      @update:filterDateType="emit('update:filterDateType', $event)"
    />
    <!-- Tombol Filter Jenis Transaksi -->
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
  padding: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background-color: var(--white-color);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}

.card h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #6b7280;
}

.card p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.card.income p {
  color: #10b981;
}

.card.outcome p {
  color: #ef4444;
}

.card.net-flow p {
  color: var(--primary-color);
}

/* Styling untuk Tombol Filter */
.transaction-type-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.transaction-type-filter button {
  padding: 8px 16px;
  border: 1px solid #d1d5db; /* gray-300 */
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
}

.transaction-type-filter button:hover {
  background-color: #f3f4f6; /* gray-100 */
}

.transaction-type-filter button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
</style>
