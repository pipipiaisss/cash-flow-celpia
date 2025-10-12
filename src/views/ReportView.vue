<script setup>
import { computed } from 'vue';
import TransactionList from '../components/TransactionList.vue';
import FilterControls from '../components/FilterControls.vue';
import { useApi } from '../composables/useApi'; // Import useApi

const props = defineProps({
  transactions: Array,
  filteredTransactions: Array,
  selectedMonth: Number,
  selectedYear: Number,
  filterDateType: String,
  isLoading: Boolean // Receive isLoading prop
});

const emit = defineEmits([
  'update:month',
  'update:year',
  'update:filterDateType'
]);

// Get the delete function from our composable
const { deleteTransaction } = useApi();

const handleDeleteTransaction = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.");
  if (confirmed) {
    try {
      await deleteTransaction(id);
      // The UI will update automatically because the transactions array in useApi is reactive
    } catch (error) {
      // Optionally, show an error message to the user
      alert("Failed to delete the transaction. Please try again.");
    }
  }
};

const totalIncome = computed(() => {
  return props.filteredTransactions
    .filter(t => t.type === 'cash-in' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const totalOutcome = computed(() => {
  return props.filteredTransactions
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
    <TransactionList 
        :transactions="filteredTransactions" 
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
  color: #10b981; /* Accent color for income */
}

.card.outcome p {
  color: #ef4444; /* A contrasting red for outcome */
}

.card.net-flow p {
  color: var(--primary-color);
}
</style>
