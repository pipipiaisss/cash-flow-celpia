<script setup>
import { computed } from 'vue';

const props = defineProps({
  transactions: Array,
  filteredTransactions: Array,
  selectedMonth: Number,
  selectedYear: Number,
  filterDateType: String,
});

const emit = defineEmits(['update:month', 'update:year', 'update:filterDateType']);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const totalCashIn = computed(() => {
  return props.filteredTransactions
    .filter(t => t.type === 'cash-in' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const totalCashOut = computed(() => {
  return props.filteredTransactions
    .filter(t => t.type === 'cash-out' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const balance = computed(() => {
  return totalCashIn.value - totalCashOut.value;
});

const totalPlannedCashIn = computed(() => {
  return props.filteredTransactions
    .filter(t => t.type === 'cash-in')
    .reduce((sum, t) => sum + t.plannedAmount, 0);
});

const totalPlannedCashOut = computed(() => {
  return props.filteredTransactions
    .filter(t => t.type === 'cash-out')
    .reduce((sum, t) => sum + t.plannedAmount, 0);
});

const onMonthChange = (event) => {
  emit('update:month', parseInt(event.target.value));
}

const onYearChange = (event) => {
  emit('update:year', parseInt(event.target.value));
}

const onFilterDateTypeChange = (event) => {
  emit('update:filterDateType', event.target.value);
}

</script>

<template>
  <div class="dashboard">
    <div class="filters">
      <div class="filter-group">
        <label>Month:</label>
        <input type="number" :value="selectedMonth" @input="onMonthChange" min="1" max="12" />
      </div>
      <div class="filter-group">
        <label>Year:</label>
        <input type="number" :value="selectedYear" @input="onYearChange" />
      </div>
      <div class="filter-group radio-group">
        <label>
          <input type="radio" value="realizationDate" :checked="filterDateType === 'realizationDate'" @change="onFilterDateTypeChange" />
          Realization Date
        </label>
        <label>
          <input type="radio" value="plannedDate" :checked="filterDateType === 'plannedDate'" @change="onFilterDateTypeChange" />
          Planned Date
        </label>
      </div>
    </div>
    <div class="summary">
      <div class="summary-item">
        <h4>Total Planned In</h4>
        <p>{{ formatCurrency(totalPlannedCashIn) }}</p>
      </div>
      <div class="summary-item">
        <h4>Total Planned Out</h4>
        <p>{{ formatCurrency(totalPlannedCashOut) }}</p>
      </div>
      <div class="summary-item">
        <h4>Total Realized In</h4>
        <p>{{ formatCurrency(totalCashIn) }}</p>
      </div>
       <div class="summary-item">
        <h4>Total Realized Out</h4>
        <p>{{ formatCurrency(totalCashOut) }}</p>
      </div>
      <div class="summary-item balance">
        <h4>Balance</h4>
        <p>{{ formatCurrency(balance) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.filters {
  display: flex;
  flex-wrap: wrap; /* Allow filters to wrap on smaller screens if needed */
  gap: 20px;
  align-items: center;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.radio-group {
  display: flex;
  gap: 15px;
}
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}
.summary-item {
  background-color: #F9FAFB;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}
.summary-item h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #6B7280;
}
.summary-item p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}
.balance p {
  color: var(--accent-color);
}
</style>
