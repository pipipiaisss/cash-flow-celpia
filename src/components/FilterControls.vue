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
  transactions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits([
  'update:month',
  'update:year',
  'update:filterDateType'
]);

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  if (props.transactions.length === 0) {
    return [currentYear];
  }

  const firstYear = props.transactions.reduce((minYear, t) => {
    const transactionYear = new Date(t.realizationDate || t.plannedDate).getFullYear();
    return transactionYear < minYear ? transactionYear : minYear;
  }, currentYear);

  const years = [];
  for (let year = currentYear; year >= firstYear; year--) {
    years.push(year);
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
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 30px;
  align-items: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color-light);
}

.control-group select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-color-light);
  font-size: 1rem;
}

.control-group select option {
  background: var(--background-dark);
  color: var(--text-color-light);
}

.radio-group {
  display: flex;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 8px;
}

.radio-group label {
  margin: 0;
  cursor: pointer;
}

.radio-group span {
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.3s, color 0.3s;
    display: block;
}

.radio-group input {
  display: none;
}

.radio-group input:checked + span {
  background-color: var(--primary-color);
  color: var(--background-dark);
  font-weight: 500;
}
</style>
