<template>
  <div class="filter-controls">
    <div class="control-group">
      <label for="month">Month:</label>
      <select id="month" :value="selectedMonth" @change="emit('update:month', parseInt($event.target.value))">
        <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
      </select>
    </div>
    <div class="control-group">
      <label for="year">Year:</label>
      <select id="year" :value="selectedYear" @change="emit('update:year', parseInt($event.target.value))">
        <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>
    <div class="control-group">
      <label>Filter by:</label>
      <div class="radio-group">
        <label>
          <input type="radio" :checked="filterDateType === 'plannedDate'" value="plannedDate" @change="emit('update:filterDateType', $event.target.value)">
          Planned Date
        </label>
        <label>
          <input type="radio" :checked="filterDateType === 'realizationDate'" value="realizationDate" @change="emit('update:filterDateType', $event.target.value)">
          Realization Date
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
  filterDateType: String
});

const emit = defineEmits([
  'update:month',
  'update:year',
  'update:filterDateType'
]);

const yearRange = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
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
  background-color: var(--white-color);
  border-radius: 12px;
  margin-bottom: 30px;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.control-group select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 15px;
  background-color: #f3f4f6;
  padding: 5px;
  border-radius: 8px;
}

.radio-group label {
  margin: 0;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s, color 0.3s;
}

.radio-group input {
  display: none;
}

.radio-group input:checked + label {
  background-color: var(--primary-color);
  color: var(--white-color);
  font-weight: 500;
}
</style>
