
import { ref, computed, onMounted } from 'vue';
import { useApi } from './useApi';

export function useCashFlow() {
  const { transactions, fetchTransactions } = useApi();
  const selectedMonth = ref(new Date().getMonth());
  const selectedYear = ref(new Date().getFullYear());
  const filterDateType = ref('planned');

  onMounted(fetchTransactions);

  const filteredTransactions = computed(() => {
    return transactions.value.filter(t => {
      const date = new Date(filterDateType.value === 'planned' ? t.plannedDate : t.realizationDate);
      return date.getMonth() === selectedMonth.value && date.getFullYear() === selectedYear.value;
    });
  });

  return {
    transactions,
    selectedMonth,
    selectedYear,
    filterDateType,
    filteredTransactions,
  };
}
