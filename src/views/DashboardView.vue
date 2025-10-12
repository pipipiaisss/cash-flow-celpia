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

// Generate a list of years for the filter dropdown
const availableYears = computed(() => {
  if (props.transactions.length === 0) {
    return [currentYear];
  }
  const years = new Set(props.transactions.map(t => new Date(t.realizationDate || t.plannedDate).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
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

  props.transactions.forEach(t => {
    const date = new Date(t.realizationDate || t.plannedDate);
    if (date.getFullYear() === selectedYear.value) {
      const month = date.getMonth();
      if (t.type === 'cash-in') {
        monthlyData.datasets[0].data[month] += t.realizationAmount || 0;
      } else if (t.type === 'cash-out') {
        monthlyData.datasets[1].data[month] += t.realizationAmount || 0;
      }
    }
  });

  return monthlyData;
});
</script>

<template>
  <div class="dashboard-view-container">
    <header class="dashboard-header">
      <h2>Yearly Financial Summary</h2>
      <div class="filter-container">
        <label for="year-filter">Select Year:</label>
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
</style>
