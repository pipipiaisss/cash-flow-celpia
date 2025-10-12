<script setup>
import { ref, computed } from 'vue';
import BarChart from '../components/BarChart.vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
});

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);

const availableYears = computed(() => {
  if (props.transactions.length === 0) {
    return [currentYear];
  }
  const years = new Set(props.transactions.map(t => new Date(t.realizationDate || t.plannedDate).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
});

const yearlyTransactions = computed(() => {
  return props.transactions.filter(t => {
    const date = new Date(t.realizationDate || t.plannedDate);
    return date.getFullYear() === selectedYear.value;
  });
});

const chartData = computed(() => {
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Cash In',
        backgroundColor: '#4ade80', // A vibrant green
        data: Array(12).fill(0)
      },
      {
        label: 'Cash Out',
        backgroundColor: '#f87171', // A soft red
        data: Array(12).fill(0)
      }
    ]
  };

  yearlyTransactions.value.forEach(t => {
    const date = new Date(t.realizationDate || t.plannedDate);
    const month = date.getMonth();
    if (t.type === 'cash-in') {
      monthlyData.datasets[0].data[month] += t.realizationAmount || 0;
    } else if (t.type === 'cash-out') {
      monthlyData.datasets[1].data[month] += t.realizationAmount || 0;
    }
  });

  return monthlyData;
});

const totalYearlyIncome = computed(() => {
  return yearlyTransactions.value
    .filter(t => t.type === 'cash-in' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const totalYearlyOutcome = computed(() => {
  return yearlyTransactions.value
    .filter(t => t.type === 'cash-out' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0);
});

const netYearlyCashFlow = computed(() => totalYearlyIncome.value - totalYearlyOutcome.value);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0);
};

</script>

<template>
  <div class="dashboard-view-container">
    <header class="dashboard-header">
      <h2>Ringkasan Keuangan Tahunan</h2>
      <div class="filter-container">
        <label for="year-filter">Pilih Tahun:</label>
        <select id="year-filter" v-model="selectedYear">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </header>
    <div class="chart-container">
       <BarChart :chart-data="chartData" />
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card income">
        <h3>Total Pemasukan Tahunan</h3>
        <p>{{ formatCurrency(totalYearlyIncome) }}</p>
      </div>
      <div class="card outcome">
        <h3>Total Pengeluaran Tahunan</h3>
        <p>{{ formatCurrency(totalYearlyOutcome) }}</p>
      </div>
      <div class="card net-flow">
        <h3>Arus Kas Bersih Tahunan</h3>
        <p>{{ formatCurrency(netYearlyCashFlow) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view-container {
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-container label {
  font-weight: 500;
}

.filter-container select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  cursor: pointer;
}

.chart-container {
  width: 100%;
  height: 450px; /* Give the chart a fixed height */
}

/* Summary Card Styles */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px; /* Space between chart and cards */
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
</style>
