import { ref, onMounted } from 'vue';
import { useApi } from './useApi'; // Assuming useApi is in the same directory

const { transactions, fetchTransactions: fetchAllTransactions } = useApi();

export function useTransactions() {

  const fetchTransactions = async () => {
    await fetchAllTransactions();
  };

  // Fetch transactions when the composable is first used
  onMounted(fetchTransactions);

  return {
    transactions,
    fetchTransactions,
  };
}
