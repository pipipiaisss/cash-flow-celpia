<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="filter-container">
        <i class="fas fa-calendar-alt"></i>
        <select id="year-filter" v-model="selectedYear">
          <option value="all">All Years</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card income">
        <div class="card-header">
          <i class="fas fa-arrow-up"></i>
          <span>Total Pemasukan</span>
        </div>
        <p class="amount">{{ formatCurrency(totalIncome) }}</p>
      </div>
      <div class="summary-card outcome">
        <div class="card-header">
          <i class="fas fa-arrow-down"></i>
          <span>Total Pengeluaran</span>
        </div>
        <p class="amount">{{ formatCurrency(totalOutcome) }}</p>
      </div>
      <div class="summary-card net-flow">
        <div class="card-header">
          <i class="fas fa-balance-scale"></i>
          <span>Arus Kas Bersih</span>
        </div>
        <p class="amount">{{ formatCurrency(netCashFlow) }}</p>
      </div>
    </div>

    <div class="chart-wrapper">
      <h2>{{ chartTitle }}</h2>
      <div class="chart-container">
        <BarChart :chart-data="chartData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BarChart from '../components/BarChart.vue';
import { useTransactions } from '../composables/useTransactions';

const { transactions, fetchTransactions } = useTransactions();

const selectedYear = ref(new Date().getFullYear());

const availableYears = computed(() => {
  if (transactions.value.length === 0) {
    return [new Date().getFullYear()];
  }
  const years = new Set(transactions.value.map(t => new Date(t.realizationDate || t.plannedDate).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
});

const chartTitle = computed(() => 
  selectedYear.value === 'all' 
    ? 'Ringkasan Keuangan Tahunan' 
    : `Ringkasan Keuangan Bulanan ${selectedYear.value}`
);

const yearlyGroupedTransactions = computed(() => {
  const grouped = {};
  transactions.value.forEach(t => {
    const year = new Date(t.realizationDate || t.plannedDate).getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(t);
  });
  return grouped;
});

const chartData = computed(() => {
  let labels, cashIn, cashOut;

  if (selectedYear.value === 'all') {
    labels = availableYears.value.slice().reverse(); 
    cashIn = labels.map(year => 
      (yearlyGroupedTransactions.value[year] || [])
        .filter(t => t.type === 'cash-in' && t.realizationAmount)
        .reduce((sum, t) => sum + t.realizationAmount, 0)
    );
    cashOut = labels.map(year => 
      (yearlyGroupedTransactions.value[year] || [])
        .filter(t => t.type === 'cash-out' && t.realizationAmount)
        .reduce((sum, t) => sum + t.realizationAmount, 0)
    );
  } else {
    const year = parseInt(selectedYear.value);
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTx = (yearlyGroupedTransactions.value[year] || []);
    cashIn = Array(12).fill(0).map((_, month) => 
      monthlyTx
        .filter(t => t.type === 'cash-in' && new Date(t.realizationDate || t.plannedDate).getMonth() === month)
        .reduce((sum, t) => sum + (t.realizationAmount || 0), 0)
    );
    cashOut = Array(12).fill(0).map((_, month) => 
      monthlyTx
        .filter(t => t.type === 'cash-out' && new Date(t.realizationDate || t.plannedDate).getMonth() === month)
        .reduce((sum, t) => sum + (t.realizationAmount || 0), 0)
    );
  }

  return {
    labels,
    datasets: [
      {
        label: 'Cash In',
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 5,
        data: cashIn,
      },
      {
        label: 'Cash Out',
        backgroundColor: '#EC4899',
        borderColor: '#EC4899',
        borderWidth: 1,
        borderRadius: 5,
        data: cashOut,
      },
    ],
  };
});

const filteredTransactions = computed(() => {
  if (selectedYear.value === 'all') {
    return transactions.value;
  }
  const year = parseInt(selectedYear.value, 10);
  return transactions.value.filter(t => {
    const transactionDate = t.realizationDate || t.plannedDate;
    return new Date(transactionDate).getFullYear() === year;
  });
});

const totalIncome = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'cash-in' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0)
);

const totalOutcome = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'cash-out' && t.realizationAmount)
    .reduce((sum, t) => sum + t.realizationAmount, 0)
);

const netCashFlow = computed(() => totalIncome.value - totalOutcome.value);

const formatCurrency = (value) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

onMounted(fetchTransactions);
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.dashboard-container {
  padding: 2rem;
  color: var(--text-color-dark);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.filter-container i {
  color: var(--primary-color);
}

#year-filter {
  background: transparent;
  border: none;
  color: var(--text-color-dark);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

#year-filter:focus {
  outline: none;
}

#year-filter option {
  background: var(--white-color);
  color: var(--text-color-dark);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  padding: 1.5rem;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--text-color-dark);
}

.card-header i {
  font-size: 1.5rem;
}

.income .card-header i {
  color: #22c55e;
}

.outcome .card-header i {
  color: var(--primary-color);
}

.net-flow .card-header i {
  color: #3b82f6;
}

.amount {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-color-dark);
}

.chart-wrapper {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.chart-wrapper h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.chart-container {
  height: 400px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .amount {
    font-size: 1.8rem;
  }
  
  .chart-wrapper {
    padding: 1.5rem;
  }
  
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 1.8rem;
  }

  .amount {
    font-size: 1.6rem;
  }
}
</style>