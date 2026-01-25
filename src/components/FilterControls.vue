<template>
  <div class="filter-controls">
    <div class="control-group search-group">
      <label for="search">Search:</label>
      <div class="input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text"
          id="search"
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          placeholder="Cari nama atau deskripsi..."
        />
      </div>
    </div>
    <div class="control-group">
      <label for="month">Month:</label>
      <select id="month" :value="selectedMonth" @change="emit('update:selectedMonth', parseInt($event.target.value))">
        <option value="0">Semua Bulan</option>
        <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
      </select>
    </div>
    <div class="control-group">
      <label for="year">Year:</label>
      <select id="year" :value="selectedYear" @change="emit('update:selectedYear', parseInt($event.target.value))">
        <option value="0">Semua Tahun</option>
        <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>
    <div class="control-group">
      <label>Filter by:</label>
      <div class="radio-group">
        <label>
          <input type="radio" :checked="filterDateType === 'plannedDate'" value="plannedDate" @change="emit('update:filterDateType', $event.target.value)">
          <span>Planned Date</span>
        </label>
        <label>
          <input type="radio" :checked="filterDateType === 'realizationDate'" value="realizationDate" @change="emit('update:filterDateType', $event.target.value)">
          <span>Realization Date</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  selectedMonth: Number,
  selectedYear: Number,
  filterDateType: String,
  searchQuery: String,
  transactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits([
  'update:selectedMonth',
  'update:selectedYear',
  'update:filterDateType',
  'update:searchQuery'
]);

const availableYears = computed(() => {
  if (props.transactions.length === 0) {
    return [new Date().getFullYear()];
  }

  const transactionYears = props.transactions.map(t => new Date(t.realizationDate || t.plannedDate).getFullYear());
  const uniqueYears = [...new Set(transactionYears)].filter(y => !isNaN(y));
  const firstYear = Math.min(...uniqueYears);
  const currentYear = new Date().getFullYear();

  const years = [];
  for (let year = currentYear; year >= firstYear; year--) {
    years.push(year);
  }

  return years.length > 0 ? years : [currentYear];
});

const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', { month: 'long' });
};
</script>

<style scoped>
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  margin-bottom: 30px;
  align-items: flex-end;
  border: 1px solid rgba(236, 72, 153, 0.2);
  backdrop-filter: blur(10px);
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color-dark);
}

.search-group {
    flex-grow: 1;
    min-width: 250px;
}

.input-wrapper {
    position: relative;
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #9CA3AF; /* A slightly muted gray */
    pointer-events: none; /* Make sure the icon doesn't block clicks on the input */
}

.control-group input[type="text"] {
    padding-left: 40px !important; 
    transition: border-color 0.2s, box-shadow 0.2s;
}

.control-group input[type="text"]:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
    outline: none;
}

.control-group input[type="text"]:focus + .search-icon {
    color: var(--primary-color);
}

.control-group select, .control-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-color-dark);
  font-size: 1rem;
  box-sizing: border-box; 
}

.control-group select option {
  background: var(--white-color);
  color: var(--text-color-dark);
}

.radio-group {
  display: flex;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 5px;
  border-radius: 8px;
}

.radio-group label {
  margin: 0;
  cursor: pointer;
}

.radio-group span {
    padding: 10px 12px;
    border-radius: 6px;
    transition: background-color 0.3s, color 0.3s;
    display: block;
    color: var(--text-color-dark);
}

.radio-group input {
  display: none;
}

.radio-group input:checked + span {
  background-color: var(--primary-color);
  color: var(--white-color);
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-group {
    min-width: 100%;
  }
}
</style>
